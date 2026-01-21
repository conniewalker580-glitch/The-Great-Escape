-- The Great Escape - Production Database Schema
-- Database: Vercel Postgres

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    username TEXT,
    tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'explorer', 'adventurer', 'elite', 'master')),
    rooms_played_this_month INTEGER DEFAULT 0,
    total_rooms_completed INTEGER DEFAULT 0,
    total_hints_used INTEGER DEFAULT 0,
    total_play_time_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_reset_date DATE DEFAULT CURRENT_DATE
);

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users(clerk_id) ON DELETE CASCADE,
    tier TEXT NOT NULL CHECK (tier IN ('explorer', 'adventurer', 'elite', 'master')),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT UNIQUE,
    stripe_price_id TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'incomplete')),
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ROOM PROGRESS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS room_progress (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users(clerk_id) ON DELETE CASCADE,
    room_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    stars INTEGER DEFAULT 0 CHECK (stars >= 0 AND stars <= 3),
    rank TEXT CHECK (rank IN ('S', 'A', 'B', 'C', 'D')),
    time_seconds INTEGER,
    hints_used INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    first_completed_at TIMESTAMP,
    last_played_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, room_id)
);

-- ============================================
-- BADGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    badge_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    category TEXT CHECK (category IN ('speed', 'completion', 'mastery', 'exploration', 'special')),
    requirement_type TEXT,
    requirement_value INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- USER BADGES TABLE (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users(clerk_id) ON DELETE CASCADE,
    badge_id TEXT REFERENCES badges(badge_id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- ============================================
-- DAILY REWARDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS daily_rewards (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users(clerk_id) ON DELETE CASCADE,
    reward_date DATE DEFAULT CURRENT_DATE,
    reward_type TEXT CHECK (reward_type IN ('hint', 'bonus_room', 'badge', 'streak')),
    reward_value TEXT,
    claimed BOOLEAN DEFAULT FALSE,
    claimed_at TIMESTAMP,
    UNIQUE(user_id, reward_date)
);

-- ============================================
-- AI HINTS USAGE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ai_hints (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users(clerk_id) ON DELETE CASCADE,
    room_id TEXT NOT NULL,
    puzzle_id TEXT,
    hint_text TEXT,
    was_helpful BOOLEAN,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- USAGE TRACKING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS usage_tracking (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users(clerk_id) ON DELETE CASCADE,
    action_type TEXT CHECK (action_type IN ('room_start', 'room_complete', 'hint_used', 'subscription_change')),
    room_id TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_tier ON users(tier);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_room_progress_user_id ON room_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_room_progress_room_id ON room_progress(room_id);
CREATE INDEX IF NOT EXISTS idx_room_progress_completed ON room_progress(completed);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_rewards_user_date ON daily_rewards(user_id, reward_date);
CREATE INDEX IF NOT EXISTS idx_ai_hints_user_id ON ai_hints(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON usage_tracking(user_id);

-- ============================================
-- SEED INITIAL BADGES
-- ============================================
INSERT INTO badges (badge_id, name, description, icon, category, requirement_type, requirement_value)
VALUES
    ('first_escape', 'First Escape', 'Complete your first room', '🎯', 'completion', 'rooms_completed', 1),
    ('speed_demon', 'Speed Demon', 'Complete a room in under 5 minutes', '⚡', 'speed', 'time_seconds', 300),
    ('no_hints', 'Pure Genius', 'Complete a room without using any hints', '🧠', 'mastery', 'hints_used', 0),
    ('ten_rooms', '10 Room Master', 'Complete 10 rooms', '🏆', 'completion', 'rooms_completed', 10),
    ('fifty_rooms', '50 Room Legend', 'Complete 50 rooms', '👑', 'completion', 'rooms_completed', 50),
    ('hundred_rooms', 'Century Club', 'Complete 100 rooms', '💯', 'completion', 'rooms_completed', 100),
    ('explorer', 'Explorer', 'Try rooms from 5 different themes', '🗺️', 'exploration', 'themes_explored', 5),
    ('perfectionist', 'Perfectionist', 'Get 3 stars on 10 rooms', '⭐', 'mastery', 'three_star_rooms', 10),
    ('daily_player', 'Daily Devotee', 'Play for 7 days in a row', '📅', 'special', 'daily_streak', 7),
    ('hint_master', 'Hint Connoisseur', 'Use the AI hint system 50 times', '💡', 'special', 'ai_hints_used', 50)
ON CONFLICT (badge_id) DO NOTHING;

-- ============================================
-- FUNCTION: Update user's updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Reset monthly usage
-- ============================================
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
    UPDATE users
    SET rooms_played_this_month = 0,
        last_reset_date = CURRENT_DATE
    WHERE last_reset_date < DATE_TRUNC('month', CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.clerk_id,
    u.email,
    u.tier,
    u.total_rooms_completed,
    u.rooms_played_this_month,
    COUNT(DISTINCT rp.room_id) as unique_rooms_completed,
    AVG(rp.stars) as average_stars,
    COUNT(ub.badge_id) as badges_earned,
    s.status as subscription_status
FROM users u
LEFT JOIN room_progress rp ON u.clerk_id = rp.user_id AND rp.completed = TRUE
LEFT JOIN user_badges ub ON u.clerk_id = ub.user_id
LEFT JOIN subscriptions s ON u.clerk_id = s.user_id
GROUP BY u.clerk_id, u.email, u.tier, u.total_rooms_completed, u.rooms_played_this_month, s.status;

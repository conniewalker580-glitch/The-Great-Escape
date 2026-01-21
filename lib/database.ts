import { sql } from '@vercel/postgres';

/**
 * Database connection utility for The Great Escape
 * 
 * MIGRATION NOTICE: This file is being migrated from Vercel Postgres to Firebase Firestore
 * All new code should use the Firebase functions from './firebase-db'
 * This file maintains backward compatibility during the transition
 */

// Re-export Firebase functions as primary database interface
export {
    createUser,
    getUser,
    updateUserTier,
    incrementRoomsPlayed,
    resetMonthlyUsage,
    createSubscription,
    getSubscription,
    updateSubscriptionStatus,
    saveRoomProgress,
    getRoomProgress,
    getAllUserProgress,
    awardBadge,
    getUserBadges,
    checkAndAwardBadges,
    saveAIHint,
    trackUsage,
    createDailyReward,
    claimDailyReward,
    getUserStats,
    initializeDatabase,
} from './firebase-db';


// ============================================
// USER OPERATIONS
// ============================================

export async function createUser(clerkId: string, email: string, username?: string) {
    try {
        const result = await sql`
            INSERT INTO users (clerk_id, email, username, tier)
            VALUES (${clerkId}, ${email}, ${username || null}, 'free')
            ON CONFLICT (clerk_id) DO UPDATE
            SET email = ${email}, username = ${username || null}, updated_at = NOW()
            RETURNING *
        `;
        return result.rows[0];
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

export async function getUser(clerkId: string) {
    try {
        const result = await sql`
            SELECT * FROM users WHERE clerk_id = ${clerkId}
        `;
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}

export async function updateUserTier(clerkId: string, tier: string) {
    try {
        const result = await sql`
            UPDATE users
            SET tier = ${tier}, updated_at = NOW()
            WHERE clerk_id = ${clerkId}
            RETURNING *
        `;
        return result.rows[0];
    } catch (error) {
        console.error('Error updating user tier:', error);
        throw error;
    }
}

export async function incrementRoomsPlayed(clerkId: string) {
    try {
        const result = await sql`
            UPDATE users
            SET rooms_played_this_month = rooms_played_this_month + 1,
                total_rooms_completed = total_rooms_completed + 1,
                updated_at = NOW()
            WHERE clerk_id = ${clerkId}
            RETURNING rooms_played_this_month, tier
        `;
        return result.rows[0];
    } catch (error) {
        console.error('Error incrementing rooms played:', error);
        throw error;
    }
}

export async function resetMonthlyUsage() {
    try {
        await sql`SELECT reset_monthly_usage()`;
        return true;
    } catch (error) {
        console.error('Error resetting monthly usage:', error);
        return false;
    }
}

// ============================================
// SUBSCRIPTION OPERATIONS
// ============================================

export async function createSubscription(data: {
    userId: string;
    tier: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripePriceId: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
}) {
    try {
        const result = await sql`
            INSERT INTO subscriptions (
                user_id, tier, stripe_customer_id, stripe_subscription_id,
                stripe_price_id, status, current_period_start, current_period_end
            )
            VALUES (
                ${data.userId}, ${data.tier}, ${data.stripeCustomerId},
                ${data.stripeSubscriptionId}, ${data.stripePriceId}, 'active',
                ${data.currentPeriodStart.toISOString()}, ${data.currentPeriodEnd.toISOString()}
            )
            ON CONFLICT (stripe_subscription_id) DO UPDATE
            SET tier = ${data.tier},
                status = 'active',
                current_period_start = ${data.currentPeriodStart.toISOString()},
                current_period_end = ${data.currentPeriodEnd.toISOString()},
                updated_at = NOW()
            RETURNING *
        `;

        // Update user tier
        await updateUserTier(data.userId, data.tier);

        return result.rows[0];
    } catch (error) {
        console.error('Error creating subscription:', error);
        throw error;
    }
}

export async function getSubscription(userId: string) {
    try {
        const result = await sql`
            SELECT * FROM subscriptions
            WHERE user_id = ${userId} AND status = 'active'
            ORDER BY created_at DESC
            LIMIT 1
        `;
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error getting subscription:', error);
        return null;
    }
}

export async function updateSubscriptionStatus(stripeSubscriptionId: string, status: string) {
    try {
        const result = await sql`
            UPDATE subscriptions
            SET status = ${status}, updated_at = NOW()
            WHERE stripe_subscription_id = ${stripeSubscriptionId}
            RETURNING *
        `;

        // If canceled, update user tier to free
        if (status === 'canceled' && result.rows[0]) {
            await updateUserTier(result.rows[0].user_id, 'free');
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error updating subscription status:', error);
        throw error;
    }
}

// ============================================
// ROOM PROGRESS OPERATIONS
// ============================================

export async function saveRoomProgress(data: {
    userId: string;
    roomId: string;
    completed: boolean;
    stars: number;
    rank: string;
    timeSeconds: number;
    hintsUsed: number;
}) {
    try {
        const result = await sql`
            INSERT INTO room_progress (
                user_id, room_id, completed, stars, rank,
                time_seconds, hints_used, first_completed_at, last_played_at
            )
            VALUES (
                ${data.userId}, ${data.roomId}, ${data.completed}, ${data.stars},
                ${data.rank}, ${data.timeSeconds}, ${data.hintsUsed}, NOW(), NOW()
            )
            ON CONFLICT (user_id, room_id) DO UPDATE
            SET completed = ${data.completed},
                stars = GREATEST(room_progress.stars, ${data.stars}),
                rank = CASE 
                    WHEN ${data.rank} < room_progress.rank THEN ${data.rank}
                    ELSE room_progress.rank
                END,
                time_seconds = LEAST(room_progress.time_seconds, ${data.timeSeconds}),
                hints_used = ${data.hintsUsed},
                attempts = room_progress.attempts + 1,
                last_played_at = NOW()
            RETURNING *
        `;

        // Update user stats
        if (data.completed) {
            await sql`
                UPDATE users
                SET total_hints_used = total_hints_used + ${data.hintsUsed},
                    total_play_time_seconds = total_play_time_seconds + ${data.timeSeconds}
                WHERE clerk_id = ${data.userId}
            `;
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error saving room progress:', error);
        throw error;
    }
}

export async function getRoomProgress(userId: string, roomId: string) {
    try {
        const result = await sql`
            SELECT * FROM room_progress
            WHERE user_id = ${userId} AND room_id = ${roomId}
        `;
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error getting room progress:', error);
        return null;
    }
}

export async function getAllUserProgress(userId: string) {
    try {
        const result = await sql`
            SELECT * FROM room_progress
            WHERE user_id = ${userId}
            ORDER BY last_played_at DESC
        `;
        return result.rows;
    } catch (error) {
        console.error('Error getting all user progress:', error);
        return [];
    }
}

// ============================================
// BADGE OPERATIONS
// ============================================

export async function awardBadge(userId: string, badgeId: string) {
    try {
        const result = await sql`
            INSERT INTO user_badges (user_id, badge_id)
            VALUES (${userId}, ${badgeId})
            ON CONFLICT (user_id, badge_id) DO NOTHING
            RETURNING *
        `;
        return result.rows[0];
    } catch (error) {
        console.error('Error awarding badge:', error);
        return null;
    }
}

export async function getUserBadges(userId: string) {
    try {
        const result = await sql`
            SELECT b.*, ub.earned_at
            FROM badges b
            JOIN user_badges ub ON b.badge_id = ub.badge_id
            WHERE ub.user_id = ${userId}
            ORDER BY ub.earned_at DESC
        `;
        return result.rows;
    } catch (error) {
        console.error('Error getting user badges:', error);
        return [];
    }
}

export async function checkAndAwardBadges(userId: string) {
    try {
        const user = await getUser(userId);
        if (!user) return [];

        const badges = await sql`SELECT * FROM badges`;
        const newBadges = [];

        for (const badge of badges.rows) {
            // Check if user already has this badge
            const hasBadge = await sql`
                SELECT 1 FROM user_badges
                WHERE user_id = ${userId} AND badge_id = ${badge.badge_id}
            `;

            if (hasBadge.rows.length > 0) continue;

            // Check if user meets requirements
            let meetsRequirement = false;

            switch (badge.requirement_type) {
                case 'rooms_completed':
                    meetsRequirement = user.total_rooms_completed >= badge.requirement_value;
                    break;
                case 'time_seconds':
                    const fastRoom = await sql`
                        SELECT 1 FROM room_progress
                        WHERE user_id = ${userId} AND time_seconds <= ${badge.requirement_value}
                        LIMIT 1
                    `;
                    meetsRequirement = fastRoom.rows.length > 0;
                    break;
                case 'hints_used':
                    const noHintRoom = await sql`
                        SELECT 1 FROM room_progress
                        WHERE user_id = ${userId} AND hints_used = 0 AND completed = TRUE
                        LIMIT 1
                    `;
                    meetsRequirement = noHintRoom.rows.length > 0;
                    break;
            }

            if (meetsRequirement) {
                const awarded = await awardBadge(userId, badge.badge_id);
                if (awarded) newBadges.push(badge);
            }
        }

        return newBadges;
    } catch (error) {
        console.error('Error checking and awarding badges:', error);
        return [];
    }
}

// ============================================
// AI HINTS OPERATIONS
// ============================================

export async function saveAIHint(data: {
    userId: string;
    roomId: string;
    puzzleId?: string;
    hintText: string;
}) {
    try {
        const result = await sql`
            INSERT INTO ai_hints (user_id, room_id, puzzle_id, hint_text)
            VALUES (${data.userId}, ${data.roomId}, ${data.puzzleId || null}, ${data.hintText})
            RETURNING *
        `;
        return result.rows[0];
    } catch (error) {
        console.error('Error saving AI hint:', error);
        return null;
    }
}

// ============================================
// USAGE TRACKING
// ============================================

export async function trackUsage(data: {
    userId: string;
    actionType: string;
    roomId?: string;
    metadata?: any;
}) {
    try {
        await sql`
            INSERT INTO usage_tracking (user_id, action_type, room_id, metadata)
            VALUES (
                ${data.userId},
                ${data.actionType},
                ${data.roomId || null},
                ${data.metadata ? JSON.stringify(data.metadata) : null}
            )
        `;
    } catch (error) {
        console.error('Error tracking usage:', error);
    }
}

// ============================================
// DAILY REWARDS
// ============================================

export async function createDailyReward(userId: string, rewardType: string, rewardValue: string) {
    try {
        const result = await sql`
            INSERT INTO daily_rewards (user_id, reward_type, reward_value)
            VALUES (${userId}, ${rewardType}, ${rewardValue})
            ON CONFLICT (user_id, reward_date) DO NOTHING
            RETURNING *
        `;
        return result.rows[0];
    } catch (error) {
        console.error('Error creating daily reward:', error);
        return null;
    }
}

export async function claimDailyReward(userId: string) {
    try {
        const result = await sql`
            UPDATE daily_rewards
            SET claimed = TRUE, claimed_at = NOW()
            WHERE user_id = ${userId}
                AND reward_date = CURRENT_DATE
                AND claimed = FALSE
            RETURNING *
        `;
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error claiming daily reward:', error);
        return null;
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export async function getUserStats(userId: string) {
    try {
        const result = await sql`
            SELECT * FROM user_stats WHERE clerk_id = ${userId}
        `;
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error getting user stats:', error);
        return null;
    }
}

export async function initializeDatabase() {
    try {
        // This function can be called to ensure tables exist
        // In production, run the schema.sql file manually or via migration tool
        console.log('Database initialized. Run schema.sql to create tables.');
        return true;
    } catch (error) {
        console.error('Error initializing database:', error);
        return false;
    }
}

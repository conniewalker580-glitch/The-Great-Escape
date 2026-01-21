# 🗄️ Database Setup Guide - The Great Escape

## Overview

The Great Escape uses **Vercel Postgres** as its production database. This guide will help you set up and configure the database.

## Prerequisites

- Vercel account
- The Great Escape project deployed or ready to deploy on Vercel
- Node.js 20.x installed locally

---

## Step 1: Create Vercel Postgres Database

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your project (or create one)

2. **Navigate to Storage**
   - Click on the "Storage" tab
   - Click "Create Database"

3. **Select Postgres**
   - Choose "Postgres"
   - Select your region (choose closest to your users)
   - Click "Create"

4. **Get Connection String**
   - Once created, click on your database
   - Go to ".env.local" tab
   - Copy the `POSTGRES_URL` value

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Create Postgres database
vercel postgres create

# Pull environment variables
vercel env pull .env.local
```

---

## Step 2: Configure Environment Variables

### Local Development (.env.local)

Add these to your `.env.local` file:

```env
# Vercel Postgres (automatically added if you used Vercel CLI)
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."

# Existing variables (keep these)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
STRIPE_SECRET_KEY=...
# ... etc
```

### Production (Vercel Dashboard)

The database environment variables are automatically added when you create the database in Vercel. No manual configuration needed!

---

## Step 3: Initialize Database Schema

### Run the initialization script:

```bash
npm run db:init
```

This will:
- ✅ Create all tables (users, subscriptions, progress, badges, etc.)
- ✅ Set up indexes for performance
- ✅ Create triggers for automatic updates
- ✅ Create views for analytics
- ✅ Seed initial badges

### Expected Output:

```
🗄️  Initializing The Great Escape Database...

📄 Reading schema.sql...
📝 Found 45 SQL statements

⚙️  Executing statement 1/45...
✅ Success

... (continues for all statements)

🎉 Database initialization complete!

📊 Database Summary:
   ✓ Users table
   ✓ Subscriptions table
   ✓ Room progress table
   ✓ Badges table
   ✓ User badges table
   ✓ Daily rewards table
   ✓ AI hints table
   ✓ Usage tracking table
   ✓ Indexes created
   ✓ Triggers set up
   ✓ Views created
   ✓ Initial badges seeded

✨ Your database is ready to use!
```

---

## Step 4: Verify Database Setup

### Check Tables

You can verify your database in the Vercel Dashboard:

1. Go to your Postgres database in Vercel
2. Click "Data" tab
3. You should see these tables:
   - `users`
   - `subscriptions`
   - `room_progress`
   - `badges`
   - `user_badges`
   - `daily_rewards`
   - `ai_hints`
   - `usage_tracking`

### Test Connection

Run the development server:

```bash
npm run dev
```

Then:
1. Sign up for an account
2. Play a room
3. Check the database - you should see:
   - New user in `users` table
   - Progress in `room_progress` table
   - Usage tracked in `usage_tracking` table

---

## Database Schema

### Tables Overview

| Table | Purpose | Key Fields |
|-------|---------|------------|
| **users** | User accounts | clerk_id, email, tier, rooms_played_this_month |
| **subscriptions** | Stripe subscriptions | user_id, tier, stripe_subscription_id, status |
| **room_progress** | Room completion data | user_id, room_id, stars, rank, time_seconds |
| **badges** | Available badges | badge_id, name, category, requirement_type |
| **user_badges** | Earned badges | user_id, badge_id, earned_at |
| **daily_rewards** | Daily reward system | user_id, reward_date, reward_type, claimed |
| **ai_hints** | AI hint usage | user_id, room_id, hint_text |
| **usage_tracking** | Analytics | user_id, action_type, room_id, metadata |

### Relationships

```
users (1) ──── (many) subscriptions
users (1) ──── (many) room_progress
users (1) ──── (many) user_badges
users (1) ──── (many) daily_rewards
users (1) ──── (many) ai_hints
users (1) ──── (many) usage_tracking

badges (1) ──── (many) user_badges
```

---

## Features Enabled by Database

### ✅ User Management
- Automatic user creation on first sign-in
- Tier management (free, explorer, adventurer, elite, master)
- Monthly usage tracking and reset

### ✅ Subscription Management
- Stripe integration
- Automatic tier updates
- Subscription status tracking
- Period management

### ✅ Progress Tracking
- Room completion history
- Star ratings (0-3)
- Rank system (S, A, B, C, D)
- Time tracking
- Hint usage tracking

### ✅ Badges & Achievements
- 10 initial badges
- Automatic badge awarding
- Badge categories (speed, completion, mastery, exploration, special)
- Earned timestamp tracking

### ✅ Daily Rewards
- Daily reward generation
- Claim tracking
- Streak support

### ✅ AI Hints
- Hint history
- Usage analytics
- Helpfulness tracking

### ✅ Analytics
- User activity tracking
- Room popularity
- Conversion metrics
- Usage patterns

---

## Database Maintenance

### Monthly Usage Reset

The database automatically resets monthly usage on the first day of each month. This is handled by:

1. **Automatic Reset Function**
   ```sql
   SELECT reset_monthly_usage();
   ```

2. **Triggered on User Access**
   - Checked in `/api/play/track` route
   - Resets `rooms_played_this_month` to 0

### Backup Strategy

**Vercel Postgres includes automatic backups:**
- Point-in-time recovery
- 7-day retention
- Automatic snapshots

**Manual Backup (Optional):**
```bash
# Export database
pg_dump $POSTGRES_URL > backup.sql

# Restore database
psql $POSTGRES_URL < backup.sql
```

---

## Troubleshooting

### Error: "Connection refused"

**Solution:**
1. Check `POSTGRES_URL` in `.env.local`
2. Verify database is created in Vercel
3. Ensure you're using the correct region

### Error: "Table already exists"

**Solution:**
This is normal if you run `npm run db:init` multiple times. The script skips existing tables.

### Error: "Permission denied"

**Solution:**
1. Check your Vercel Postgres permissions
2. Ensure you're using the correct credentials
3. Try regenerating the connection string

### Database is slow

**Solution:**
1. Check your Vercel plan (upgrade if needed)
2. Review indexes (already optimized in schema)
3. Consider connection pooling (enabled by default)

---

## Migration from JSON to Database

If you have existing data in `data/db.json`, here's how to migrate:

### 1. Export existing data

```javascript
// scripts/export-json.js
const fs = require('fs');
const db = require('./data/db.json');

fs.writeFileSync('migration-data.json', JSON.stringify(db, null, 2));
```

### 2. Import to database

```javascript
// scripts/import-to-db.js
const { sql } = require('@vercel/postgres');
const data = require('./migration-data.json');

async function migrate() {
    for (const user of data.users) {
        await sql`
            INSERT INTO users (clerk_id, email, tier, total_rooms_completed)
            VALUES (${user.id}, ${user.email}, ${user.tier}, ${user.completedHistory?.length || 0})
            ON CONFLICT (clerk_id) DO NOTHING
        `;
    }
}

migrate();
```

---

## Performance Optimization

### Indexes (Already Created)

The schema includes optimized indexes for:
- User lookups by Clerk ID
- Subscription queries by user
- Room progress by user and room
- Badge queries
- Usage tracking

### Connection Pooling

Vercel Postgres uses connection pooling by default via `POSTGRES_PRISMA_URL`.

### Query Optimization

Use the provided database functions in `lib/database.ts` - they're optimized for performance.

---

## Security

### Environment Variables

**Never commit these to Git:**
- `POSTGRES_URL`
- `POSTGRES_PASSWORD`
- Any `POSTGRES_*` variables

### SQL Injection Protection

All database functions use parameterized queries via `@vercel/postgres`, which prevents SQL injection.

### Access Control

- Database is only accessible via Vercel's secure connection
- No public access
- Automatic SSL/TLS encryption

---

## Monitoring

### Vercel Dashboard

Monitor your database in Vercel:
1. Go to Storage → Your Database
2. View:
   - Query performance
   - Connection count
   - Storage usage
   - Error logs

### Usage Limits

**Hobby Plan (Free):**
- 256 MB storage
- 60 hours compute time/month
- Connection pooling

**Pro Plan:**
- 512 MB storage
- Unlimited compute
- Advanced metrics

---

## Next Steps

1. ✅ Database is set up
2. ✅ Schema is initialized
3. ✅ API routes are connected

**Now you can:**
- Run `npm run dev` to test locally
- Deploy to Vercel for production
- Monitor usage in Vercel Dashboard
- Scale as your user base grows

---

## Support

**Issues with database setup?**
- Check Vercel Postgres docs: https://vercel.com/docs/storage/vercel-postgres
- Review `database/schema.sql` for table structure
- Check `lib/database.ts` for available functions
- See troubleshooting section above

**Need help?**
- Email: snapmoodsai@gmail.com
- GitHub Issues: [Your Repo]

---

**Database Status:** ✅ Production Ready

Last Updated: 2026-01-21

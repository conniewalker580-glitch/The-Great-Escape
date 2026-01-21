# 🗄️ Vercel Postgres Database Setup - Complete Guide

## ⚡ Quick Setup (5 Minutes)

**Database Name:** `great_escape_db`  
**Plan:** Hobby (Free)  
**Region:** Auto-select closest

---

## 🚀 Step-by-Step Instructions

### **Step 1: Create Database via Vercel CLI** (Recommended)

```bash
# Navigate to project directory
cd "c:\Users\Compaq\The Great Escape"

# Login to Vercel (if not already logged in)
vercel login

# Link your project (if not already linked)
vercel link

# Create Postgres database
vercel postgres create great_escape_db

# Select options when prompted:
# - Region: Choose closest to your users (or default)
# - Plan: Hobby (Free)
```

**Expected Output:**
```
✅ Created Postgres database great_escape_db
📍 Region: [your-region]
💾 Storage: 256 MB (Hobby plan)
🔗 Connection string added to project
```

### **Step 2: Pull Environment Variables**

```bash
# Pull all database environment variables to .env.local
vercel env pull .env.local
```

**This will add:**
```env
POSTGRES_URL=postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb
POSTGRES_PRISMA_URL=postgres://default:xxx@xxx-pooler.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15
POSTGRES_URL_NON_POOLING=postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb
POSTGRES_USER=default
POSTGRES_HOST=xxx.postgres.vercel-storage.com
POSTGRES_PASSWORD=xxx
POSTGRES_DATABASE=verceldb
```

---

### **Alternative: Create Database via Vercel Dashboard**

If you prefer using the web interface:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project (or import from GitHub first)

2. **Navigate to Storage**
   - Click "Storage" tab
   - Click "Create Database"

3. **Select Postgres**
   - Choose "Postgres"
   - Name: `great_escape_db`
   - Region: Select closest to your users
   - Plan: Hobby (Free)

4. **Create Database**
   - Click "Create"
   - Wait for provisioning (~30 seconds)

5. **Get Connection Strings**
   - Go to ".env.local" tab
   - Copy all `POSTGRES_*` variables
   - Paste into your local `.env.local` file

---

## 🔧 Step 3: Initialize Database Schema

Once the database is created and environment variables are set:

```bash
# Run database initialization script
npm run db:init
```

**Expected Output:**
```
🗄️  Initializing The Great Escape Database...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Reading schema.sql...
📝 Found 45 SQL statements

⚙️  Executing statement 1/45...
✅ Success

⚙️  Executing statement 2/45...
✅ Success

... (continues for all statements)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

📋 Tables in database:
   • badges
   • daily_rewards
   • room_progress
   • subscriptions
   • usage_tracking
   • user_badges
   • users
   • ai_hints

✨ Your database is ready to use!
```

---

## ✅ Step 4: Verify Database Connection

Test the database connection locally:

```bash
# Start development server
npm run dev
```

Then test these endpoints:

### **Test 1: User Creation**
1. Visit `http://localhost:3000`
2. Sign up for an account (Clerk)
3. Check terminal - should see database queries
4. Check Vercel Dashboard → Storage → great_escape_db → Data
5. Verify user appears in `users` table

### **Test 2: Room Progress**
1. Play a room (e.g., room-1)
2. Complete the puzzle
3. Check `room_progress` table
4. Verify progress was saved

### **Test 3: Subscription**
1. Go to pricing page
2. Click subscribe (use test mode)
3. Complete Stripe checkout
4. Check `subscriptions` table
5. Verify subscription was created

---

## 🔗 Step 5: Link Database to Production

### **Environment Variables are Auto-Linked**

When you created the database via Vercel CLI or Dashboard, the environment variables were automatically added to your Vercel project.

**To verify:**

```bash
# Check production environment variables
vercel env ls
```

**You should see:**
- `POSTGRES_URL` (Production)
- `POSTGRES_PRISMA_URL` (Production)
- `POSTGRES_URL_NON_POOLING` (Production)
- `POSTGRES_USER` (Production)
- `POSTGRES_HOST` (Production)
- `POSTGRES_PASSWORD` (Production)
- `POSTGRES_DATABASE` (Production)

### **If Variables Are Missing:**

Add them manually:

```bash
# Add each variable to production
vercel env add POSTGRES_URL production
# Paste value when prompted

vercel env add POSTGRES_PRISMA_URL production
# Paste value when prompted

# Repeat for all POSTGRES_* variables
```

---

## 🧪 Step 6: Test Production Database

After deploying to Vercel:

### **Test Database Connection**

1. **Visit your production URL**
   ```
   https://your-app.vercel.app
   ```

2. **Sign up for a test account**
   - Use a test email
   - Complete sign-up

3. **Check Vercel Dashboard**
   - Storage → great_escape_db → Data
   - Verify user was created in `users` table

4. **Play a room**
   - Complete a puzzle
   - Check `room_progress` table
   - Verify progress saved

5. **Test subscription**
   - Go to pricing page
   - Subscribe to Explorer tier
   - Use test card: `4242 4242 4242 4242`
   - Check `subscriptions` table
   - Verify subscription created

---

## 🔐 Step 7: Verify Stripe Integration

### **Test Webhook → Database Flow**

1. **Complete a test subscription**
   - Use Stripe test mode
   - Card: `4242 4242 4242 4242`

2. **Check Stripe Dashboard**
   - Webhooks → Your webhook
   - Verify events are being sent
   - Check for `checkout.session.completed`

3. **Check Database**
   - Vercel Dashboard → Storage → Data
   - `subscriptions` table should have new record
   - `users` table should show updated tier

4. **Verify in App**
   - User should have access to more rooms
   - Dashboard should show subscription status

---

## 📊 Database Schema Overview

### **Tables Created:**

1. **`users`** - User accounts
   - `clerk_id` (primary key)
   - `email`, `username`
   - `tier` (free, explorer, adventurer, elite, master)
   - `rooms_played_this_month`
   - `total_rooms_completed`
   - `created_at`, `updated_at`

2. **`subscriptions`** - Stripe subscriptions
   - `user_id` (foreign key → users)
   - `stripe_subscription_id`
   - `tier`, `status`
   - `current_period_start`, `current_period_end`

3. **`room_progress`** - Room completion
   - `user_id`, `room_id`
   - `completed`, `stars`, `rank`
   - `time_seconds`, `hints_used`
   - `first_completed_at`

4. **`badges`** - Achievement definitions
   - `badge_id`, `name`, `description`
   - `category`, `requirement_type`
   - 10 badges pre-seeded

5. **`user_badges`** - Earned badges
   - `user_id`, `badge_id`
   - `earned_at`

6. **`daily_rewards`** - Daily reward system
   - `user_id`, `reward_date`
   - `reward_type`, `claimed`

7. **`ai_hints`** - AI hint tracking
   - `user_id`, `room_id`
   - `hint_text`, `was_helpful`

8. **`usage_tracking`** - Analytics
   - `user_id`, `action_type`
   - `room_id`, `metadata`

---

## 🔍 Step 8: Verify Database Health

### **Check Database Metrics**

In Vercel Dashboard → Storage → great_escape_db:

1. **Overview Tab**
   - ✅ Status: Active
   - ✅ Region: [your-region]
   - ✅ Plan: Hobby

2. **Data Tab**
   - ✅ All 8 tables visible
   - ✅ Badges table has 10 rows
   - ✅ Users table populates on sign-up

3. **Metrics Tab** (if available)
   - Query performance
   - Connection count
   - Storage usage

### **Run Test Queries**

In Vercel Dashboard → Storage → Data → Query:

```sql
-- Check users
SELECT COUNT(*) FROM users;

-- Check badges
SELECT * FROM badges;

-- Check subscriptions
SELECT * FROM subscriptions;

-- Check room progress
SELECT COUNT(*) FROM room_progress;
```

---

## ✅ Success Criteria

### **Database is Ready When:**

- [x] Database created in Vercel
- [x] Environment variables set (local and production)
- [x] Schema initialized (`npm run db:init` succeeded)
- [x] All 8 tables created
- [x] 10 badges seeded
- [x] Test user can be created
- [x] Room progress saves
- [x] Subscriptions record
- [x] Stripe webhook updates database

---

## 🐛 Troubleshooting

### **Issue: Database creation fails**

**Solution:**
```bash
# Ensure you're logged in
vercel login

# Ensure project is linked
vercel link

# Try again
vercel postgres create great_escape_db
```

### **Issue: Environment variables not found**

**Solution:**
```bash
# Pull environment variables
vercel env pull .env.local

# Verify they were added
cat .env.local | grep POSTGRES
```

### **Issue: Schema initialization fails**

**Solution:**
```bash
# Check database connection
node -e "const { sql } = require('@vercel/postgres'); sql\`SELECT 1\`.then(r => console.log('✅ Connected')).catch(e => console.error('❌ Error:', e))"

# Try initialization again
npm run db:init
```

### **Issue: Production can't connect to database**

**Solution:**
1. Verify environment variables in Vercel Dashboard
2. Redeploy: `vercel --prod`
3. Check deployment logs for errors

### **Issue: Webhook doesn't update database**

**Solution:**
1. Check webhook secret is set in Vercel
2. Verify webhook URL is correct
3. Check Stripe webhook logs for errors
4. Test webhook manually in Stripe Dashboard

---

## 📋 Post-Setup Checklist

- [ ] Database created in Vercel
- [ ] Environment variables pulled locally
- [ ] `npm run db:init` completed successfully
- [ ] All 8 tables exist
- [ ] 10 badges seeded
- [ ] Test user created successfully
- [ ] Room progress saves
- [ ] Environment variables set in Vercel production
- [ ] Production deployment successful
- [ ] Production database connection verified
- [ ] Stripe webhook updates database
- [ ] Subscription flow works end-to-end

---

## 🎉 When Complete

You'll have:

✅ **Vercel Postgres database** running in production  
✅ **All tables initialized** with proper schema  
✅ **Environment variables** configured locally and in production  
✅ **Database connection** verified and working  
✅ **Stripe integration** connected to database  
✅ **Webhook functionality** updating database in real-time  
✅ **Production-ready** database infrastructure  

**Your app is now ready for users!** 🚀

---

## 🔗 Useful Commands

```bash
# Create database
vercel postgres create great_escape_db

# Pull environment variables
vercel env pull .env.local

# Initialize schema
npm run db:init

# Test local connection
npm run dev

# Deploy to production
vercel --prod

# Check environment variables
vercel env ls

# View database in dashboard
# https://vercel.com/dashboard → Storage → great_escape_db
```

---

## 📞 Support

**Vercel Postgres Docs:** https://vercel.com/docs/storage/vercel-postgres  
**Vercel CLI Docs:** https://vercel.com/docs/cli  
**Database Dashboard:** https://vercel.com/dashboard → Storage

---

**Status:** ⏳ **READY TO CREATE DATABASE**

**Next Action:** Run `vercel postgres create great_escape_db`

---

**Estimated Time:** 5-10 minutes  
**Difficulty:** Easy (guided commands)  
**Result:** Production-ready database

# The Great Escape - Database Setup Commands
# Copy and paste these commands one at a time

# ============================================
# STEP 1: CREATE VERCEL POSTGRES DATABASE
# ============================================

# Login to Vercel
vercel login

# Link project
vercel link

# Create database
vercel postgres create great_escape_db

# ============================================
# STEP 2: PULL ENVIRONMENT VARIABLES
# ============================================

# Pull database credentials to .env.local
vercel env pull .env.local

# ============================================
# STEP 3: INITIALIZE DATABASE SCHEMA
# ============================================

# Run database initialization
npm run db:init

# ============================================
# STEP 4: VERIFY LOCAL CONNECTION
# ============================================

# Start development server
npm run dev

# Open browser to http://localhost:3000
# Sign up for a test account
# Play a room to test database

# ============================================
# STEP 5: DEPLOY TO PRODUCTION
# ============================================

# Commit changes
git add .
git commit -m "Add database integration"
git push

# Deploy to Vercel
vercel --prod

# ============================================
# STEP 6: CONFIGURE STRIPE WEBHOOK
# ============================================

# Replace YOUR_URL with your actual Vercel URL
npm run stripe:webhook -- https://YOUR_URL.vercel.app

# ============================================
# STEP 7: ADD WEBHOOK SECRET TO VERCEL
# ============================================

# Add webhook secret to production
vercel env add STRIPE_WEBHOOK_SECRET production
# Paste the value from .env.local when prompted

# ============================================
# STEP 8: REDEPLOY (if needed)
# ============================================

# Redeploy to load new environment variables
vercel --prod

# ============================================
# STEP 9: TEST PRODUCTION
# ============================================

# Run automated tests (replace with your URL)
npm run test:deploy https://YOUR_URL.vercel.app

# ============================================
# STEP 10: VERIFY DATABASE
# ============================================

# Go to Vercel Dashboard
# https://vercel.com/dashboard
# Storage → great_escape_db → Data
# Verify tables exist and data is being saved

# ============================================
# ✅ SETUP COMPLETE!
# ============================================

# Your app is now live with:
# - Vercel Postgres database
# - All tables initialized
# - Stripe integration
# - Webhook configured
# - Production deployment

# Visit your app: https://YOUR_URL.vercel.app

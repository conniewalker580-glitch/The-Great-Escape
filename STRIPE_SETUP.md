# 💳 Stripe Setup Guide - The Great Escape

## 🎯 Quick Setup (3 Steps)

### Step 1: Create Stripe Products
```bash
npm run stripe:setup
```

This will automatically create all 4 subscription tiers in your Stripe account.

### Step 2: Configure Webhook (After Deployment)
```bash
npm run stripe:webhook -- https://your-app-url.vercel.app
```

### Step 3: Test Webhook
```bash
npm run stripe:test-webhook
```

---

## 📦 Products Being Created

| Tier | Price | Rooms | Features |
|------|-------|-------|----------|
| **Free** | $0 | 3/month | Basic access (handled in-app) |
| **Explorer** | $6.99/month | 10/month | AI hints, Progress tracking, Badges |
| **Adventurer** | $12.99/month | 100/month | All Explorer + Priority support |
| **Elite** | $19.99/month | 200/month | All Adventurer + Early access |
| **Master** | $29.99/month | Unlimited | All Elite + Exclusive badge |

---

## 🔧 Detailed Setup Instructions

### Prerequisites

1. ✅ Stripe account created
2. ✅ `STRIPE_SECRET_KEY` in `.env.local`
3. ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env.local`

### Step-by-Step

#### 1. Create Products

Run the automated setup script:

```bash
npm run stripe:setup
```

**What it does:**
- Creates 4 products in Stripe
- Creates monthly recurring prices for each
- Updates `.env.local` with Price IDs
- Saves product details to `stripe-products.json`

**Expected Output:**
```
🎯 The Great Escape - Stripe Product Setup

📦 Creating product: Explorer...
   ✅ Product created: prod_xxxxx
   ✅ Price created: price_xxxxx
   💰 Price: $6.99/month
   🎮 Rooms: 10

📦 Creating product: Adventurer...
   ✅ Product created: prod_xxxxx
   ✅ Price created: price_xxxxx
   💰 Price: $12.99/month
   🎮 Rooms: 100

📦 Creating product: Elite...
   ✅ Product created: prod_xxxxx
   ✅ Price created: price_xxxxx
   💰 Price: $19.99/month
   🎮 Rooms: 200

📦 Creating product: Master Escape...
   ✅ Product created: prod_xxxxx
   ✅ Price created: price_xxxxx
   💰 Price: $29.99/month
   🎮 Rooms: unlimited

📝 Environment Variables

NEXT_PUBLIC_STRIPE_PRICE_EXPLORER=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_ADVENTURER=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_ELITE=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_MASTER=price_xxxxx

✅ Updated .env.local with new Price IDs
✅ Saved product details to stripe-products.json

🎉 Stripe products setup complete!
```

#### 2. Deploy Your App

Before setting up webhooks, deploy your app to Vercel:

```bash
# Commit changes
git add .
git commit -m "Add Stripe product configuration"
git push

# Deploy
vercel --prod
```

Get your production URL (e.g., `https://the-great-escape.vercel.app`)

#### 3. Configure Webhook

Run the webhook setup with your production URL:

```bash
npm run stripe:webhook -- https://your-app-url.vercel.app
```

**What it does:**
- Creates webhook endpoint in Stripe
- Configures it to listen for subscription events
- Updates `.env.local` with webhook secret
- Saves webhook details to `stripe-webhook.json`

**Expected Output:**
```
🔗 The Great Escape - Stripe Webhook Setup

📍 Webhook URL: https://your-app-url.vercel.app/api/webhooks/stripe

📝 Creating webhook endpoint...
✅ Webhook created successfully!

   ID: we_xxxxx
   URL: https://your-app-url.vercel.app/api/webhooks/stripe
   Status: enabled

📋 Listening for events:
   • checkout.session.completed
   • customer.subscription.created
   • customer.subscription.updated
   • customer.subscription.deleted
   • invoice.payment_succeeded
   • invoice.payment_failed

✅ Updated .env.local with webhook secret

🎉 Webhook setup complete!
```

#### 4. Update Vercel Environment Variables

After webhook setup, add the webhook secret to Vercel:

```bash
# Pull latest env vars
vercel env pull .env.local

# Or manually add in Vercel Dashboard:
# Settings → Environment Variables → Add
# Key: STRIPE_WEBHOOK_SECRET
# Value: whsec_xxxxx (from .env.local)
```

#### 5. Test Webhook

```bash
npm run stripe:test-webhook
```

Or manually test in Stripe Dashboard:
1. Go to https://dashboard.stripe.com/webhooks
2. Click on your webhook
3. Click "Send test webhook"
4. Select "checkout.session.completed"
5. Click "Send test webhook"

---

## 🧪 Testing the Subscription Flow

### Local Testing (Test Mode)

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Visit pricing page:**
   ```
   http://localhost:3000/pricing
   ```

3. **Click "Subscribe" on any tier**

4. **Use Stripe test card:**
   ```
   Card: 4242 4242 4242 4242
   Expiry: Any future date
   CVC: Any 3 digits
   ZIP: Any 5 digits
   ```

5. **Complete checkout**

6. **Verify in database:**
   - Check Vercel Dashboard → Storage → Your Database
   - Look for new subscription in `subscriptions` table
   - User tier should be updated in `users` table

### Production Testing

1. **Deploy to Vercel**
2. **Use real Stripe account (live mode)**
3. **Test with real card or Stripe test cards**
4. **Monitor webhook events in Stripe Dashboard**

---

## 🔐 Security Checklist

- [x] ✅ Webhook signature verification enabled
- [x] ✅ Environment variables not committed to Git
- [x] ✅ Stripe keys stored securely
- [x] ✅ HTTPS enforced for webhooks
- [x] ✅ User authentication required (Clerk)
- [x] ✅ Metadata includes user ID for tracking

---

## 📊 Monitoring

### Stripe Dashboard

Monitor your subscriptions:
- **Products:** https://dashboard.stripe.com/products
- **Subscriptions:** https://dashboard.stripe.com/subscriptions
- **Webhooks:** https://dashboard.stripe.com/webhooks
- **Events:** https://dashboard.stripe.com/events

### Vercel Database

Check subscription data:
1. Go to Vercel Dashboard
2. Storage → Your Postgres Database
3. Data tab → `subscriptions` table

---

## 🐛 Troubleshooting

### Products Not Created

**Error:** `STRIPE_SECRET_KEY not found`
- **Fix:** Add your Stripe secret key to `.env.local`

**Error:** `Authentication failed`
- **Fix:** Verify your Stripe secret key is correct
- **Fix:** Check if key is for correct mode (test vs live)

### Webhook Not Working

**Error:** `Webhook endpoint not found`
- **Fix:** Ensure app is deployed and accessible
- **Fix:** Verify URL is correct (no trailing slash)

**Error:** `Signature verification failed`
- **Fix:** Check `STRIPE_WEBHOOK_SECRET` in `.env.local`
- **Fix:** Ensure webhook secret matches Stripe Dashboard

**Error:** `No webhook events received`
- **Fix:** Test webhook in Stripe Dashboard
- **Fix:** Check app logs for errors
- **Fix:** Verify webhook URL is publicly accessible

### Subscription Not Updating

**Error:** `User tier not changing`
- **Fix:** Check webhook is receiving events
- **Fix:** Verify database connection
- **Fix:** Check `app/api/webhooks/stripe/route.ts` for errors

---

## 📝 Environment Variables Reference

After setup, your `.env.local` should have:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx

# Product Price IDs (auto-added by setup script)
NEXT_PUBLIC_STRIPE_PRICE_EXPLORER=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_ADVENTURER=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_ELITE=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_MASTER=price_xxxxx

# Webhook Secret (auto-added by webhook script)
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

---

## 🚀 Quick Commands Reference

```bash
# Create Stripe products
npm run stripe:setup

# Configure webhook (after deployment)
npm run stripe:webhook -- https://your-app.vercel.app

# Test webhook
npm run stripe:test-webhook

# View products in Stripe
# https://dashboard.stripe.com/products

# View webhooks in Stripe
# https://dashboard.stripe.com/webhooks
```

---

## ✅ Completion Checklist

- [ ] Stripe account created
- [ ] API keys added to `.env.local`
- [ ] Products created (`npm run stripe:setup`)
- [ ] App deployed to Vercel
- [ ] Webhook configured (`npm run stripe:webhook`)
- [ ] Webhook secret added to Vercel env vars
- [ ] Test subscription flow completed
- [ ] Database shows subscription data
- [ ] User tier updates correctly

---

## 🎉 You're Ready!

Once all steps are complete:
1. ✅ 4 subscription tiers created in Stripe
2. ✅ Webhook endpoint configured
3. ✅ Environment variables set
4. ✅ Subscription flow tested
5. ✅ Ready for production! 🚀

---

**Need Help?**
- Stripe Docs: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Vercel Docs: https://vercel.com/docs

**Status:** Ready to run `npm run stripe:setup`!

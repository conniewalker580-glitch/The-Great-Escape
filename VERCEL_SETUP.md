# Vercel Deployment - Quick Start

## 🚀 Deploy in 3 Commands

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to production
cd "c:/Users/Compaq/The Great Escape"
vercel --prod
```

## 🔐 Configure Environment Variables (After First Deploy)

After your first deployment, configure these in the Vercel Dashboard:

1. Go to: https://vercel.com/dashboard
2. Select your project: "the-great-escape"
3. Go to: Settings → Environment Variables
4. Add each variable below:

### Required Variables:

| Variable | Where to Get It | Environment |
|----------|----------------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys | Production, Preview, Development |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys | Production, Preview, Development |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API Keys (Test Mode) | Production, Preview, Development |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API Keys (Test Mode) | Production, Preview, Development |
| `HF_API_KEY` | Hugging Face → Settings → Access Tokens | Production, Preview, Development |
| `AI_PROVIDER` | Set to: `huggingface` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL (e.g., `https://your-app.vercel.app`) | Production, Preview, Development |

### Optional Variables:

| Variable | Where to Get It | Environment |
|----------|----------------|-------------|
| `OPENAI_API_KEY` | OpenAI Dashboard → API Keys | Production, Preview, Development |
| `STRIPE_WEBHOOK_SECRET` | Configure after setting up webhooks (see below) | Production |

## 🔗 Post-Deployment Configuration

### 1. Update Clerk Settings
1. Go to Clerk Dashboard → Configure → Paths
2. Add your Vercel URL to allowed origins:
   - `https://your-app.vercel.app`
3. Update redirect URLs if needed

### 2. Configure Stripe Webhooks (Optional - for payment testing)
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-app.vercel.app/api/webhooks/stripe`
4. Select events: `checkout.session.completed`
5. Copy the "Signing secret"
6. Add to Vercel as `STRIPE_WEBHOOK_SECRET`

### 3. Redeploy After Adding Variables
```bash
vercel --prod
```

## 🌐 Your Live URLs

After deployment, you'll get:
- **Production**: `https://your-project.vercel.app`
- **Preview**: Auto-generated for each git push
- **HTTPS**: Enabled automatically (free SSL certificate)

## 📊 Monitoring

- **Logs**: Vercel Dashboard → Your Project → Logs
- **Analytics**: Vercel Dashboard → Analytics
- **Deployments**: Vercel Dashboard → Deployments

## 🔄 Continuous Deployment (Optional)

Connect to GitHub for automatic deployments:
1. Push your code to GitHub
2. In Vercel Dashboard → Import Project
3. Select your GitHub repository
4. Every push to `main` will auto-deploy

## ⚡ Build Configuration

The project is configured to:
- ✅ Ignore TypeScript errors during build
- ✅ Ignore ESLint warnings
- ✅ Use `--legacy-peer-deps` for compatibility
- ✅ Enable security headers
- ✅ Support all Next.js features

## 🆘 Troubleshooting

### Build Fails
```bash
# Test build locally first
npm run build
```

### Environment Variables Not Working
- Ensure all variables are set for the correct environment
- Redeploy after adding variables: `vercel --prod`

### Clerk Authentication Issues
- Verify Clerk domain is added to allowed origins
- Check that both public and secret keys are set

### Stripe Not Working
- Ensure you're using Test Mode keys
- Verify webhook endpoint is configured (if using payments)

## 🎯 Success Checklist

After deployment, verify:
- [ ] App loads at your Vercel URL
- [ ] HTTPS is enabled (🔒 in browser)
- [ ] Sign up / Sign in works
- [ ] Dashboard loads
- [ ] Room generation works
- [ ] Daily challenge generates
- [ ] Stripe checkout opens (if configured)

---

**Need help?** Check the full deployment guide in `DEPLOYMENT.md`

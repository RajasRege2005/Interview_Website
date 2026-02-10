# 🚀 Deployment Guide - Free Hosting

Deploy your Interview Master app for **FREE** with just a few clicks!

## Prerequisites

- GitHub account (free)
- Vercel account (free) 
- Supabase project (free) - see QUICKSTART.md

## Option 1: Deploy to Vercel (Recommended) 🌟

### Step 1: Push to GitHub

1. Initialize Git (if not done):
```powershell
cd interview_website_next
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub:
   - Go to github.com
   - Click "New repository"
   - Name it: `interview-master`
   - Click "Create repository"

3. Push your code:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/interview-master.git
git branch -M main
git push -u origin main
```

### Step 2: Connect Vercel

1. Go to https://vercel.com
2. Click "Sign Up" → Choose "Continue with GitHub"
3. Click "Import Project"
4. Select your `interview-master` repository
5. Click "Import"

### Step 3: Configure Environment Variables

In Vercel project settings:

1. Go to "Settings" → "Environment Variables"
2. Add these:

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: your_supabase_url

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY  
Value: your_supabase_anon_key
```

3. Click "Save"

### Step 4: Deploy!

1. Click "Deploy"
2. Wait 2-3 minutes
3. Your app is live! 🎉

**Your URL**: `https://interview-master-your-username.vercel.app`

### Step 5: Custom Domain (Optional)

Want a custom domain like `interviewmaster.com`?

1. Buy domain from Namecheap/Google Domains (~$10/year)
2. In Vercel: Settings → Domains
3. Add your domain
4. Follow DNS instructions
5. Done in 5 minutes!

## Option 2: Deploy to Netlify

### Step 1: Push to GitHub (same as above)

### Step 2: Connect Netlify

1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub
4. Select your repository
5. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. Add environment variables (same as Vercel)
7. Click "Deploy"

## Option 3: Deploy to Railway

Railway offers free PostgreSQL if you prefer:

1. Go to https://railway.app
2. Click "Start a New Project"
3. Choose "Deploy from GitHub"
4. Select your repository
5. Add environment variables
6. Click "Deploy"

## Automatic Deployments 🤖

Once connected, every time you push to GitHub:
- ✅ Vercel automatically builds
- ✅ Runs tests
- ✅ Deploys to production
- ✅ No manual steps needed!

```powershell
# Make changes
git add .
git commit -m "Added new feature"
git push

# Vercel automatically deploys in 2-3 minutes!
```

## Environment Variables Reference

You need these in your deployment:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional for production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## SSL/HTTPS Certificate 🔒

**All platforms provide FREE SSL automatically!**
- Vercel: Auto-enabled
- Netlify: Auto-enabled  
- Railway: Auto-enabled

Your site will be: `https://...` ✅

## Monitoring & Analytics

### Vercel Analytics (Free)

Add to your app:

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

Install:
```powershell
npm install @vercel/analytics
```

### Supabase Analytics (Built-in)

1. Go to Supabase Dashboard
2. Click "Reports"
3. See:
   - API requests
   - Database usage
   - Storage usage
   - Active users

## Performance Optimization

### 1. Enable Caching

Add to `next.config.ts`:

```typescript
const nextConfig = {
  headers: async () => [
    {
      source: '/:all*(svg|jpg|png)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
}
```

### 2. Enable Compression

Vercel does this automatically! ✅

### 3. Image Optimization

Use Next.js Image component:

```typescript
import Image from 'next/image'

<Image src="/photo.jpg" width={500} height={300} alt="Photo" />
```

## Cost After Free Tier

### When You Exceed Free Limits:

**Vercel Pro ($20/month) gives you:**
- ✅ 100GB bandwidth (vs 100GB free)
- ✅ Unlimited team members
- ✅ Advanced analytics
- ✅ DDoS protection
- ✅ Priority support

**Supabase Pro ($25/month) gives you:**
- ✅ 8GB database (vs 500MB free)
- ✅ 100GB storage (vs 1GB free)
- ✅ 250GB bandwidth (vs 2GB free)
- ✅ Daily backups
- ✅ No pausing

**Total: $45/month for production app**

### Free Tier Limits:

**Vercel Free:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless functions
- ✅ SSL certificate

**Supabase Free:**
- ✅ 500MB database
- ✅ 1GB file storage
- ✅ 2GB bandwidth/month
- ✅ 50,000 monthly active users
- ⚠️ Pauses after 1 week inactivity

**Good for:** Development, testing, small user base (< 1000 users)

## Troubleshooting Deployment

### Build fails

```powershell
# Locally test the build
npm run build

# If it works locally but fails on Vercel:
# - Check environment variables are set
# - Check Node version (use 18+)
```

### Environment variables not working

- No spaces around `=` in .env files
- Use `NEXT_PUBLIC_` prefix for client-side vars
- Redeploy after changing env vars

### Supabase connection fails

- Check CORS is not blocking
- Verify Supabase URL is correct
- Check anon key is correct
- Ensure Supabase project is not paused

### "Module not found" in production

```powershell
# Make sure all dependencies are in package.json
npm install <missing-package> --save
git add package.json package-lock.json
git commit -m "Fix dependencies"
git push
```

## Update Production

```powershell
# Make your changes
# Test locally
npm run dev

# When ready to deploy:
git add .
git commit -m "Description of changes"
git push

# That's it! Vercel deploys automatically
```

## Rollback a Deployment

1. Go to Vercel Dashboard
2. Click your project
3. Go to "Deployments"
4. Find the good deployment
5. Click "..." → "Promote to Production"
6. Done!

## Domain Setup (Optional)

### With Vercel:

1. Buy domain from Namecheap ($10/year)
2. In Vercel: Settings → Domains → Add
3. Enter your domain
4. Add these DNS records at Namecheap:

```
Type: A
Host: @
Value: 76.76.21.21

Type: CNAME
Host: www
Value: cname.vercel-dns.com
```

5. Wait 5-60 minutes for propagation
6. Done! Your site is at your custom domain

### Free Domains:

If you don't want to pay, use Vercel's free subdomain:
- `your-app-name.vercel.app`
- Works perfectly fine!
- SSL included

## Monitoring Uptime

### Use UptimeRobot (Free)

1. Go to https://uptimerobot.com
2. Add your Vercel URL
3. Get email if site goes down
4. Free for 50 monitors!

## Backup Strategy

### Supabase Pro Plan:
- Daily automatic backups
- Point-in-time recovery
- Download backups anytime

### Free Plan:
- Use Supabase CLI to backup:

```powershell
npx supabase db dump -f backup.sql
```

## Security Checklist

✅ Environment variables not in Git
✅ SSL/HTTPS enabled (automatic)
✅ Supabase Row Level Security enabled
✅ API keys are "anon" keys only
✅ No secrets in client-side code

## Success! 🎉

Your app is now live and professional!

**Next Steps:**
1. Share your app URL
2. Test all features
3. Monitor analytics
4. Collect user feedback
5. Iterate and improve!

---

**Questions?** Check the main README.md or QUICKSTART.md

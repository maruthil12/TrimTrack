# 🚀 TrimTrack Deployment Guide

## Quick Deploy to Vercel (Recommended)

Follow these steps to deploy your app with a free database:

### Step 1: Push to GitHub (if not already done)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"Add New Project"**
3. Click **"Import Git Repository"** and select your GitHub repo
4. Click **"Deploy"** (Vercel will auto-detect Next.js)
5. Wait for deployment to complete

### Step 3: Add Postgres Database

1. In your Vercel project dashboard, go to the **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Click **"Continue"** (it's FREE - 256MB, 60 hours/month)
5. Vercel will automatically add environment variables to your project

### Step 4: Initialize Database

1. Go to your project's **"Deployments"** tab
2. Click on the latest deployment URL (e.g., `https://your-app.vercel.app`)
3. Visit: `https://your-app.vercel.app/api/init`
4. You should see: `{"message":"Database initialized successfully"}`

### Step 5: Start Using Your App! 🎉

Your app is now live at: `https://your-app.vercel.app`

**Default Login Credentials:**

**Owner (Admin)**
- Email: `admin@trimtrack.com`
- Password: `admin123`
- PIN: `2568`

**Employee**
- Email: `john@trimtrack.com`
- Password: `user123`

---

## Alternative: Deploy via Vercel CLI

If you prefer using the command line:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

Then follow Steps 3-5 above to add the database.

---

## 💰 Cost Breakdown

- **Hosting**: FREE (Vercel)
- **Database**: FREE (Vercel Postgres - 256MB, 60 hours/month)
- **Total**: $0/month 🎉

---

## 🔧 Troubleshooting

### Sign-in not working?

1. **Make sure you created the Postgres database** in Vercel (Step 3)
2. **Initialize the database** by visiting `/api/init` (Step 4)
3. **Check environment variables**: Go to Vercel project → Settings → Environment Variables
   - You should see `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, etc.
4. **Redeploy**: If you added the database after deployment, go to Deployments → click "..." → Redeploy

### Database errors?

- Visit `/api/init` to reinitialize the database
- Check Vercel logs: Project → Deployments → Click on deployment → View Function Logs

### Need to reset everything?

1. Go to Vercel project → Storage → Your Postgres database
2. Click "Query" tab
3. Run: `DROP TABLE IF EXISTS transactions; DROP TABLE IF EXISTS users;`
4. Visit `/api/init` again

---

## 📞 Need Help?

If you encounter any issues during deployment, check:
- Vercel deployment logs
- Browser console for errors
- Network tab to see API responses

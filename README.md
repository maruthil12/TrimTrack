# TrimTrack

TrimTrack is a professional web application for managing daily employee earnings and profit sharing.

## Features

- **Authentication**: Secure Email/Password login for both Employees and Owners.
- **Role-Based Access**: 
  - **Employees**: Track daily earnings, view personal share.
  - **Owners**: Full dashboard, employee management, financial overview, and monthly archiving.
- **Security**: Owner dashboard protected by an additional PIN (`2568`).
- **Monthly Cleanup**: Automated archiving of transaction data.
- **Responsive Design**: Fully optimized for desktop and mobile devices.
- **Vercel Postgres Database**: Free cloud database with automatic backups!

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run the Development Server**:
    ```bash
    npm run dev
    ```

3.  **Open the App**:
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Default Credentials

**Owner (Admin)**
- Email: `admin@trimtrack.com`
- Password: `admin123`
- PIN: `2568`

**Employee**
- Email: `john@trimtrack.com`
- Password: `user123`

## Deployment to Vercel (with Free Database!)

### Step 1: Deploy to Vercel

1. **Login to Vercel**:
   ```bash
   npx vercel login
   ```

2. **Deploy**:
   ```bash
   npx vercel --prod
   ```

### Step 2: Add Vercel Postgres Database (FREE!)

1. Go to your project on [vercel.com](https://vercel.com)
2. Click on the **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Click **Continue** (it's free!)
6. Your database will be created and environment variables will be automatically set

### Step 3: Initialize the Database

1. After deployment, visit your app URL
2. Go to `/api/init` (e.g., `https://your-app.vercel.app/api/init`)
3. This will create the tables and seed initial users

That's it! Your app is now live with a real database! 🎉

## Project Structure

- `src/app`: Next.js App Router pages and API routes
- `src/lib`: 
  - `db.ts`: Vercel Postgres database operations
  - `types.ts`: TypeScript type definitions
- `src/context`: AuthContext for managing user sessions

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Vercel Postgres (Free tier)
- **Styling**: CSS Modules
- **Icons**: Lucide React
- **Hosting**: Vercel (Free tier)

## Database Features

- ✅ **Free Tier**: 256 MB storage, 60 hours compute time/month
- ✅ **Automatic Backups**: Daily backups included
- ✅ **Serverless**: Scales automatically
- ✅ **No Configuration**: Environment variables set automatically
- ✅ **Production Ready**: Built on PostgreSQL

## Notes

- The free tier is perfect for personal use or small teams
- Database is shared across all users (proper multi-user support)
- All data persists in the cloud
- Automatic SSL/TLS encryption

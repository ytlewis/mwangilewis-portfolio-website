# Manual Deployment Steps for lewisgathaiya.vercel.app

## The Issue

Vercel CLI is having trouble creating a new project automatically. We need to do it manually via the dashboard.

## Solution: Deploy via Vercel Dashboard

### Step 1: Go to Vercel Dashboard

Visit: https://vercel.com/new

### Step 2: Import Your GitHub Repository

1. Click "Import Project"
2. Select "Import Git Repository"
3. Find: `ytlewis/mwangilewis-portfolio-website`
4. Click "Import"

### Step 3: Configure Project

**Project Name**: `lewisgathaiya`

**Framework Preset**: Next.js (should auto-detect)

**Root Directory**: `./` (leave as is)

**Build Command**: `npm run build` (auto-filled)

**Output Directory**: `.next` (auto-filled)

**Install Command**: `npm install` (auto-filled)

### Step 4: Deploy

Click "Deploy"

Wait 1-2 minutes for build to complete

### Step 5: Your Site Will Be Live At:

**https://lewisgathaiya.vercel.app**

## Alternative: Use Current Deployment

Your site is already deployed at:
- https://lewismwangi.com (if DNS is configured)
- Or the current Vercel URL

You can rename the project in settings:
1. Go to: https://vercel.com/lewis-projects-6eb496b8/lewis-portfolio-website/settings
2. Find "Project Name"
3. Change to: `lewisgathaiya`
4. Save
5. New URL: https://lewisgathaiya.vercel.app

## Quick Rename Steps

1. Visit: https://vercel.com/lewis-projects-6eb496b8/lewis-portfolio-website/settings

2. Scroll to "Project Name" section

3. Change from current name to: `lewisgathaiya`

4. Click "Save"

5. Your new URL: **https://lewisgathaiya.vercel.app**

This is the fastest way!

---

**Recommended**: Just rename the existing project in the dashboard. Takes 30 seconds!

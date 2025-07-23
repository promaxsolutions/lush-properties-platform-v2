# Vercel Deployment URLs to Test

Based on your GitHub repository name `promaxsolutions/lush-properties-platform-v2`, try these URLs:

## Primary Deployment URLs:
1. **https://lush-properties-platform-v2.vercel.app/**
2. **https://lush-properties-platform-v2-promaxsolutions.vercel.app/**
3. **https://lush-properties-platform-v2-git-main-promaxsolutions.vercel.app/**

## How to Find Your Exact URL:
1. Go to **https://vercel.com/dashboard**
2. Click on your `lush-properties-platform-v2` project
3. The live URL will be shown at the top of the project page

## Test the Backend:
Once you find the working URL, test the backend by adding `/api/health` to the end:
- Example: `https://your-vercel-url.vercel.app/api/health`
- Should return: `{"status":"healthy","timestamp":"..."}`

## Test Login:
1. Go to your Vercel URL
2. Try logging in with: `admin@lush.com` / `admin123`
3. Should redirect to dashboard without 404 errors

The backend fix we just deployed should resolve all 404 issues after login!
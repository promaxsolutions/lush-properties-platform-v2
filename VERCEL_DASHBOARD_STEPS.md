# Vercel Dashboard Fix - Step by Step

## Problem
Your site shows raw JavaScript code instead of the React app because Vercel is misconfigured.

## Solution: Vercel Dashboard Settings

### Step 1: Access Project Settings
1. Go to [vercel.com](https://vercel.com)
2. Find your project: **lush-properties-platform-v2**
3. Click on the project name
4. Click **Settings** tab

### Step 2: Configure Build Settings
Look for these sections (may be in different tabs):

**In "General" or "Build & Output Settings":**
- **Build Command**: Change to `vite build`
- **Output Directory**: Change to `dist`
- **Install Command**: Should be `npm install`

**If you see "Framework Preset":**
- Set to **Other** or **Vite** (if available)

### Step 3: Environment Variables (Optional)
In "Environment Variables" tab, you might need:
- `NODE_ENV` = `production`

### Step 4: Force Redeploy
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **3 dots menu** → **Redeploy**
4. Check **"Use existing Build Cache"** = OFF
5. Click **Redeploy**

## Alternative: Delete and Reimport
If settings don't work:
1. Delete the Vercel project
2. Re-import from GitHub
3. During import, manually set:
   - Build Command: `vite build`
   - Output Directory: `dist`

## Expected Result
Your URL should show the Lush Properties login page instead of raw code.

## If Still Not Working
The issue might be in your package.json build script. Check that it has:
```json
{
  "scripts": {
    "build": "vite build"
  }
}
```
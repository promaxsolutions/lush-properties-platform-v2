# GitHub Terminal Commands

Run these commands in your terminal to push the Vercel fix:

## Step 1: Remove Git lock files (if needed)
```bash
rm -f .git/index.lock
rm -f .git/refs/heads/main.lock
```

## Step 2: Stage all changes
```bash
git add .
```

## Step 3: Commit the Vercel fix
```bash
git commit -m "Fix: Update Vercel config for static site deployment

- Updated vercel.json to use @vercel/static-build
- Removed serverless function configuration
- Fixed deployment to show React app instead of raw code"
```

## Step 4: Push to GitHub
```bash
git push origin main
```

## Alternative if remote not set:
If you get an error about remote, first run:
```bash
git remote add origin https://github.com/YOUR_USERNAME/lush-properties-platform.git
git push -u origin main
```

## After pushing:
- Vercel will auto-deploy the fix
- Your site should show the actual Lush Properties app
- No more raw JavaScript code display

## Expected result:
Your Vercel URL will display the proper React login interface instead of code.
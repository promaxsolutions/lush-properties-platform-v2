# GitHub Terminal Commands for Local Project

## Current Status
You're in: `~/Downloads/lush-properties-platform`
Latest commit: `1178caf` (just pushed)

## Issue: Vercel Still Building Old Commit
Even though we pushed fixes, Vercel might be cached or using wrong branch.

## Complete Fix Strategy

### 1. Check Current Branch and Status
```bash
cd ~/Downloads/lush-properties-platform
git branch
git status
git log --oneline -5
```

### 2. Force Complete Sync
```bash
git fetch origin
git reset --hard origin/main
git push origin main --force
```

### 3. Alternative: Create New Deployment Branch
```bash
git checkout -b vercel-deploy
git push origin vercel-deploy
```

Then in Vercel dashboard:
- Settings → Git → Change branch to `vercel-deploy`
- Redeploy

### 4. Nuclear Option: Fresh Repository
```bash
cd ~/Downloads
rm -rf lush-properties-platform
git clone https://github.com/promaxsolutions/lush-properties-platform-v2.git
cd lush-properties-platform-v2
```

Then make the import fixes again and push.

## Expected Files After Fix
- `client/src/App.tsx` should have: `import { Toaster } from "./components/ui/toaster";`
- `client/src/components/ui/toaster.tsx` should have: `import { useToast } from "../../hooks/use-toast"`

Run these commands to verify the fix is applied locally before pushing.
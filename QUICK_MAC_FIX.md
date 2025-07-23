# Quick Mac Fix for 404 Errors

## Step 1: Download Latest Files from Replit
1. Go to your Replit project in browser
2. Click the three dots (⋯) next to any file
3. Select "Download as ZIP"
4. This downloads to ~/Downloads/

## Step 2: Extract and Check Files
```bash
cd ~/Downloads
ls -la *.zip
unzip -l replit-*.zip | head -20
```

## Step 3: Install Vercel CLI
```bash
npm install -g vercel
```

## Step 4: Copy Files Manually (Since Download Path Different)
```bash
cd ~/Desktop/projects/lush-properties-platform

# Find your downloaded zip file
ls ~/Downloads/*.zip

# Extract it (replace with actual filename)
cd ~/Downloads
unzip replit-*.zip

# Check what was extracted
ls -la

# Copy the files (adjust path based on what you see)
cp ~/Downloads/api/index.js ~/Desktop/projects/lush-properties-platform/api/
cp ~/Downloads/vercel.json ~/Desktop/projects/lush-properties-platform/
```
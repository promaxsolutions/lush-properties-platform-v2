# Vercel Build Fix

## Problem
The build fails because:
1. Vite config uses Replit-specific plugins that don't exist in Vercel
2. The build output directory is wrong for Vercel
3. Package.json build script includes server bundling

## Solution

### Fix 1: Update vercel.json
Replace your vercel.json with this simple configuration:

```json
{
  "version": 2,
  "buildCommand": "npm run build:client",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": null
}
```

### Fix 2: Add build:client script to package.json
Your package.json needs a client-only build script. Add this to scripts section:

```json
{
  "scripts": {
    "build:client": "vite build --config vite.config.production.ts"
  }
}
```

### Fix 3: Create production Vite config
Create a new file `vite.config.production.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});
```

### Alternative: Simple Dashboard Fix
In Vercel dashboard, set:
- Build Command: `cd client && npx vite build`
- Output Directory: `client/dist`

This bypasses the complex configuration and builds only the React app.
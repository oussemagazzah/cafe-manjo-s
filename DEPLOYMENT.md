# Deployment Guide

This guide will help you deploy your Orderly Table application to GitHub Pages.

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it `cafe-manjo-s` (or your preferred name)
4. **Do NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 2: Push Your Code

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/oussemagazzah/cafe-manjo-s.git

# Push to GitHub
git push -u origin main
```

> **Note**: The code has already been pushed to the repository!

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select **"GitHub Actions"** (NOT "Deploy from a branch")
5. The page will save automatically

## Step 4: Configure Secrets (For Supabase)

If your app uses Supabase, you need to add your credentials:

1. In your repository, go to **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Add these two secrets:

   **Secret 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: Your Supabase project URL (from Supabase dashboard → Settings → API)

   **Secret 2:**
   - Name: `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Value: Your Supabase anon/public key (from Supabase dashboard → Settings → API)

4. Click **"Add secret"** for each

> **Note:** If you're not using Supabase or want to use mock data, you can skip this step. The workflow will still run, but the app may not connect to a database.

## Step 5: Trigger Deployment

The deployment will automatically trigger when you:
- Push to the `main` branch (already done if you pushed in Step 2)
- Or manually trigger it:
  1. Go to **Actions** tab in your repository
  2. Select **"Deploy to GitHub Pages"** workflow
  3. Click **"Run workflow"** → **"Run workflow"**

## Step 6: Check Deployment Status

1. Go to the **Actions** tab in your repository
2. You should see a workflow run called "Deploy to GitHub Pages"
3. Click on it to see the progress
4. Wait for it to complete (usually 2-3 minutes)

## Step 7: Access Your Live Site

Once deployment is complete:

1. Go to **Settings** → **Pages**
2. Your site URL will be shown at the top:
   ```
   https://oussemagazzah.github.io/cafe-manjo-s/
   ```
3. It may take a few minutes for the site to be accessible

## Step 8: Update README

> **Note**: The README has already been updated with the correct demo link!

## Troubleshooting

### Build Fails
- Check the **Actions** tab for error messages
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

### Site Not Loading
- Wait 5-10 minutes after deployment (DNS propagation)
- Check if the workflow completed successfully
- Verify the base path in `vite.config.ts` matches your repository name

### 404 Errors on Routes
- This is normal for SPAs on GitHub Pages
- The `.nojekyll` file should handle this
- If issues persist, check that `vite.config.ts` has the correct base path

## Custom Domain (Optional)

If you want to use a custom domain:

1. Update `vite.config.ts` to set `base: '/'` instead of `/orderly-table-main/`
2. In GitHub Pages settings, add your custom domain
3. Update your DNS records as instructed by GitHub

## Need Help?

- Check GitHub Actions logs in the **Actions** tab
- Review the workflow file: `.github/workflows/deploy.yml`
- GitHub Pages documentation: https://docs.github.com/en/pages


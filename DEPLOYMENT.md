# GitHub Pages Deployment Guide

## 🚀 Deployment Steps

### 1. Set up Supabase Project

1. Go to [Supabase](https://app.supabase.com)
2. Create a new project or use your existing one
3. Go to **Project Settings** → **API**
4. Copy the following values:
   - **Project URL** (VITE_SUPABASE_URL)
   - **anon/public key** (VITE_SUPABASE_PUBLISHABLE_KEY)

### 2. Configure GitHub Repository Secrets

1. Go to your GitHub repository: `https://github.com/miguel11nines/park-it-easy-office`
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:
   - Name: `VITE_SUPABASE_URL`
   - Value: Your Supabase project URL
4. Click **New repository secret** again and add:
   - Name: `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Value: Your Supabase anon/public key

### 3. Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save the settings

### 4. Push Your Changes

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

### 5. Monitor Deployment

1. Go to the **Actions** tab in your repository
2. You should see the "Deploy to GitHub Pages" workflow running
3. Once completed, your site will be available at:
   - `https://miguel11nines.github.io/park-it-easy-office/`

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

## 🔄 Automatic Deployments

Every push to the `main` branch will automatically trigger a new deployment to GitHub Pages.

## 🛠️ Troubleshooting

### Build Fails in GitHub Actions
- Check that your repository secrets are correctly set
- Review the Actions logs for specific error messages

### Supabase Connection Issues
- Verify your Supabase URL and keys are correct
- Check that your Supabase project is active
- Ensure your database migrations have run successfully

### 404 Errors on GitHub Pages
- Make sure the `base` in `vite.config.ts` matches your repository name
- Current setting: `base: "/park-it-easy-office/"`

## 📚 Resources

- [Vite Documentation](https://vitejs.dev/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Supabase Documentation](https://supabase.com/docs)

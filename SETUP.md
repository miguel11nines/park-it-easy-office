# Setup Guide

This guide will help you set up the Park It Easy Office application for local development and deployment.

## Prerequisites

- Node.js (v20 or later) or Bun
- A Supabase account and project
- Git

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/miguel11nines/park-it-easy-office.git
cd park-it-easy-office
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using Bun:
```bash
bun install
```

### 3. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-anon-key
   VITE_SUPABASE_PROJECT_ID=your-project-id
   ```

3. Get these values from your Supabase project:
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Go to Settings > API
   - Copy the Project URL, Project ID, and the `anon` `public` key

### 4. Start Development Server

Using npm:
```bash
npm run dev
```

Or using Bun:
```bash
bun run dev
```

The application will be available at `http://localhost:5173`

## GitHub Actions Deployment Setup

The application is configured to deploy to GitHub Pages automatically when you push to the `main` branch.

### Setting Up GitHub Secrets

For the deployment to work, you need to configure GitHub repository secrets:

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add the following secrets:

   | Secret Name | Description | Example Value |
   |-------------|-------------|---------------|
   | `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase publishable (anon) key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
   | `VITE_SUPABASE_PROJECT_ID` | Your Supabase project ID (optional) | `xxxxxxxxxxxxx` |

### How to Add a Secret

1. Click **New repository secret**
2. Enter the **Name** (e.g., `VITE_SUPABASE_URL`)
3. Enter the **Value** (your actual Supabase URL)
4. Click **Add secret**
5. Repeat for each secret

### Verifying the Setup

After adding the secrets:
1. Push a commit to the `main` branch
2. Go to **Actions** tab in your repository
3. Check that the "Deploy to GitHub Pages" workflow runs successfully
4. Once complete, your site will be available at your GitHub Pages URL

## Security Best Practices

⚠️ **IMPORTANT**: Never commit the `.env` file to version control!

- The `.env` file is listed in `.gitignore` and should never be committed
- Always use `.env.example` as a template for other developers
- Store sensitive credentials only in GitHub Secrets for deployment
- Rotate your Supabase keys if they are accidentally exposed

## Troubleshooting

### Environment Variables Not Loading

If environment variables aren't loading in your local development:

1. Make sure your `.env` file is in the root directory
2. Restart your development server
3. Verify that variables are prefixed with `VITE_`

### Deployment Fails

If GitHub Actions deployment fails:

1. Check that all required secrets are set in repository settings
2. Verify that the secret values are correct (no extra spaces or quotes)
3. Check the Actions logs for specific error messages

## Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Supabase Documentation](https://supabase.com/docs)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

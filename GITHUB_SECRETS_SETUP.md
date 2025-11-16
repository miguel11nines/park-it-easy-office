# GitHub Secrets Configuration Guide

## ⚠️ IMPORTANT: Action Required

The `.env` file has been removed from the repository to protect sensitive credentials. To enable automated deployments via GitHub Actions, you need to configure repository secrets.

## Required GitHub Secrets

The following secrets must be configured in your GitHub repository settings:

| Secret Name | Description | Where to Find |
|-------------|-------------|---------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard > Settings > API > Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon/public key | Supabase Dashboard > Settings > API > Project API keys > `anon` `public` |

## How to Add GitHub Secrets

### Step 1: Navigate to Repository Settings

1. Go to your GitHub repository: https://github.com/miguel11nines/park-it-easy-office
2. Click on **Settings** (you need admin access to the repository)
3. In the left sidebar, expand **Secrets and variables**
4. Click on **Actions**

### Step 2: Add Each Secret

For each secret listed above:

1. Click the **New repository secret** button
2. Enter the **Name** exactly as shown in the table above (e.g., `VITE_SUPABASE_URL`)
3. Enter the **Secret** value (the actual credential from Supabase)
4. Click **Add secret**

### Step 3: Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project (rjbhvzsdytzzinzkdwnk)
3. Navigate to **Settings** > **API**
4. Copy the following values:
   - **Project URL**: This is your `VITE_SUPABASE_URL`
   - **Project API keys** > **anon public**: This is your `VITE_SUPABASE_PUBLISHABLE_KEY`

### Step 4: Verify Configuration

After adding the secrets:

1. Go to the **Actions** tab in your repository
2. Manually trigger the "Deploy to GitHub Pages" workflow:
   - Click on the workflow
   - Click "Run workflow"
   - Select the `main` branch
   - Click "Run workflow"
3. Monitor the workflow run to ensure it completes successfully

## Previous .env File Values

The secrets that were previously in the `.env` file were:

```
VITE_SUPABASE_PROJECT_ID="rjbhvzsdytzzinzkdwnk"
VITE_SUPABASE_URL="https://rjbhvzsdytzzinzkdwnk.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGci..." (see the deleted .env file for full value)
```

⚠️ **Note**: These values are already exposed in the git history. Consider rotating your Supabase keys if you're concerned about security:

1. Go to Supabase Dashboard > Settings > API
2. Generate new keys
3. Update the GitHub secrets with the new values
4. Update any local `.env` files

## Troubleshooting

### Deployment Fails with "Missing Supabase environment variables"

This means the secrets are not configured correctly:
- Verify secret names match exactly (case-sensitive)
- Ensure there are no extra spaces or quotes in the secret values
- Check that you have the correct permissions to add secrets

### How to Update a Secret

1. Go to Settings > Secrets and variables > Actions
2. Click on the secret name
3. Click "Update secret"
4. Enter the new value
5. Click "Update secret"

## Security Best Practices

✅ **DO**:
- Keep secrets in GitHub Secrets for CI/CD
- Use `.env` files locally (never commit them)
- Rotate keys regularly
- Use different keys for development and production

❌ **DON'T**:
- Commit `.env` files to version control
- Share secrets in chat, email, or documentation
- Use production keys in development
- Hard-code secrets in source code

## Need Help?

If you encounter issues:
1. Check the GitHub Actions logs for specific error messages
2. Verify your Supabase project is active and accessible
3. Ensure you're using the correct Supabase project credentials
4. Refer to [SETUP.md](./SETUP.md) for additional setup guidance

# Branch Protection Configuration Guide

## Overview
This document explains how to protect the main branch in this repository so that only the repository owner (@miguel11nines) can commit directly to it.

## Automated Protection
This repository includes automated protection mechanisms:

1. **CODEOWNERS File**: Located at `.github/CODEOWNERS`, this file requires @miguel11nines to review and approve all changes.
2. **GitHub Actions Workflow**: The `protect-main.yml` workflow validates all pushes to main and blocks unauthorized direct commits.

## Manual GitHub Settings Configuration

To fully protect the main branch, you need to configure branch protection rules in GitHub's repository settings. Follow these steps:

### Step 1: Access Branch Protection Settings
1. Go to the repository on GitHub: https://github.com/miguel11nines/park-it-easy-office
2. Click on **Settings** (you must be the repository owner or have admin access)
3. In the left sidebar, click on **Branches**
4. Under "Branch protection rules", click **Add rule** or **Add classic branch protection rule**

### Step 2: Configure Protection Rules
1. In the "Branch name pattern" field, enter: `main`

2. **Enable the following settings**:

   ✅ **Require a pull request before merging**
   - Check "Require approvals" 
   - Set "Required number of approvals before merging" to 1
   - ✅ Check "Dismiss stale pull request approvals when new commits are pushed"
   - ✅ Check "Require review from Code Owners"

   ✅ **Require status checks to pass before merging**
   - ✅ Check "Require branches to be up to date before merging"
   - Select required status checks (e.g., tests, linting)

   ✅ **Require conversation resolution before merging**
   
   ✅ **Require signed commits** (optional but recommended for security)

   ✅ **Require linear history** (optional, prevents merge commits)

   ✅ **Do not allow bypassing the above settings**
   - **IMPORTANT**: Make sure "Allow specified actors to bypass required pull requests" is NOT checked, or if it is, ensure only you (@miguel11nines) are listed

   ✅ **Restrict who can push to matching branches**
   - Click "Restrict pushes"
   - Add only @miguel11nines to the allowed list
   - This ensures ONLY you can push directly to main

   ✅ **Allow force pushes**: UNCHECKED (do not allow)
   
   ✅ **Allow deletions**: UNCHECKED (do not allow)

3. Click **Create** or **Save changes**

### Step 3: Verify Protection
After setting up branch protection:

1. Try to push directly to main from another account (if you have test access)
2. Verify that the push is blocked
3. Create a test pull request and verify it requires your approval

## How This Protects the Main Branch

With these settings in place:
- ✅ Only you (@miguel11nines) can push directly to the main branch
- ✅ All other contributors must create pull requests
- ✅ Pull requests require your approval before merging
- ✅ The CODEOWNERS file ensures you're automatically requested as a reviewer
- ✅ GitHub Actions provide an additional validation layer
- ✅ Force pushes and branch deletion are prevented

## Developer Workflow for Contributors

Contributors should follow this workflow:

```bash
# 1. Create a new branch from main
git checkout main
git pull origin main
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "Description of changes"

# 3. Push to a feature branch
git push origin feature/my-feature

# 4. Create a Pull Request on GitHub
# 5. Wait for @miguel11nines to review and approve
# 6. After approval, @miguel11nines will merge the PR
```

## Emergency Access

If you need to temporarily bypass protection rules (e.g., for emergency fixes):
1. Go to Settings → Branches
2. Temporarily disable the branch protection rule
3. Make your emergency fix
4. Re-enable the branch protection rule immediately after

**Note**: This should only be done in genuine emergencies.

## Additional Resources
- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [CODEOWNERS Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [GitHub Actions Protection](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)

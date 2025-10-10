# Password Reset Email Fix

## 🔴 Problem Identified

The password reset email contains the **WRONG Supabase project URL**:
- **Wrong URL in email**: `https://rjbhvzsdytzzinzkdwnk.supabase.co`
- **Correct URL (your project)**: `https://pxtydgyilnzthmcwlxbn.supabase.co`

This means the reset email is being sent from a **different Supabase project**.

## ✅ Solutions

### Solution 1: Fix Supabase Project Configuration (CRITICAL)

You need to configure the **correct redirect URLs** in your Supabase dashboard:

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com/project/pxtydgyilnzthmcwlxbn

2. **Navigate to Authentication Settings**
   - Click on **Authentication** → **URL Configuration**

3. **Add Redirect URLs**
   Add these URLs to the **Redirect URLs** allowlist:
   ```
   http://localhost:8080/park-pal-work/auth
   https://miguel11nines.github.io/park-pal-work/auth
   ```

4. **Set Site URL**
   - For local development: `http://localhost:8080/park-pal-work/`
   - For production: `https://miguel11nines.github.io/park-pal-work/`

### Solution 2: Verify You're Using the Correct Supabase Project

**Check your `.env` file** (already done - CORRECT ✓):
```env
VITE_SUPABASE_URL="https://pxtydgyilnzthmcwlxbn.supabase.co"
```

**If someone else requested the reset**, they might be using:
- A different `.env` file
- A different Supabase project
- An old/cached configuration

### Solution 3: Code Fix (Already Applied ✓)

I've already updated the code to handle the base path correctly:

**File**: `src/pages/Auth.tsx`
```typescript
// Construct the correct redirect URL
const baseUrl = import.meta.env.BASE_URL || '/';
const redirectUrl = `${window.location.origin}${baseUrl}auth`.replace(/([^:]\/)\/+/g, "$1");

const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
  redirectTo: redirectUrl,
});
```

This ensures the redirect URL is properly formatted as:
- Local: `http://localhost:8080/park-pal-work/auth`
- Production: `https://miguel11nines.github.io/park-pal-work/auth`

## 🔍 How to Test

### Test Locally:

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Request password reset**:
   - Go to: `http://localhost:8080/park-pal-work/`
   - Click "Forgot Password?"
   - Enter your email (must end with `@lht.dlh.de`)

3. **Check the email**:
   - Verify the link contains: `https://pxtydgyilnzthmcwlxbn.supabase.co`
   - Verify it redirects to: `http://localhost:8080/park-pal-work/auth`

### Test in Production:

1. **Deploy to GitHub Pages**:
   ```bash
   git add .
   git commit -m "Fix password reset redirect URL"
   git push origin main
   ```

2. **Request password reset**:
   - Go to: `https://miguel11nines.github.io/park-pal-work/`
   - Follow the same steps as local testing

## 🚨 Important Notes

1. **Email Template Configuration**: The email might be using a custom template. Check:
   - Supabase Dashboard → Authentication → Email Templates
   - Make sure you're not using a hardcoded URL in the template

2. **Multiple Environments**: If you have multiple environments (dev/staging/prod), make sure each has:
   - Correct Supabase project credentials
   - Proper redirect URLs configured

3. **Browser Cache**: Clear browser cache and local storage after making changes:
   ```javascript
   // In browser console:
   localStorage.clear();
   sessionStorage.clear();
   ```

## 🎯 Action Items

- [ ] Configure redirect URLs in Supabase dashboard
- [ ] Set correct Site URL in Supabase dashboard
- [ ] Test password reset locally
- [ ] Deploy and test in production
- [ ] Verify all team members are using the correct `.env` file

## 📧 Support

If the wrong Supabase URL persists:
1. Someone might be using a different project
2. Check if there are multiple `.env` files in the project
3. Verify GitHub repository secrets are correct
4. Contact your team to ensure everyone is on the same Supabase project

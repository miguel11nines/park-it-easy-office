# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Park It Easy Office seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please do NOT:

- Open a public GitHub issue for security vulnerabilities
- Discuss the vulnerability in public forums, chat rooms, or social media

### Please DO:

**Report security vulnerabilities by emailing the maintainers at:**

Create a GitHub Security Advisory at: https://github.com/miguel11nines/park-it-easy-office/security/advisories/new

Or open an issue with the label `security` (for non-critical security concerns only)

### What to include in your report:

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to expect:

- **Acknowledgment**: We will acknowledge your email within 48 hours
- **Assessment**: We will assess the vulnerability and determine its impact and severity
- **Updates**: We will send you regular updates about our progress
- **Resolution**: If we confirm the issue, we will:
  - Develop and test a fix
  - Prepare a security advisory
  - Release a patch
  - Publicly disclose the vulnerability (with credit to you, if desired)

### Security Best Practices for Users

1. **Environment Variables**: Never commit `.env` files or expose Supabase credentials
2. **Dependencies**: Keep all dependencies up to date
3. **Authentication**: Use strong passwords and enable two-factor authentication where possible
4. **HTTPS**: Always use HTTPS in production environments
5. **Regular Updates**: Keep your deployment of Park It Easy Office up to date with the latest security patches

## Security Features

This application implements several security features:

- **Authentication**: Supabase authentication with email/password
- **Row Level Security**: Database policies to ensure users can only access their own data
- **Environment Variables**: All sensitive credentials are stored in environment variables
- **HTTPS**: Enforced in production deployments
- **Input Validation**: Zod schema validation for all user inputs
- **XSS Protection**: React's built-in XSS protection
- **SQL Injection Protection**: Supabase's parameterized queries

## Known Limitations

- This is a client-side application that relies on Supabase Row Level Security (RLS) policies
- Users should implement additional security measures when deploying to production
- Regular security audits of Supabase RLS policies are recommended

## Security Updates

Security updates will be released as soon as possible after a vulnerability is confirmed. Users are encouraged to:

- Watch this repository for security advisories
- Subscribe to release notifications
- Regularly update to the latest version

## Attribution

We appreciate the security research community and will acknowledge researchers who report valid security issues (unless they prefer to remain anonymous).

---

Thank you for helping keep Park It Easy Office and our users safe!

# Code Review & Issues Report

## 🔴 Critical Issues

### 1. **Password Reset Broken - CRITICAL**
**File:** `src/pages/Auth.tsx` (Line 177-215)

**Issue:** The password reset redirect URL construction is problematic:
```typescript
const baseUrl = import.meta.env.BASE_URL || '/';
const redirectUrl = `${window.location.origin}${baseUrl}auth`.replace(/([^:]\/)\/+/g, "$1");
```

**Problems:**
- `import.meta.env.BASE_URL` is not typed in `vite-env.d.ts`
- The regex replacement is fragile and may not handle all cases
- No error handling if Supabase configuration is incorrect
- Email sent from wrong Supabase project (as per user report)

**Fix Required:**
- Validate environment variables at build time
- Add proper error handling
- Test email delivery

### 2. **Missing Error Boundaries** ✅ FIXED
**Files:** All component files

**Issue:** No error boundaries to catch React errors
- If any component crashes, the entire app crashes
- No graceful degradation
- Poor user experience

**Fix Applied:**
- ✅ Added `ErrorBoundary` component
- ✅ Wrapped main app with error boundary in `App.tsx`
- ⚠️ TODO: Log errors to monitoring service (Sentry)

### 3. **Unsafe Type Assertions** ✅ FIXED
**File:** `src/components/BookingDialogWithValidation.tsx` (Line 65, 75, 81, 98)

**Issue:** Unsafe type casts without validation:
```typescript
b.duration as "morning" | "afternoon" | "full"
b.vehicle_type as "car" | "motorcycle"
```

**Fix Applied:**
- ✅ Created type guards (`isDuration`, `isVehicleType`)
- ✅ Validate data from database before using
- ✅ Replaced unsafe type assertions with type guard checks
- ⚠️ TODO: Consider using Zod schemas for more comprehensive validation

## 🟡 High Priority Issues

### 4. **No Input Sanitization**
**Files:** `Auth.tsx`, `BookingDialogWithValidation.tsx`

**Issue:** User inputs are not sanitized before database operations
- Potential for XSS attacks
- SQL injection (mitigated by Supabase, but still risky)

**Fix Required:**
- Sanitize all user inputs
- Use parameterized queries (already done by Supabase)
- Add XSS protection headers

### 5. **Race Conditions in Booking**
**File:** `src/components/BookingDialogWithValidation.tsx` (Line 51-125)

**Issue:** 
- Fetch bookings, then validate, then insert
- Another user could book between fetch and insert
- No database-level constraints to prevent conflicts

**Fix Required:**
- Add unique constraints in database
- Use database transactions
- Handle conflict errors gracefully

### 6. **No Loading States for Auth**
**File:** `src/hooks/useAuth.tsx`

**Issue:** 
- Components render before auth state is determined
- Can cause flashing or incorrect redirects

**Fix Required:**
- Show loading state while checking auth
- Prevent rendering protected content until auth is confirmed

### 7. **Memory Leaks** ✅ FIXED
**File:** `src/pages/Auth.tsx` (Line 36-62)

**Issue:**
- useEffect doesn't handle component unmount properly
- Auth state listener may fire after component unmounts
- Setting state on unmounted component

**Fix Applied:**
```typescript
useEffect(() => {
  let mounted = true;
  // ... auth checks with mounted guard
  if (mounted && session) {
    navigate("/");
  }
  return () => {
    mounted = false;
    subscription.unsubscribe();
  };
}, [navigate]);
```

## 🟠 Medium Priority Issues

### 8. **Duplicate Code**
**Files:** `Auth.tsx` - All handler functions

**Issue:**
- Similar error handling logic repeated in every handler
- Validation logic duplicated
- Toast messages inconsistent

**Fix Required:**
- Extract error handling to utility function
- Create reusable validation hook
- Centralize toast messages

### 9. **No TypeScript Strict Mode** ✅ FIXED
**File:** `tsconfig.json`, `tsconfig.app.json`

**Issue:** TypeScript not in strict mode
- Missing null checks
- Unsafe any types
- Potential runtime errors

**Fix Applied:**
- ✅ Enabled strict mode in `tsconfig.app.json`
- ✅ Enabled `noFallthroughCasesInSwitch`
- ✅ Cleaned up `tsconfig.json` to remove conflicting settings
- ✅ Verified build still works with strict mode
- ✅ All type errors resolved

### 10. **Hard-coded Values**
**Files:** Multiple

**Issue:**
- Email domain hard-coded: `@lht.dlh.de`
- Spot numbers hard-coded: `84`, `85`
- Magic numbers throughout

**Fix Required:**
- Move to environment variables or configuration file
- Create constants file
- Make system configurable

### 11. **No Validation of Supabase Responses**
**Files:** `Index.tsx`, `BookingDialogWithValidation.tsx`

**Issue:**
- Assuming database returns expected shape
- No validation of response data
- Can cause runtime errors

**Fix Required:**
- Create Zod schemas for all database models
- Validate all responses
- Handle unexpected data gracefully

### 12. **Poor Separation of Concerns**
**File:** `src/pages/Index.tsx`

**Issue:**
- Business logic mixed with UI
- Direct Supabase calls in component
- Difficult to test

**Fix Required:**
- Create service layer for API calls
- Extract hooks for business logic
- Separate concerns properly

## 🟢 Low Priority Issues

### 13. **No Tests** ⚠️ PARTIALLY ADDRESSED
**All files**

**Issue:** Zero test coverage
- No unit tests
- No integration tests
- No E2E tests

**Status:**
- ✅ E2E test framework set up (Playwright)
- ✅ 4 E2E test files exist in `e2e/` directory
- ⚠️ Unit test framework configured (Vitest) but no unit tests written
- ⚠️ No integration tests yet

**Remaining Work:**
- Write unit tests for utilities and components
- Write integration tests for user flows
- Add test coverage reporting

### 14. **Console.log Statements**
**Files:** Multiple

**Issue:** console.error used for error logging
- Not suitable for production
- No error tracking
- Logs sensitive information

**Fix Required:**
- Set up proper error tracking (Sentry, LogRocket)
- Remove console statements
- Add structured logging

### 15. **Accessibility Issues**
**Files:** All component files

**Issue:**
- Missing ARIA labels
- No keyboard navigation support
- Screen reader support limited

**Fix Required:**
- Add proper ARIA attributes
- Test with screen readers
- Ensure keyboard navigation

### 16. **No Pagination**
**File:** `src/pages/Index.tsx`

**Issue:** Loads all bookings at once
- Will become slow with many bookings
- No pagination or filtering

**Fix Required:**
- Add pagination
- Implement virtual scrolling
- Add date range filters

## 🔧 Code Smells

### 17. **Large Component Files**
- `Auth.tsx` - 430 lines (should be split)
- `Index.tsx` - 269 lines

### 18. **State Management**
- No global state management
- Props drilling in some places
- Consider Context or Zustand

### 19. **Inconsistent Naming**
- `handleLogin` vs `handleConfirmBooking`
- Some camelCase, some snake_case

### 20. **No Code Documentation**
- No JSDoc comments
- No README for components
- No API documentation

## 📊 Summary

| Priority | Count | Fixed | Partially Fixed | Remaining |
|----------|-------|-------|----------------|-----------|
| Critical | 3     | 2     | 0              | 1         |
| High     | 4     | 1     | 0              | 3         |
| Medium   | 5     | 1     | 0              | 4         |
| Low      | 4     | 0     | 1              | 3         |
| **Total**| **16**| **4** | **1**          | **11**    |

### Fixed Issues (4)
- ✅ Issue #2: Error Boundaries - Integrated ErrorBoundary in App.tsx
- ✅ Issue #3: Unsafe Type Assertions - Added type guards for runtime validation
- ✅ Issue #7: Memory Leaks - Fixed Auth.tsx useEffect with mounted guard
- ✅ Issue #9: TypeScript Strict Mode - Enabled strict mode in tsconfig

### Partially Fixed Issues (1)
- ⚠️ Issue #13: Tests - E2E framework exists, unit tests still needed

### Remaining Issues (11)
- Issue #1: Password Reset (requires Supabase configuration)
- Issues #4-6, #8, #10-12: Require architectural changes
- Issues #14-16, #17-20: Lower priority improvements

## 🎯 Recommended Action Plan

### ✅ Completed
1. **Error Boundaries** - Added and integrated ErrorBoundary component
2. **Type Safety** - Fixed unsafe type assertions with type guards
3. **Memory Leak Prevention** - Fixed Auth.tsx useEffect
4. **TypeScript Strict Mode** - Enabled and verified

### 1. **Immediate (This Sprint)**
   - ~~Add error boundaries~~ ✅ DONE
   - ~~Fix type safety issues~~ ✅ DONE
   - Fix password reset functionality (requires Supabase env config)
   - Add loading states for auth

2. **Short Term (Next Sprint)**
   - Write unit tests for components and utilities
   - Write critical path integration tests
   - Refactor large components (Auth.tsx - 430 lines)
   - Add proper error handling and sanitization

3. **Medium Term (Next Month)**
   - Add full test coverage
   - Implement error tracking (Sentry)
   - Improve accessibility (ARIA labels, keyboard nav)
   - Add proper logging

4. **Long Term (Quarter)**
   - Performance optimization (pagination, code splitting)
   - Add monitoring
   - Security audit
   - Code documentation (JSDoc)

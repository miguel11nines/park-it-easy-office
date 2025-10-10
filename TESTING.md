# Testing Guide

## 🧪 Overview

This project uses **Vitest** and **React Testing Library** for comprehensive test coverage of authentication, booking logic, and UI components.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Coverage Reports](#coverage-reports)
- [CI/CD Integration](#cicd-integration)

## 🚀 Getting Started

### Prerequisites

```bash
# Install dependencies (includes test dependencies)
npm install
```

### Test Dependencies

- `vitest` - Fast unit test framework
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom jest matchers
- `@testing-library/user-event` - User interaction simulation
- `jsdom` - Browser environment simulation
- `@vitest/ui` - Beautiful test UI

## ▶️ Running Tests

### Commands

```bash
# Run tests in watch mode (development)
npm test

# Run tests once (CI/CD)
npm test -- --run

# Open Vitest UI in browser
npm test:ui

# Generate coverage report
npm test:coverage
```

### Watch Mode

In watch mode, tests automatically re-run when files change:

```bash
npm test
```

Press `h` for help menu with available commands.

### UI Mode

Launch a beautiful web interface to explore and debug tests:

```bash
npm test:ui
```

Then open `http://localhost:51204/__vitest__/` in your browser.

## 📁 Test Structure

```
src/
├── test/
│   ├── setup.ts              # Test environment setup
│   ├── auth.test.ts          # Authentication tests (14 tests)
│   ├── booking.test.ts       # Booking logic tests (12 tests)
│   └── ...                   # More test files
├── services/
│   ├── authService.ts        # Auth service (tested)
│   └── bookingService.ts     # Booking service (tested)
└── components/
    └── ErrorBoundary.tsx     # Error handling
```

## ✍️ Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
    vi.clearAllMocks();
  });

  it('should do something', () => {
    // Arrange: Set up test data
    const input = 'test@lht.dlh.de';

    // Act: Execute the code
    const result = validateEmail(input);

    // Assert: Verify the outcome
    expect(result).toBe(true);
  });
});
```

### Testing Services

```typescript
import { describe, it, expect, vi } from 'vitest';
import { AuthService } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signIn: vi.fn(),
    },
  },
}));

describe('AuthService', () => {
  it('should sign in successfully', async () => {
    // Mock successful response
    vi.mocked(supabase.auth.signIn).mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    });

    const result = await AuthService.signIn({
      email: 'test@lht.dlh.de',
      password: 'password123',
    });

    expect(result.success).toBe(true);
  });
});
```

### Testing React Components

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent title="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle button click', async () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    await fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Async Code

```typescript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});

it('should handle promises', () => {
  return expect(asyncFunction()).resolves.toBe('expected value');
});

it('should handle rejections', () => {
  return expect(failingFunction()).rejects.toThrow('Error message');
});
```

### Using Mocks

```typescript
// Mock a module
vi.mock('@/services/authService');

// Mock a function
const mockFunction = vi.fn();
mockFunction.mockReturnValue('mocked value');
mockFunction.mockResolvedValue('async value');

// Spy on a function
const spy = vi.spyOn(object, 'method');
expect(spy).toHaveBeenCalled();

// Clear mocks
vi.clearAllMocks();
vi.resetAllMocks();
```

## 📊 Coverage Reports

### Generate Coverage

```bash
npm run test:coverage
```

### View Coverage Report

After generating coverage, open:
```
coverage/index.html
```

### Coverage Thresholds

Current configuration requires:
- Statements: N/A (to be set)
- Branches: N/A (to be set)
- Functions: N/A (to be set)
- Lines: N/A (to be set)

### Coverage Exclusions

The following are excluded from coverage:
- `node_modules/`
- `src/test/`
- `**/*.d.ts`
- `**/*.config.*`
- `src/main.tsx`

## 🔄 CI/CD Integration

### GitHub Actions

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

### Workflow

See `.github/workflows/test.yml`:

```yaml
- Run linter
- Run tests
- Generate coverage
- Upload coverage report
- Comment on PR with coverage
```

### Local Pre-commit

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/sh
npm test -- --run
```

## 🎯 Test Examples

### Authentication Tests

```typescript
describe('Password Reset', () => {
  it('should construct correct redirect URL', () => {
    const origin = 'http://localhost:8080';
    const baseUrl = '/park-pal-work/';
    const expected = `${origin}/park-pal-work/auth`;
    
    const redirectUrl = constructUrl(origin, baseUrl);
    expect(redirectUrl).toBe(expected);
  });
});
```

### Booking Tests

```typescript
describe('Booking Validation', () => {
  it('should prevent car booking when spot is full', () => {
    const existingBookings = [
      { duration: 'full', vehicleType: 'car' }
    ];
    
    const hasConflict = checkConflict(
      'morning', 
      'car', 
      existingBookings
    );
    
    expect(hasConflict).toBe(true);
  });
});
```

## 🐛 Debugging Tests

### Use `test.only`

```typescript
it.only('this test runs alone', () => {
  // Only this test will run
});
```

### Use `test.skip`

```typescript
it.skip('skip this test', () => {
  // This test is skipped
});
```

### Debug with Console

```typescript
it('debug test', () => {
  console.log('Debugging:', variable);
  // Test code
});
```

### Use Vitest UI

```bash
npm test:ui
```

Provides visual debugging with:
- Test results
- Console output
- Error stack traces
- Code coverage
- Watch mode

## 📝 Best Practices

### 1. Test Naming

```typescript
// ❌ Bad
it('test1', () => {});

// ✅ Good
it('should validate email format correctly', () => {});
```

### 2. Arrange-Act-Assert

```typescript
it('should create booking', () => {
  // Arrange: Setup
  const booking = { date: '2025-10-10' };
  
  // Act: Execute
  const result = createBooking(booking);
  
  // Assert: Verify
  expect(result.success).toBe(true);
});
```

### 3. Test One Thing

```typescript
// ❌ Bad - tests multiple things
it('should validate and save', () => {
  expect(validate(data)).toBe(true);
  expect(save(data)).toBe(true);
});

// ✅ Good - separate tests
it('should validate data', () => {
  expect(validate(data)).toBe(true);
});

it('should save data', () => {
  expect(save(data)).toBe(true);
});
```

### 4. Use Descriptive Assertions

```typescript
// ❌ Bad
expect(result).toBe(true);

// ✅ Good
expect(result.success).toBe(true);
expect(result.error).toBeUndefined();
```

### 5. Clean Up After Tests

```typescript
afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});
```

## 🔍 Common Issues

### Mock Not Working

```typescript
// Must mock before importing
vi.mock('@/services/authService');
import { AuthService } from '@/services/authService';
```

### Async Test Timeout

```typescript
it('long test', async () => {
  // Increase timeout
  vi.setConfig({ testTimeout: 10000 });
  await longRunningFunction();
}, 10000);
```

### Module Resolution

```typescript
// Use the same alias as vite.config.ts
import { something } from '@/path/to/file';
```

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Vitest Examples](https://github.com/vitest-dev/vitest/tree/main/examples)

## 🎓 Next Steps

1. Add component tests for UI components
2. Add integration tests for user flows
3. Add E2E tests with Playwright
4. Set up coverage thresholds
5. Add visual regression testing

---

**Current Test Status:**
- ✅ 26 tests passing
- ✅ 2 test suites
- ✅ All services tested
- ⏳ Component tests pending
- ⏳ Integration tests pending

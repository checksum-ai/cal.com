# Checksum Tests Setup Guide

This guide explains how to set up, run, and create checksum tests for the Cal.com application.

## Quick Setup

### 1. Initial Setup
Run the setup script to install dependencies and configure the environment:

```bash
yarn setup
```

## Test Structure

### Plain Playwright Tests
- **Location**: `apps/web/playwright`
- **Purpose**: Standard Playwright tests for UI automation
- **Run Command**: 
  ```bash
  NEXT_PUBLIC_IS_E2E=1 npx playwright test --project=@calcom/web
  ```

### Checksum Tests
- **Location**: `apps/web/checksum/tests`
- **Purpose**: Checksum tests


## Running Tests

### From the Web App Directory
```bash
cd apps/web

# Run checksum tests
yarn test:checksum

# Or with direct command
NEXT_PUBLIC_IS_E2E=1; yarn checksumai test
```

## Creating Tests

### Converting Plain Playwright Tests to Checksum Tests

1. **Locate the test**: Find the test in `apps/web/playwright`
2. **Create checksum version**: Copy to `apps/web/checksum/tests`
3. **Convert**: Wrap the test with `defineChecksumTest`, add `checksumAI` wrappers etc.

### Example Test Structure

```typescript
import { defineChecksumTest } from '@checksum-ai/runtime';

test(
  defineChecksumTest("Profile page is loaded for users in Organization", "VFrFP"),
  {
    annotation: {
      type: "IntentionallyBroken",
      description: {
        change: "Changed assertion from toBeVisible() to toBeHidden() for the profile upload avatar to simulate a test expecting the wrong UI state.",
        shouldAutoRecover: true,
      },
    },
  },
  async ({ page }) => {
    // Your test implementation here
    await page.goto('/profile');
    await expect(page.locator('[data-testid="profile-avatar"]')).toBeHidden(); // Intentionally broken
  }
);
```

### Test Annotations

Use annotations to provide context about test behavior:

```typescript
{
  annotation: {
    type: "IntentionallyBroken",
    description: {
      change: "Description of what was changed",
      shouldAutoRecover: boolean,
      shouldPass: boolean,
    }
  }
}
```

## Development Workflow

### 1. Convert Existing Tests
- Take a plain Playwright test from `playwright/` directory
- Convert it to use checksum
- Break them to trigger AR
- Add appropriate annotations
- Place in `checksum/tests/` directory

### 3. Example Conversion

**Original Playwright Test:**
```typescript
test('Profile page loads correctly', async ({ page }) => {
  await page.goto('/profile');
  await expect(page.locator('[data-testid="profile-avatar"]')).toBeVisible();
});
```

**Converted Checksum Test:**
```typescript
test(
  defineChecksumTest("Profile page loads correctly", "PROFILE001"),
  {
    annotation: {
      type: "IntentionallyBroken",
      description: {
        change: "Changed toBeVisible() to toBeHidden() to test auto-healing",
        shouldAutoRecover: true,
      },
    },
  },
  async ({ page }) => {
    await page.goto('/profile');
    await expect(page.locator('[data-testid="profile-avatar"]')).toBeHidden(); // Broken
  }
);
```

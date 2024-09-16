import { test, expect } from '@playwright/test';

test.describe('ResetPassword Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the ResetPassword page with a token in the URL
    await page.goto('http://localhost:3000/Reset_Password?token=8054b5ae43d5c9575cb95a5d9a288ec3d0d8cc20'); // Adjust the URL to your actual route
  });

  test('should display error message if passwords do not match', async ({ page }) => {
    // Fill in the password and confirm password fields with different values
    await page.fill('input[placeholder="Enter new password"]', 'newpassword');
    await page.fill('input[placeholder="Confirm new password"]', 'differentpassword');

    // Submit the form
    await page.click('button', { text: 'Reset Password' });

    // Check for error message
    await expect(page.locator('.error')).toHaveText('Passwords do not match');
  });

  test('should display the reset password form and handle user input', async ({ page }) => {
    // Check that the form is visible
    await expect(page.locator('.reset-password-container')).toBeVisible();

    // Fill in the password and confirm password fields
    await page.fill('input[placeholder="Enter new password"]', 'rukmal123456');
    await page.fill('input[placeholder="Confirm new password"]', 'rukmal123456');

    // Submit the form
    await page.click('button', { text: 'Reset Password' });

    // Check for success message toast
    //await expect(page.locator('text=Password reset successful')).toBeVisible();
    // Select the first matching element
await expect(page.locator('text=Password reset successful').nth(0)).toBeVisible();

// or select the second matching element
await expect(page.locator('text=Password reset successful').nth(1)).toBeVisible();

  });

  test('should handle API error response', async ({ page }) => {
    // Mock the API response to simulate a failure
    await page.route('http://localhost:3001/Reset_Password', route => route.fulfill({
      status: 400,
      body: JSON.stringify({ error: 'Invalid token' }),
    }));

    // Fill in the password and confirm password fields
    await page.fill('input[placeholder="Enter new password"]', 'newpassword');
    await page.fill('input[placeholder="Confirm new password"]', 'newpassword');

    // Submit the form
    await page.click('button', { text: 'Reset Password' });

    // Check for error message toast
    await expect(page.locator('text=Invalid or expired token').nth(0)).toBeVisible();

    await expect(page.locator('text=Invalid or expired token').nth(1)).toBeVisible();
  });

  // test('should handle network error', async ({ page }) => {
  //   // Mock the API response to simulate a network error
  //   await page.route('http://localhost:3001/Reset_Password', route => route.abort());

  //   // Fill in the password and confirm password fields
  //   await page.fill('input[placeholder="Enter new password"]', 'newpassword');
  //   await page.fill('input[placeholder="Confirm new password"]', 'newpassword');

  //   // Submit the form
  //   await page.click('button', { text: 'Reset Password' });

  //   // Check for network error message toast
  //   await expect(page.locator('text=Network error. Please try again.').nth(0)).toBeVisible();

  //   await expect(page.locator('text=Network error. Please try again.').nth(1)).toBeVisible();
  // });
});
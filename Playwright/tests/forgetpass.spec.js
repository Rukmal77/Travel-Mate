import { test, expect } from '@playwright/test';

test.describe('ForgotPassword Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page first
    await page.goto('http://localhost:3000/login');
    
    // Click to navigate to the Forgot Password page
    await page.click('.fg-pass'); // Assumes .fg-pass is the class used for the "Forgot Password" link/button
  });

  test('should display the forgot password form and handle valid user input', async ({ page }) => {
    // Check that the forgot password form is visible
    await expect(page.locator('.forgot-password-container')).toBeVisible();

    // Fill in the email field with a valid email
    await page.fill('input[placeholder="Enter your email"]', 'rukmalperera18@gmail.com');

    // Submit the form by clicking the submit button
    await page.click('.forgotpass'); // Assumes .forgotpass is the class used for the submit button

    // Listen for the alert dialog and validate its message
    page.once('dialog', async (dialog) => {
      // Check that the alert message is as expected
      expect(dialog.message()).toBe('Password reset email sent');

      // Accept the dialog to close it
      await dialog.accept();
    });

    // Optionally, check that a success message toast appears
    // Adjust selector according to your actual toast message
    await expect(page.locator('.Toastify__toast--success')).toContainText('Password reset email sent');
  });

  test('should display error message if email is invalid', async ({ page }) => {
    // Fill in the email field with an invalid email
    await page.fill('input[placeholder="Enter your email"]', 'sala@gmail.com');

    // Submit the form
    await page.click('.forgotpass');

    // Check for the error message to appear
    await expect(page.locator('.error')).toHaveText('User not found');
  });

  test('should navigate back to login page when back button is clicked', async ({ page }) => {
    // Click the back button to navigate back to the login page
    await page.click('.back-to-login-btn');

    // Verify that the URL is now the login page
    await expect(page).toHaveURL('http://localhost:3000/login');
  });
});


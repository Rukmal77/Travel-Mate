import { test, expect } from '@playwright/test';

test.describe('ReviewForm Page', () => {
  test.beforeEach(async ({ page }) => {
    // Log in programmatically
    await page.goto('http://localhost:3000/login'); // Adjust URL if needed

    // Fill email and password fields
    await page.fill('[placeholder="Your email"]', 'rukmalperera18@gmail.com');
    await page.fill('[placeholder="Your password"]', 'rukmal123');

    // Click login button and wait for navigation
    await Promise.all([
      page.waitForNavigation(), // Wait for navigation after login
      page.click('.login-btn'), // Click the login button
    ]);

    // Navigate to the dashboard
    await page.goto('http://localhost:3000/dashboard');
  });

  test('should display the review form and handle user input', async ({ page }) => {
    // Navigate to the ReviewForm page
    await page.click('.review-nav'); // Click the button that navigates to the Review Form

    // Check that the review form is visible
    await expect(page.locator('.review-form')).toBeVisible();

    // Interact with the star rating
    const thirdStar = page.locator('.star').nth(2); // Select the 3rd star (index starts at 0)
    await thirdStar.click();

    // Check the selected rating
    const ratingValue = await page.locator('.rating-value').textContent();
    expect(parseFloat(ratingValue)).toBe(1.5);

    // Fill in the comment
    await page.fill('textarea', 'Great Service!');

    // Listen for the alert dialog immediately before triggering it
    const dialogPromise = page.waitForEvent('dialog');

    // Submit the form
    await page.click('.review-btn');

    // Handle the alert dialog
    const dialog = await dialogPromise;
    expect(dialog.message()).toBe('Review submitted successfully');
    await dialog.accept(); // Accept the alert to close it
  });

  test('should redirect to dashboard if not authenticated', async ({ page }) => {
    // Clear cookies to simulate no authentication
    await page.context().clearCookies();
    
    // Navigate to the ReviewForm page
    await page.goto('http://localhost:3000/reviewform');

    // Wait for redirection to the dashboard
    await page.waitForURL('http://localhost:3000/dashboard');

    // Verify the redirection
    expect(page.url()).toBe('http://localhost:3000/dashboard');
  });

  test('should display an error if review submission fails', async ({ page }) => {
    // Mock the API response to simulate a failure
    await page.route('http://localhost:3001/controllers/Review', route => route.abort());

    // Navigate to the ReviewForm page
    await page.click('.review-nav');

    // Interact with the star rating
    const thirdStar = page.locator('.star').nth(2); // Select the 3rd star (index starts at 0)
    await thirdStar.click();

    // Fill in the comment
    await page.fill('textarea', 'This is a test comment.');

    // Listen for the alert dialog immediately before triggering it
    const dialogPromise = page.waitForEvent('dialog');

    // Submit the form
    await page.click('.review-btn');

    // Handle the alert dialog
    const dialog = await dialogPromise;
    expect(dialog.message()).toBe('Error submitting review');
    await dialog.accept(); // Accept the alert to close it
  });
});

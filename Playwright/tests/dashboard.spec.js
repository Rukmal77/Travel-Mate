import { test, expect } from '@playwright/test';

// Utility function to wait for the server to be up before navigating
async function waitForServer(page, url, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      return;
    } catch (error) {
      console.log(`Retry ${i + 1}/${retries}: Waiting for server to be ready...`);
      await new Promise(res => setTimeout(res, 1000)); // wait 1 second before retrying
    }
  }
  throw new Error(`Failed to load ${url} after ${retries} retries`);
}

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    // Log in programmatically
    await page.goto('http://localhost:3000/login');

    // Fill in the login form
    await page.fill('[placeholder="Your email"]', 'rukmalperera18@gmail.com');
    await page.fill('[placeholder="Your password"]', 'rukmal123');

    // Click login button and wait for navigation
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }), // Wait until the page is fully loaded
      page.click('.login-btn')  // Click the login button
    ]);

    // Navigate to the Dashboard with server readiness check
    await waitForServer(page, 'http://localhost:3000/dashboard');
  });

  test('should display user data on the Dashboard', async ({ page }) => {
    // Verify that the dashboard loaded by checking for user information
    await expect(page.locator('.dashboard-container')).toBeVisible();
    await expect(page.locator('.user-info')).toHaveText(/Hi .*/); // Checks for any username text

    // Validate other elements
    await expect(page.locator('.app-name')).toHaveText('TRAVEL MATE');
  });

  test('should navigate to the Streamlit UI for Recommendations and stop testing', async ({ page }) => {
    // Increase timeout to handle longer load times
    test.setTimeout(60000); // 60 seconds

    console.log('Attempting to click on Recommendation option.');

    try {
      // Click on the Health Recommendation button and wait for the navigation to complete
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle', timeout: 60000 }), // Wait for navigation with extended timeout
        page.click('.sidebar-option').then(() => console.log('Clicked on sidebar option.')) // Click the button
      ]);

      console.log('Navigation to Streamlit UI completed.');
      
      // Verify the URL of the new page
      await expect(page.url()).toBe('http://localhost:8501/');
      console.log('Streamlit UI is visible, stopping further testing.');

    } catch (error) {
      console.error('Error while navigating to the Streamlit UI:', error);
      throw error; // Re-throw the error to indicate test failure
    }
  });

  test('should redirect to login if user is not authenticated', async ({ page }) => {
    // Clear cookies to simulate unauthenticated state
    await page.context().clearCookies();

    // Attempt to navigate to the Dashboard
    try {
      await waitForServer(page, 'http://localhost:3000/dashboard');
    } catch (error) {
      console.log('Navigating to login due to unauthenticated state.');
    }

    // Verify redirection to login page
    await page.waitForURL('http://localhost:3000/login');
    expect(page.url()).toBe('http://localhost:3000/login');
  });

  test('should handle logout and redirect to login page', async ({ page }) => {
    // Click the Logout button
    await page.click('.sidebar-logout');

    // Wait for redirection to the login page
    await page.waitForURL('http://localhost:3000/login');

    // Verify the URL to ensure redirection worked
    expect(page.url()).toBe('http://localhost:3000/login');
  });

  test('should navigate to Review Form from Dashboard', async ({ page }) => {
    // Click the button to navigate to the Review Form
    await page.click('text=submit a review');

    // Wait for the navigation to the ReviewForm page
    await page.waitForURL('http://localhost:3000/ReviewForm');

    // Verify the navigation
    expect(page.url()).toBe('http://localhost:3000/ReviewForm');
  });

  test('should display an error if data fetching fails', async ({ page }) => {
    // Mock the API response to simulate a failure
    await page.route('http://localhost:3001/controllers/dashboard', route => route.abort());

    // Attempt to reload the Dashboard
    try {
      await waitForServer(page, 'http://localhost:3000/dashboard');
    } catch (error) {
      console.log('Handling error gracefully, redirecting to login.');
    }

    // Check for redirection to the login page
    await page.waitForURL('http://localhost:3000/login');
    expect(page.url()).toBe('http://localhost:3000/login');
  });
});

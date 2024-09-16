const { test, expect } = require('@playwright/test');

test('Login with valid credentials', async ({ page }) => {
  // Go to the login page with a longer timeout
  await page.goto('http://localhost:3000/login'); // Adjust timeout as needed (in milliseconds)

  // Fill email and password fields
  await page.locator('[placeholder="Your email"]').fill('rukmalperera18@gmail.com');
  await page.locator('[placeholder="Your password"]').fill('newpassword');

  // Click login button
  await page.click('.login-btn');

  // Wait for potential redirects or loading after login
  await page.waitForTimeout(2000); // Adjust timeout as needed

  const dashboardURL = 'http://localhost:3000/dashboard'; // Replace with your dashboard URL
  const currentURL = page.url();
  expect(currentURL).toBe(dashboardURL);
});

test('Login with invalid credentials', async ({ page }) => {
  // Login page URL (replace with your actual URL)
  const loginPageURL = 'http://localhost:3000/login';

  // Invalid credentials (replace with your test data)
  const email = 'invalid@email.com';
  const password = 'wrong_password';

  // Go to the login page
  await page.goto(loginPageURL);

  // Fill email and password fields
  await page.fill('#email', email);
  await page.fill('#password', password);

  // Click login button
  await page.click('.login-btn');

  // Wait for potential error messages
  await page.waitForTimeout(2000); // Adjust timeout as needed

  // Assertions: check for error indications
  // (modify these based on your application's behavior)
  const errorSelector = '.error';
  const isErrorVisible = await page.isVisible(errorSelector);
  expect(isErrorVisible).toBe(true);
});
test('Login with invalid email and valid password', async ({ page }) => {
  // Login page URL (replace with your actual URL)
  const loginPageURL = 'http://localhost:3000/login';

  // Invalid credentials (replace with your test data)
  const email = 'invalid@email.com';
  const password = 'rukmal1234';

  // Go to the login page
  await page.goto(loginPageURL);

  // Fill email and password fields
  await page.fill('#email', email);
  await page.fill('#password', password);

  // Click login button
  await page.click('.login-btn');

  // Wait for potential error messages
  await page.waitForTimeout(2000); // Adjust timeout as needed

  // Assertions: check for error indications
  // (modify these based on your application's behavior)
  const errorSelector = '.error';
  const isErrorVisible = await page.isVisible(errorSelector);
  expect(isErrorVisible).toBe(true);
});

test('Login with valid email and invalid password', async ({ page }) => {
  // Login page URL (replace with your actual URL)
  const loginPageURL = 'http://localhost:3000/login';

  // Invalid credentials (replace with your test data)
  const email = 'rukmalperera@gmail.com';
  const password = 'wrong_password';

  // Go to the login page
  await page.goto(loginPageURL);

  // Fill email and password fields
  await page.fill('#email', email);
  await page.fill('#password', password);

  // Click login button
  await page.click('.login-btn');

  // Wait for potential error messages
  await page.waitForTimeout(2000); // Adjust timeout as needed

  // Assertions: check for error indications
  // (modify these based on your application's behavior)
  const errorSelector = '.error';
  const isErrorVisible = await page.isVisible(errorSelector);
  expect(isErrorVisible).toBe(true);
});
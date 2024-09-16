const { test, expect } = require('@playwright/test');

test('Register with valid credentials', async ({ page }) => {
  // Go to the registration page
  await page.goto('http://localhost:3000/signup');

  // Fill the registration form with valid data
  await page.locator('[placeholder="Your username"]').fill('testuser2');
  await page.locator('[placeholder="Your email"]').fill('testuser2@example.com');
  await page.locator('[placeholder="Your password"]').fill('validPassword123');
  await page.locator('[placeholder="Confirm your password"]').fill('validPassword123');

  // Click the register button
  await page.click('button[type="submit"]');

  // Wait for a success toast message
  await page.waitForSelector('.Toastify__toast--success', { timeout: 5000 });

  // Check if the success message is displayed
  const successMessage = await page.textContent('.Toastify__toast--success');
  expect(successMessage).toContain('Registration successful');
});



test('Register with Empty username credentials', async ({ page }) => {
  // Go to the registration page
  await page.goto('http://localhost:3000/signup');

  // Fill the registration form with invalid data
  await page.locator('[placeholder="Your username"]').fill(''); // Empty username
  
  // Listen for the alert and handle it
  page.on('dialog', async dialog => {
    expect(dialog.message()).toContain('Please fill out this field');
    await dialog.dismiss();
  });

  // Click the register button
  await page.click('button[type="submit"]');

  // Wait for a short time to allow error messages to appear
  await page.waitForTimeout(2000);

 
});

test('Register with invalid-email credentials', async ({ page }) => {
  // Go to the registration page
  await page.goto('http://localhost:3000/signup');

  // Fill the registration form with invalid data
  await page.locator('[placeholder="Your username"]').fill('testuser');
  await page.locator('[placeholder="Your email"]').fill('testuserexample.com');
  
  page.on('dialog', async dialog => {
    expect(dialog.message()).toContain('Please enter a valid email address.');
    await dialog.dismiss();
  });

  // Click the register button
  await page.click('button[type="submit"]');

  // Wait for a short time to allow error messages to appear
  await page.waitForTimeout(2000);

 
});

test('Register with short password credentials', async ({ page }) => {
  // Go to the registration page
  await page.goto('http://localhost:3000/signup');

  // Fill the registration form with invalid data
  await page.locator('[placeholder="Your username"]').fill('testuser');
  await page.locator('[placeholder="Your email"]').fill('testuser@example.com');
  await page.locator('[placeholder="Your password"]').fill('short');

   // Listen for the alert and handle it
   page.on('dialog', async dialog => {
    expect(dialog.message()).toContain('Password must be at least 8 characters long.');
    await dialog.dismiss();
  });

  // Click the register button
  await page.click('button[type="submit"]');

  // Wait for a short time to allow error messages to appear
  await page.waitForTimeout(2000);

  
});

test('Register with mismatch-password credentials', async ({ page }) => {
  // Go to the registration page
  await page.goto('http://localhost:3000/signup');

  // Fill the registration form with invalid data
  await page.locator('[placeholder="Your username"]').fill('testuser');
  await page.locator('[placeholder="Your email"]').fill('testuser@example.com');
  await page.locator('[placeholder="Your password"]').fill('validPassword123');
  await page.locator('[placeholder="Confirm your password"]').fill('mismatch');

  // Click the register button
  await page.click('button[type="submit"]');

  // Wait for a short time to allow error messages to appear
  await page.waitForTimeout(2000);

  const confirmPasswordError = await page.textContent('.error:has-text("Passwords do not match.")');
  expect(confirmPasswordError).toBeTruthy();
});
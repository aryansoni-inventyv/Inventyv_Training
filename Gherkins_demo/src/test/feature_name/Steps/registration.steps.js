// src/test/feature_name/steps/registration.steps.js

const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai'); // or your assertion library

Given('I open the registration page', async function () {
  // Navigate to registration page
  await this.page.goto('http://your-app-url/registration');
});

When('I enter first name {string}', async function (firstName) {
  // Find the first name input and type
  await this.page.fill('#firstName', firstName); // adjust selector
});

When('I enter last name {string}', async function (lastName) {
  await this.page.fill('#lastName', lastName);
});

When('I enter email {string}', async function (email) {
  await this.page.fill('#email', email);
});

When('I enter password {string}', async function (password) {
  await this.page.fill('#password', password);
});

When('I click register button', async function () {
  await this.page.click('#registerButton'); // adjust selector
});

Then('I should see {string}', async function (message) {
  const text = await this.page.textContent('.success-message'); // adjust selector
  expect(text).to.include(message);
});
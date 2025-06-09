/**
 * ClassicThemeFormFields.ts
 * 
 * This file handles the form functionality for the Classic Theme.
 * It includes form validation, submission, and other interactive features.
 */

// NOTE: The <script> tag in ClassicThemeFormFields.astro which handles similar client-side
// interactions (like payment option selection and form submission alerts) is currently commented out.
// This TypeScript file provides more robust form validation. If this .ts file is used as the primary
// source for form logic, ensure there's no conflicting or redundant JavaScript in the .astro file.

// Initializes form field functionalities, primarily setting up validation.

/**
 * ClassicThemeFormFields.ts
 *
 * This file handles the form functionality for the Classic Theme.
 * It includes form validation, submission, and other interactive features.
 */

import {
  isValidFullName,
  isValidPhoneNumber,
  isValidEmail,
  isValidCity,
  isValidCountry,
} from '../../../../../lib/utils/validation'; // Adjusted import path

// Function to display validation messages
function displayValidationMessage(fieldId: string, message: string, isValid: boolean) {
  const errorElement = document.getElementById(`${fieldId}-error`);
  const inputElement = document.getElementById(fieldId);

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = message ? 'block' : 'none';
    errorElement.style.color = isValid ? 'green' : 'red';
  }

  if (inputElement) {
    if (isValid) {
      inputElement.classList.remove('border-red-500');
      inputElement.classList.add('border-green-500');
    } else {
      inputElement.classList.remove('border-green-500');
      inputElement.classList.add('border-red-500');
      if (!message) { // If no specific message, but invalid, ensure error style is applied
         errorElement.style.display = 'block'; // Make sure a hidden empty message is shown for spacing if needed
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.p-6') as HTMLFormElement; // Assuming this is the correct form selector

  // Get references to input fields.
  // We need to add IDs to the input fields in the .astro file for this to work reliably.
  // For now, we'll try to select them based on placeholders or types if IDs are not yet available,
  // but this is less robust and should be updated in the next step.

  const fullNameInput = form.querySelector('input[placeholder*="full_name"], input[data-form-field="fullName"]') as HTMLInputElement;
  const phoneInput = form.querySelector('input[type="tel"]') as HTMLInputElement;
  const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
  const countrySelect = form.querySelector('select') as HTMLSelectElement; // Assuming only one select for country
  const cityInput = form.querySelector('input[placeholder*="enterCity"], input[data-form-field="city"]') as HTMLInputElement;

  // --- Input IDs to be added in ClassicThemeFormFields.astro ---
  // It's much better to use IDs:
  // const fullNameInput = document.getElementById('fullName') as HTMLInputElement;
  // const phoneInput = document.getElementById('phone') as HTMLInputElement;
  // const emailInput = document.getElementById('email') as HTMLInputElement;
  // const countrySelect = document.getElementById('country') as HTMLSelectElement;
  // const cityInput = document.getElementById('city') as HTMLInputElement;


  if (fullNameInput) {
    fullNameInput.id = fullNameInput.id || 'form-fullName'; // Assign ID if not present
    fullNameInput.addEventListener('blur', () => {
      const isValid = isValidFullName(fullNameInput.value);
      displayValidationMessage(fullNameInput.id, isValid ? 'Valid' : 'Invalid full name.', isValid);
    });
  }

  if (phoneInput) {
    phoneInput.id = phoneInput.id || 'form-phone'; // Assign ID if not present
    phoneInput.addEventListener('blur', () => {
      const isValid = isValidPhoneNumber(phoneInput.value);
      displayValidationMessage(phoneInput.id, isValid ? 'Valid' : 'Invalid phone number.', isValid);
    });
  }

  if (emailInput) {
    emailInput.id = emailInput.id || 'form-email'; // Assign ID if not present
    emailInput.addEventListener('blur', () => {
      const isValid = isValidEmail(emailInput.value);
      displayValidationMessage(emailInput.id, isValid ? 'Valid' : 'Invalid email address.', isValid);
    });
  }

  if (countrySelect) {
    countrySelect.id = countrySelect.id || 'form-country'; // Assign ID if not present
    countrySelect.addEventListener('blur', () => {
      const isValid = isValidCountry(countrySelect.value);
      displayValidationMessage(countrySelect.id, isValid ? 'Valid' : 'Please select a country.', isValid);
    });
     // Also validate on change for select elements
    countrySelect.addEventListener('change', () => {
      const isValid = isValidCountry(countrySelect.value);
      displayValidationMessage(countrySelect.id, isValid ? 'Valid' : 'Please select a country.', isValid);
    });
  }

  if (cityInput) {
    cityInput.id = cityInput.id || 'form-city'; // Assign ID if not present
    cityInput.addEventListener('blur', () => {
      const isValid = isValidCity(cityInput.value);
      displayValidationMessage(cityInput.id, isValid ? 'Valid' : 'Invalid city name.', isValid);
    });
  }

  // Optional: Add form submission validation
  form.addEventListener('submit', (event) => {
    // Validate all fields
    const isFullNameValid = fullNameInput ? isValidFullName(fullNameInput.value) : false;
    const isPhoneValid = phoneInput ? isValidPhoneNumber(phoneInput.value) : false;
    const isEmailValid = emailInput ? isValidEmail(emailInput.value) : false;
    const isCountryValid = countrySelect ? isValidCountry(countrySelect.value) : false;
    const isCityValid = cityInput ? isValidCity(cityInput.value) : false;
  
    // Display messages for all
    if (fullNameInput) displayValidationMessage(fullNameInput.id, isFullNameValid ? 'Valid' : 'Invalid full name.', isFullNameValid);
    if (phoneInput) displayValidationMessage(phoneInput.id, isPhoneValid ? 'Valid' : 'Invalid phone number.', isPhoneValid);
    if (emailInput) displayValidationMessage(emailInput.id, isEmailValid ? 'Valid' : 'Invalid email address.', isEmailValid);
    if (countrySelect) displayValidationMessage(countrySelect.id, isCountryValid ? 'Valid' : 'Please select a country.', isCountryValid);
    if (cityInput) displayValidationMessage(cityInput.id, isCityValid ? 'Valid' : 'Invalid city name.', isCityValid);
  
    if (!isFullNameValid || !isPhoneValid || !isEmailValid || !isCountryValid || !isCityValid) {
      event.preventDefault(); // Prevent form submission if any field is invalid
      // Optionally, focus the first invalid field or show a summary error message
      alert('Please correct the errors in the form.');
    }
  });
});
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
export function initFormFields() {
  // Select the form within the .personal-info container.
  const form = document.querySelector('.personal-info form');
  // If the form doesn't exist, exit to prevent errors.
  if (!form) return;
  
  // Handles the form submission event for validation.
  function validateForm(event: SubmitEvent) {
    // Prevent the default form submission behavior which would cause a page reload.
    event.preventDefault();
    
    // Get references to form input elements.
    const fullName = document.getElementById('fullName') as HTMLInputElement;
    const phoneNumber = document.getElementById('phoneNumber') as HTMLInputElement;
    const email = document.getElementById('email') as HTMLInputElement; // Email is optional based on logic below
    
    let isValid = true; // Flag to track overall form validity.
    
    // Validate Full Name: required.
    if (!fullName || !fullName.value.trim()) {
      markInvalid(fullName, 'الاسم الكامل مطلوب'); // Full name is required
      isValid = false;
    } else {
      markValid(fullName);
    }
    
    // Validate Phone Number: required.
    if (!phoneNumber || !phoneNumber.value.trim()) {
      markInvalid(phoneNumber, 'رقم الهاتف مطلوب'); // Phone number is required
      isValid = false;
    } else {
      markValid(phoneNumber);
    }
    
    // Validate Email: if provided, must be a valid format.
    if (email && email.value.trim()) { // Check if email field has a value
      if (!isValidEmail(email.value)) {
        markInvalid(email, 'البريد الإلكتروني غير صالح'); // Invalid email
        isValid = false;
      } else {
        markValid(email);
      }
    } else if (email) {
      // If email element exists but is empty, treat as valid (or add specific 'required' logic if needed)
      markValid(email);
    }
    
    // If all validations pass, proceed with form submission (currently simulated).
    if (isValid) {
      // TODO: Replace console.log with actual form submission logic (e.g., API call).
      console.log('Form data is valid and would be submitted here.');
      alert('تم إرسال الطلب بنجاح!'); // Successfully sent request! (Matches commented out Astro script)
    }
  }
  
  // Adds an 'invalid' class to a form element and could display an error message.
  function markInvalid(element: HTMLElement, message: string) {
    element.classList.add('invalid');
    // TODO: Implement displaying the 'message' to the user next to the element.
    console.error(`Validation Error for ${element.id}: ${message}`);
  }
  
  // Removes the 'invalid' class from a form element.
  function markValid(element: HTMLElement) {
    element.classList.remove('invalid');
    // TODO: Implement removing any displayed error message for this element.
  }
  
  // Validates an email string against a basic regular expression.
  function isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation.
    return re.test(email);
  }
  
  // Attach the validateForm function to the form's 'submit' event.
  form.addEventListener('submit', validateForm);
}

// Ensures that initFormFields is called only after the HTML document is fully loaded and parsed.
// This is important because the script needs to access DOM elements.
document.addEventListener('DOMContentLoaded', initFormFields);
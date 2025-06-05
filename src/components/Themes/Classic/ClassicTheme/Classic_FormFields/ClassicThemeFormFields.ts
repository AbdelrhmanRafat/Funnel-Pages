/**
 * ClassicThemeFormFields.ts
 * 
 * This file handles the form functionality for the Classic Theme.
 * It includes form validation, submission, and other interactive features.
 */

export function initFormFields() {
  const form = document.querySelector('.personal-info form');
  if (!form) return;
  
  // Form validation
  function validateForm(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName') as HTMLInputElement;
    const phoneNumber = document.getElementById('phoneNumber') as HTMLInputElement;
    const email = document.getElementById('email') as HTMLInputElement;
    
    let isValid = true;
    
    // Basic validation
    if (!fullName || !fullName.value.trim()) {
      markInvalid(fullName, 'الاسم الكامل مطلوب');
      isValid = false;
    } else {
      markValid(fullName);
    }
    
    if (!phoneNumber || !phoneNumber.value.trim()) {
      markInvalid(phoneNumber, 'رقم الهاتف مطلوب');
      isValid = false;
    } else {
      markValid(phoneNumber);
    }
    
    if (email && email.value.trim() && !isValidEmail(email.value)) {
      markInvalid(email, 'البريد الإلكتروني غير صالح');
      isValid = false;
    } else if (email && email.value.trim()) {
      markValid(email);
    }
    
    if (isValid) {
      // Submit form or show success message
      console.log('Form submitted successfully');
    }
  }
  
  function markInvalid(element, message) {
    element.classList.add('invalid');
    // Add error message if needed
  }
  
  function markValid(element) {
    element.classList.remove('invalid');
    // Remove error message if needed
  }
  
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  // Add event listeners
  form.addEventListener('submit', validateForm);
}

// Initialize the form when the DOM is loaded
document.addEventListener('DOMContentLoaded', initFormFields);
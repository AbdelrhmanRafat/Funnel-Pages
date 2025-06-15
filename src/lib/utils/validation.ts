/**
 * validation.ts
 *
 * This file contains regex-based validation functions for form inputs.
 */

// Validates a full name.
// Allows letters (including international characters), spaces, hyphens, and apostrophes.
// Must not be empty.
export function isValidFullName(name: string): boolean {
  if (!name || name.trim().length === 0) {
    return false;
  }
  const nameRegex = /^[\p{L}\s'-]+$/u;
  return nameRegex.test(name.trim());
}

// Validates a phone number.
// Allows digits, spaces, hyphens, parentheses, and an optional leading '+'.
// This is a general regex and might need to be more specific based on country requirements.
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone || phone.trim().length === 0) {
    return false;
  }
  const phoneRegex = /^[+]?[\d\s().-]+$/;
  return phoneRegex.test(phone.trim());
}

// Validates an email address.
// Uses a common regex for email validation.
export function isValidEmail(email: string): boolean {
  if (!email || email.trim().length === 0) {
    return false;
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

// Validates order notes.
// Allows any characters but limits length to 500 characters.
export function isValidNotes(notes: string): boolean {
  if (!notes) {
    return true; // Notes are optional
  }
  return notes.trim().length <= 500;
}

// Validates delivery option selection.
// Must be one of the predefined delivery options.
export function isValidDeliveryOption(option: string): boolean {
  if (!option || option.trim().length === 0) {
    return false;
  }
  const validOptions = ['standard', 'express', 'sameDay'];
  return validOptions.includes(option.trim());
}

// Validates city selection.
// Must be one of the predefined city options.
export function isValidCity(city: string): boolean {
  if (!city || city.trim().length === 0) {
    return false;
  }
  const validCities = [
    'cairo',
    'alexandria',
    'giza',
    'sharmElSheikh',
    'hurghada',
    'luxor',
    'aswan',
    'portSaid',
    'suez',
    'mansoura'
  ];
  return validCities.includes(city.trim());
}
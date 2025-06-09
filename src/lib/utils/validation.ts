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

// Validates a city name.
// Allows letters (including international characters), spaces, hyphens, and apostrophes.
// Must not be empty.
export function isValidCity(city: string): boolean {
  if (!city || city.trim().length === 0) {
    return false;
  }
  const cityRegex = /^[\p{L}\s'-]+$/u;
  return cityRegex.test(city.trim());
}

// Validates country selection.
// Checks if the selected value is not empty or a default/placeholder value.
// Assumes the default/placeholder value for the select is an empty string "" or a specific known placeholder.
export function isValidCountry(country: string): boolean {
  // Adjust "!" if the placeholder value for country is different
  return country !== null && country.trim() !== "" && country.toLowerCase() !== "select country" && country.toLowerCase() !== "اختر الدولة"; 
}
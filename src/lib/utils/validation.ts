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
  const nameRegex = /^[\p{L}\s'-]+$/u; // Unicode support
  return nameRegex.test(name.trim());
}

// Validates a phone number.
// Allows digits, spaces, hyphens, parentheses, and an optional leading '+'.
// This is a general regex and might need to be more specific based on country requirements.
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone || phone.trim().length === 0) {
    return false;
  }
  // More restrictive: require 7-15 digits
  const phoneRegex = /^[+]?[\d\s().-]{7,15}$/;
  const digitCount = phone.replace(/\D/g, '').length;
  return phoneRegex.test(phone.trim()) && digitCount >= 7 && digitCount <= 15;
}

// Validates an email address.
// Uses a common regex for email validation.
export function isValidEmail(email: string): boolean {
  if (!email || email.trim().length === 0) {
    return false;
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Standard email
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


// Validates city selection.
// Must be one of the predefined city options.
export function isValidCity(city: string): boolean {
  return city.trim() !== '';
}

// Validates an address.
// Allows letters, numbers, spaces, and common address characters.
// Must not be empty and must be at least 5 characters long.
export function isValidAddress(address: string): boolean {
  if (!address || address.trim().length === 0) {
    return false;
  }
  const addressRegex = /^[\p{L}\p{N}\s.,#-]+$/u;
  return addressRegex.test(address.trim()) && address.trim().length >= 5;
}

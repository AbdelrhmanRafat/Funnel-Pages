// Configuration for form fields
export const FORM_FIELD_CONFIG = {
  FIELD_IDS: [
    'form-fullName',
    'form-phone',
    'form-email',
    'form-address',
    'form-city',
    'form-notes'
  ] as const,
  ERROR_CLASSES: {
    INVALID: 'classic-border-error',
    VALID: 'classic-border-success',
    ERROR_CONTAINER: 'classic-form-error',
    ERROR_MESSAGE: 'classic-error-message'
  }
} as const;
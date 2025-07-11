// stores/formStore.ts
import { create } from 'zustand';

export interface FormFieldData {
  id: string;
  value: string;
  isValid: boolean;
  errorMessage: string;
}

interface FormState {
  fullName: FormFieldData;
  phone: FormFieldData;
  email: FormFieldData;
  address: FormFieldData;
  city: FormFieldData;
  notes: FormFieldData;
}

interface FormActions {
  updateField: (fieldName: keyof FormState, updates: Partial<FormFieldData>) => void;
  setFieldValue: (fieldName: keyof FormState, value: string) => void;
  setFieldError: (fieldName: keyof FormState, errorMessage: string) => void;
  setFieldTouched: (fieldName: keyof FormState, touched: boolean) => void;
  resetForm: () => void;
  areAllFieldsValid: () => boolean;
}

const createInitialField = (id: string): FormFieldData => ({
  id,
  value: '',
  isValid: false,
  errorMessage: '',
});

export const useFormStore = create<FormState & FormActions>((set, get) => ({
  // Initial state
  fullName: createInitialField('form-fullName'),
  phone: createInitialField('form-phone'),
  email: createInitialField('form-email'),
  address: createInitialField('form-address'),
  city: createInitialField('form-city'),
  notes: createInitialField('form-notes'),

  // Actions
  updateField: (fieldName, updates) => 
    set((state) => ({
      [fieldName]: { ...state[fieldName], ...updates }
    })),

  setFieldValue: (fieldName, value) => 
    set((state) => ({
      [fieldName]: { ...state[fieldName], value, touched: true }
    })),

  setFieldError: (fieldName, errorMessage) => 
    set((state) => ({
      [fieldName]: { ...state[fieldName], errorMessage, isValid: !errorMessage }
    })),

  setFieldTouched: (fieldName, touched) => 
    set((state) => ({
      [fieldName]: { ...state[fieldName], touched }
    })),

  resetForm: () => set({
    fullName: createInitialField('form-fullName'),
    phone: createInitialField('form-phone'),
    email: createInitialField('form-email'),
    address: createInitialField('form-address'),
    city: createInitialField('form-city'),
    notes: createInitialField('form-notes'),
  }),

  areAllFieldsValid: () => {
    const state = get();
    return state.fullName.isValid && 
           state.phone.isValid && 
           state.email.isValid && 
           state.address.isValid && 
           state.city.isValid;
  },
}));

// Simple hooks
export const useFormField = (fieldName: keyof FormState) => 
  useFormStore((state) => state[fieldName]);

export const useFormValid = () => 
  useFormStore((state) => state.areAllFieldsValid());

export const useAllFormFields = () => 
  useFormStore((state) => ({
    fullName: state.fullName,
    phone: state.phone,
    email: state.email,
    address: state.address,
    city: state.city,
    notes: state.notes,
  }));
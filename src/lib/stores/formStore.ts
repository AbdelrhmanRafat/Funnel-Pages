import { create } from 'zustand';

export interface FormFieldData {
  id: string;
  value: string;
  isValid: boolean;
  errorMessage: string;
  touched: boolean;
}

export interface FormState {
  fullName: FormFieldData;
  phone: FormFieldData;
  email: FormFieldData;
  address: FormFieldData;
  city: FormFieldData;
  notes: FormFieldData;
}

interface FormActions {
  updateField: (
    fieldName: keyof FormState,
    updates: Partial<Omit<FormFieldData, 'id'>>
  ) => void;
  setFieldValue: (fieldName: keyof FormState, value: string) => void;
  setFieldTouched: (fieldName: keyof FormState, touched: boolean) => void;
  resetForm: () => void;
  areAllFieldsValid: () => boolean;
}

const createInitialField = (id: string): FormFieldData => ({
  id,
  value: '',
  isValid: false,
  errorMessage: '',
  touched: false,
});

export const useFormStore = create<FormState & FormActions>((set, get) => ({
  // Initial state
  fullName: createInitialField('form-fullName'),
  phone:    createInitialField('form-phone'),
  email:    createInitialField('form-email'),
  address:  createInitialField('form-address'),
  city:     createInitialField('form-city'),
  notes:    createInitialField('form-notes'),

  // Actions
  updateField: (fieldName, updates) =>
    set(state => ({
      [fieldName]: { ...state[fieldName], ...updates }
    } as any)),

  setFieldValue: (fieldName, value) =>
    set(state => ({
      [fieldName]: { ...state[fieldName], value, touched: true }
    } as any)),

  setFieldTouched: (fieldName, touched) =>
    set(state => ({
      [fieldName]: { ...state[fieldName], touched }
    } as any)),

  resetForm: () => set({
    fullName: createInitialField('form-fullName'),
    phone:    createInitialField('form-phone'),
    email:    createInitialField('form-email'),
    address:  createInitialField('form-address'),
    city:     createInitialField('form-city'),
    notes:    createInitialField('form-notes'),
  }),

  areAllFieldsValid: () => {
    const state = get();
    return (
      state.fullName.isValid &&
      state.phone.isValid &&
      state.email.isValid &&
      state.address.isValid &&
      state.city.isValid
    );
  },
}));

// Hooks for ease of use
export const useFormField = (fieldName: keyof FormState) =>
  useFormStore(state => state[fieldName]);

export const useFormValid = () =>
  useFormStore(state => state.areAllFieldsValid());

export const useAllFormFields = () =>
  useFormStore(state => ({
    fullName: state.fullName,
    phone:    state.phone,
    email:    state.email,
    address:  state.address,
    city:     state.city,
    notes:    state.notes,
  }));
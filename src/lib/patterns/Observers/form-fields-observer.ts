// observers/form-fields-observer.ts

import { GenericSubject } from './base-observer';
import type { State } from './base-observer';

export interface FormFieldData {
  id: string;
  value: string;
  isValid: boolean;
  errorMessage: string;
  touched: boolean;
}

export interface FormFieldsState extends State {
  formData: {
    fullName: FormFieldData;
    phone: FormFieldData;
    email: FormFieldData;
    address: FormFieldData;
    city: FormFieldData;
    notes: FormFieldData;
  };
}

export class FormFieldsSubject extends GenericSubject<FormFieldsState> {
  private static instance: FormFieldsSubject;

  private constructor() {
    super({
      formData: {
        fullName: { id: 'form-fullName', value: '', isValid: false, errorMessage: '', touched: false },
        phone: { id: 'form-phone', value: '', isValid: false, errorMessage: '', touched: false },
        email: { id: 'form-email', value: '', isValid: false, errorMessage: '', touched: false },
        address: { id: 'form-address', value: '', isValid: false, errorMessage: '', touched: false },
        city: { id: 'form-city', value: '', isValid: false, errorMessage: '', touched: false },
        notes: { id: 'form-notes', value: '', isValid: false, errorMessage: '', touched: false }
      }
    });
  }

  public static getInstance(): FormFieldsSubject {
    if (!FormFieldsSubject.instance) {
      FormFieldsSubject.instance = new FormFieldsSubject();
    }
    return FormFieldsSubject.instance;
  }

  public initializeFields(fieldIds: readonly string[]): void {
    const formData = {
      fullName: { id: 'form-fullName', value: '', isValid: false, errorMessage: '', touched: false },
      phone: { id: 'form-phone', value: '', isValid: false, errorMessage: '', touched: false },
      email: { id: 'form-email', value: '', isValid: false, errorMessage: '', touched: false },
      address: { id: 'form-address', value: '', isValid: false, errorMessage: '', touched: false },
      city: { id: 'form-city', value: '', isValid: false, errorMessage: '', touched: false },
      notes: { id: 'form-notes', value: '', isValid: false, errorMessage: '', touched: false }
    };

    // Initialize fields based on their IDs
    fieldIds.forEach(id => {
      const fieldKey = this.getFieldKeyFromId(id);
      if (fieldKey) {
        formData[fieldKey] = {
          id,
          value: '',
          isValid: false,
          errorMessage: '',
          touched: false,
        };
      }
    });

    this.setState({ formData });
  }

  private getFieldKeyFromId(fieldId: string): keyof FormFieldsState['formData'] | null {
    const mapping: Record<string, keyof FormFieldsState['formData']> = {
      'form-fullName': 'fullName',
      'form-phone': 'phone',
      'form-email': 'email',
      'form-address': 'address',
      'form-city': 'city',
      'form-notes': 'notes'
    };
    
    return mapping[fieldId] || null;
  }

  public updateField(fieldId: string, updates: Partial<FormFieldData>): void {
    const currentState = this.getState();
    const formData = { ...currentState.formData };
    
    const fieldKey = this.getFieldKeyFromId(fieldId);
    if (fieldKey && formData[fieldKey]) {
      formData[fieldKey] = { ...formData[fieldKey], ...updates };
    }

    this.setState({ formData });
  }

  public getField(fieldId: string): FormFieldData | null {
    const formData = this.getState().formData;
    
    const fieldKey = this.getFieldKeyFromId(fieldId);
    return fieldKey ? formData[fieldKey] : null;
  }

  public getAllFields(): Record<string, FormFieldData | null> {
    return this.getState().formData;
  }

  public areAllFieldsValid(): boolean {
    const formData = this.getState().formData;
    // Check if all required fields are valid
    return (
      formData.fullName?.isValid === true &&
      formData.phone?.isValid === true &&
      formData.email?.isValid === true &&
      formData.address?.isValid === true &&
      formData.city?.isValid === true
    );
  }
}
export type State = Record<string, any>;

export interface Subject<T extends State> {
  attach(observer: Observer<T>): void;
  detach(observer: Observer<T>): void;
  notify(): void;
  getState(): T;
  setState(newState: Partial<T>): void;
}

export interface Observer<T extends State> {
  update(subject: Subject<T>): void;
}

export class GenericSubject<T extends State> implements Subject<T> {
  private observers: Observer<T>[] = [];
  private state: T;

  constructor(initialState: T) {
    this.state = initialState;
  }

  public getState(): T {
    return this.state;
  }

  public setState(newState: Partial<T>): void {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  public attach(observer: Observer<T>): void {
    if (this.observers.includes(observer)) {
      console.log('Subject: Observer has been attached already.');
      return;
    }
    this.observers.push(observer);
    observer.update(this);
  }

  public detach(observer: Observer<T>): void {
    const index = this.observers.indexOf(observer);
    if (index === -1) {
      console.log('Subject: Nonexistent observer.');
      return;
    }
    this.observers.splice(index, 1);
  }

  public notify(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }
}

// Quantity Observer Example
export interface QuantityState extends State {
  quantity: number;
  selectedItem: any | null;
}

export class QuantityOptionsSubject extends GenericSubject<QuantityState> {
  private static instance: QuantityOptionsSubject;

  private constructor() {
    super({ quantity: 1, selectedItem: null });
  }

  public static getInstance(): QuantityOptionsSubject {
    if (!QuantityOptionsSubject.instance) {
      QuantityOptionsSubject.instance = new QuantityOptionsSubject();
    }
    return QuantityOptionsSubject.instance;
  }
}

// Color & Size Observer Example
export interface ColorSizeOption {
  panelIndex: number;
  color: string | null;
  size: string | null;
}

export interface ColorSizeState extends State {
  options: ColorSizeOption[];
}

export class ColorSizeOptionsSubject extends GenericSubject<ColorSizeState> {
  private static instance: ColorSizeOptionsSubject;

  private constructor() {
    super({ options: [] });
  }

  public static getInstance(): ColorSizeOptionsSubject {
    if (!ColorSizeOptionsSubject.instance) {
      ColorSizeOptionsSubject.instance = new ColorSizeOptionsSubject();
    }
    return ColorSizeOptionsSubject.instance;
  }

  public initializePanels(quantity: number): void {
    const options: ColorSizeOption[] = [];
    for (let i = 1; i <= quantity; i++) {
      options.push({ panelIndex: i, color: null, size: null });
    }
    this.setState({ options });
  }

  public updatePanelOption(panelIndex: number, updates: Partial<ColorSizeOption>): void {
    const opts = this.getState().options.map(opt =>
      opt.panelIndex === panelIndex ? { ...opt, ...updates } : opt
    );
    this.setState({ options: opts });
  }

  public getPanelOption(panelIndex: number): ColorSizeOption | undefined {
    return this.getState().options.find(opt => opt.panelIndex === panelIndex);
  }

  public getAllOptions(): ColorSizeOption[] {
    return this.getState().options;
  }
}

// Form Fields Observer
export interface FormFieldData {
  id: string;
  value: string;
  isValid: boolean;
  errorMessage: string;
  touched : Boolean;
}

export interface FormFieldsState extends State {
  formData: {
    fullName: FormFieldData;
    phone: FormFieldData;
    email: FormFieldData;
    address: FormFieldData;
    city: FormFieldData;
    paymentOption: FormFieldData;
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
        paymentOption: { id: 'payment-option', value: '', isValid: true, errorMessage: '', touched: false },
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
      paymentOption: { id: 'payment-option', value: '', isValid: true, errorMessage: '', touched: false },
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

    // Initialize payment option field separately since it's not in fieldIds
    formData.paymentOption = {
      id: 'payment-option',
      value: this.getSelectedPaymentOption(),
      isValid: true, // Assuming it's valid by default since one option is pre-selected
      errorMessage: '',
      touched: false,
    };

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

  private getSelectedPaymentOption(): string {
    const paymentRadios = document.querySelectorAll('input[name="payment-option"]');
    for (const radio of paymentRadios) {
      if ((radio as HTMLInputElement).checked) {
        return (radio as HTMLInputElement).value;
      }
    }
    return '';
  }

  public updateField(fieldId: string, updates: Partial<FormFieldData>): void {
    const currentState = this.getState();
    const formData = { ...currentState.formData };
    
    // Handle payment option separately
    if (fieldId === 'payment-option') {
      if (formData.paymentOption) {
        formData.paymentOption = { ...formData.paymentOption, ...updates };
      } else {
        formData.paymentOption = {
          id: fieldId,
          value: updates.value || '',
          isValid: updates.isValid !== undefined ? updates.isValid : true,
          errorMessage: updates.errorMessage || '',
          touched: updates.touched !== undefined ? updates.touched : false,
        };
      }
    } else {
      // Handle regular form fields
      const fieldKey = this.getFieldKeyFromId(fieldId);
      if (fieldKey && formData[fieldKey]) {
        formData[fieldKey] = { ...formData[fieldKey], ...updates };
      }
    }

    this.setState({ formData });
  }

  public getField(fieldId: string): FormFieldData | null {
    const formData = this.getState().formData;
    
    if (fieldId === 'payment-option') {
      return formData.paymentOption;
    }
    
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
      formData.city?.isValid === true &&
      formData.paymentOption?.isValid === true
      // Notes field is optional, so we don't check it here
    );
  }
}

// Delivery Options Observer Example
export interface DeliveryOptionState extends State {
  selectedDeliveryOptionId: string | null;
  selectedDeliveryOptionValue: string | null;
}

export class DeliveryOptionsSubject extends GenericSubject<DeliveryOptionState> {
  private static instance: DeliveryOptionsSubject;

  private constructor() {
    super({ selectedDeliveryOptionId: null, selectedDeliveryOptionValue: null });
  }

  public static getInstance(): DeliveryOptionsSubject {
    if (!DeliveryOptionsSubject.instance) {
      DeliveryOptionsSubject.instance = new DeliveryOptionsSubject();
    }
    return DeliveryOptionsSubject.instance;
  }

  public setDeliveryOption(optionId: string, optionValue: string): void {
    this.setState({ selectedDeliveryOptionId: optionId, selectedDeliveryOptionValue: optionValue });
  }

  public getDeliveryOptionId(): string | null {
    return this.getState().selectedDeliveryOptionId;
  }

  public getDeliveryOptionValue(): string | null {
    return this.getState().selectedDeliveryOptionValue;
  }
}
export interface FormField {
  id: string;
  value: string;
  isValid: boolean;
  errorMessage: string;
  touched: boolean;
}
export interface FormData {
  [key: string]: FormField;
}
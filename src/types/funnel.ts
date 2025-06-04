import type { FunnelData, PurchaseOption, FormField, Product } from '../lib/validate';

export interface FunnelContextType {
  funnelData: FunnelData | null;
  loading: boolean;
  error: string | null;
  isArabic: boolean;
  selectedVariant: { id: number; name: string } | null;
  selectedOption: PurchaseOption | null;
  selectedImage: string | null;
  formErrors: Record<string, string>;
  formData: Record<string, any>;
  setSelectedVariant: (variant: { id: number; name: string } | null) => void;
  setSelectedOption: (option: PurchaseOption | null) => void;
  setSelectedImage: (image: string) => void;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  submitOrder: () => Promise<void>;
  validateForm: () => boolean;
  t: (key: string) => string;
  formatCurrency: (amount: number | undefined) => string;
  formatNumberOnly: (amount: number | undefined) => string;
  getCurrencySymbol: () => string;
}

export interface BlockProps extends Omit<FunnelContextType, 'funnelData'> {
  funnelData: NonNullable<FunnelContextType['funnelData']>;
}

export interface HeaderProps extends BlockProps {
  blockData?: {
    title?: string;
    subtitle?: string;
    logo?: string;
  };
}

export interface HeroProps extends BlockProps {}
export interface ProductDetailsProps extends BlockProps {}
export interface PurchaseOptionsProps extends BlockProps {}

export interface CustomerFormProps extends BlockProps {
  validateForm: () => boolean;
  isSubmitting: boolean;
  blockData?: {
    full_name?: string;
    phone?: string;
    address?: string;
  };
}

export interface FormFieldsProps extends BlockProps {
  blockData?: {
    full_name?: string;
    phone?: string;
    address?: string;
  };
}

export interface FooterProps extends BlockProps {
  blockData?: {
    company_name?: string;
    year?: string;
  };
}

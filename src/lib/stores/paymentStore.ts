// stores/paymentStore.ts
import { create } from 'zustand';

interface PaymentState {
  selectedPaymentOptionId: string | null;
  selectedPaymentOptionValue: string | null;
}

interface PaymentActions {
  setPaymentOption: (optionId: string, optionValue: string) => void;
  clearPaymentOption: () => void;
}

export const usePaymentStore = create<PaymentState & PaymentActions>((set) => ({
  // Initial state
  selectedPaymentOptionId: null,
  selectedPaymentOptionValue: null,

  // Actions
  setPaymentOption: (optionId, optionValue) => 
    set({ selectedPaymentOptionId: optionId, selectedPaymentOptionValue: optionValue }),

  clearPaymentOption: () => 
    set({ selectedPaymentOptionId: null, selectedPaymentOptionValue: null }),
}));

// Simple hooks
export const usePaymentOptionId = () => usePaymentStore((state) => state.selectedPaymentOptionId);
export const usePaymentOptionValue = () => usePaymentStore((state) => state.selectedPaymentOptionValue);
export const usePaymentOption = () => usePaymentStore((state) => ({
  id: state.selectedPaymentOptionId,
  value: state.selectedPaymentOptionValue,
}));
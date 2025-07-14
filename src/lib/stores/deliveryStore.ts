// stores/deliveryStore.ts
import { create } from 'zustand';

interface DeliveryState {
  selectedDeliveryOptionId: string | null;
  selectedDeliveryOptionValue: string | null;
}

interface DeliveryActions {
  setDeliveryOption: (optionId: string, optionValue: string) => void;
  clearDeliveryOption: () => void;
}

export const useDeliveryStore = create<DeliveryState & DeliveryActions>((set) => ({
  // Initial state
  selectedDeliveryOptionId: null,
  selectedDeliveryOptionValue: null,

  // Actions
  setDeliveryOption: (optionId, optionValue) => 
    set({ selectedDeliveryOptionId: optionId, selectedDeliveryOptionValue: optionValue }),

  clearDeliveryOption: () => 
    set({ selectedDeliveryOptionId: null, selectedDeliveryOptionValue: null }),
}));

// Simple hooks
export const useDeliveryOptionId = () => useDeliveryStore((state) => state.selectedDeliveryOptionId);
export const useDeliveryOptionValue = () => useDeliveryStore((state) => state.selectedDeliveryOptionValue);
export const useDeliveryOption = () => useDeliveryStore((state) => ({
  id: state.selectedDeliveryOptionId,
  value: state.selectedDeliveryOptionValue,
}));
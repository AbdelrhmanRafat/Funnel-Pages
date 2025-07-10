// stores/bundleStore.ts
import { create } from 'zustand';
import type { PurchaseOption } from '../api/types';

interface BundleState {
  quantity: number;
  selectedOffer: PurchaseOption | null;
}

interface BundleActions {
  setQuantity: (quantity: number) => void;
  setSelectedOffer: (offer: any | null) => void;
  setState: (newState: Partial<BundleState>) => void;
}

export const useBundleStore = create<BundleState & BundleActions>((set) => ({
  // Initial state
  quantity: 1,
  selectedOffer: null,
  
  // Actions
  setQuantity: (quantity) => set({ quantity }),
  setSelectedOffer: (selectedOffer) => set({ selectedOffer }),
  setState: (newState) => set((state) => ({ ...state, ...newState })),
}));

// Simple selector hooks (optional but recommended)
export const useQuantity = () => useBundleStore((state) => state.quantity);
export const useSelectedOffer = () => useBundleStore((state) => state.selectedOffer);
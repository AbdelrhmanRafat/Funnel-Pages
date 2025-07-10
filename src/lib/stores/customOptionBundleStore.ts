// stores/customOptionBundleStore.ts
import { create } from 'zustand';

export interface CustomOptionBundle {
  bundleIndex: number;
  firstOption: string | null;
  secondOption: string | null;
  numberOfOptions: number | null;
  sku_id: number | null;
  image: string | null;
}

interface CustomOptionBundlesState {
  options: CustomOptionBundle[];
}

interface CustomOptionActions {
  initializeBundle: (quantity: number) => void;
  updatePanelOption: (panelIndex: number, updates: Partial<CustomOptionBundle>) => void;
  getPanelOption: (panelIndex: number) => CustomOptionBundle | undefined;
}

export const useCustomOptionStore = create<CustomOptionBundlesState & CustomOptionActions>((set, get) => ({
  // Initial state
  options: [],
  
  // Actions
  initializeBundle: (quantity) => {
    const options: CustomOptionBundle[] = [];
    for (let i = 1; i <= quantity; i++) {
      options.push({
        bundleIndex: i,
        firstOption: null,
        numberOfOptions: null,
        secondOption: null,
        sku_id: null,
        image: null
      });
    }
    set({ options });
  },
  
  updatePanelOption: (bundleIndex, updates) => {
    const updated = get().options.map(opt =>
      opt.bundleIndex === bundleIndex ? { ...opt, ...updates } : opt
    );
    set({ options: updated });
  },
  
  getPanelOption: (bundleIndex) => {
    return get().options.find(opt => opt.bundleIndex === bundleIndex);
  },
}));

// Simple selector hooks
export const useAllOptions = () => useCustomOptionStore((state) => state.options);
export const usePanelOption = (bundleIndex: number) => 
  useCustomOptionStore((state) => state.options.find(opt => opt.bundleIndex === bundleIndex));
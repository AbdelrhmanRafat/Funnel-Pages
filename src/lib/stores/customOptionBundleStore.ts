// stores/customOptionBundleStore.ts
import { create } from 'zustand';

export interface CustomOption {
  panelIndex: number;
  firstOption: string | null;
  secondOption: string | null;
  numberOfOptions: number | null;
  sku_id: number | null;
  image: string | null;
}

interface CustomOptionBundlesState {
  options: CustomOption[];
}

interface CustomOptionActions {
  initializeBundle: (quantity: number) => void;
  updatePanelOption: (panelIndex: number, updates: Partial<CustomOption>) => void;
  getPanelOption: (panelIndex: number) => CustomOption | undefined;
}

export const useCustomOptionStore = create<CustomOptionBundlesState & CustomOptionActions>((set, get) => ({
  // Initial state
  options: [],
  
  // Actions
  initializeBundle: (quantity) => {
    const options: CustomOption[] = [];
    for (let i = 1; i <= quantity; i++) {
      options.push({
        panelIndex: i,
        firstOption: null,
        numberOfOptions: null,
        secondOption: null,
        sku_id: null,
        image: null
      });
    }
    set({ options });
  },
  
  updatePanelOption: (panelIndex, updates) => {
    const updated = get().options.map(opt =>
      opt.panelIndex === panelIndex ? { ...opt, ...updates } : opt
    );
    set({ options: updated });
  },
  
  getPanelOption: (panelIndex) => {
    return get().options.find(opt => opt.panelIndex === panelIndex);
  },
}));

// Simple selector hooks
export const useAllOptions = () => useCustomOptionStore((state) => state.options);
export const usePanelOption = (panelIndex: number) => 
  useCustomOptionStore((state) => state.options.find(opt => opt.panelIndex === panelIndex));
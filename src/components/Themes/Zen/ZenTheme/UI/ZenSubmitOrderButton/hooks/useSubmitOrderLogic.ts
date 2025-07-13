import { useState } from 'react';
import type { Language } from "../../../../../../../lib/utils/i18n/translations";

interface UseSubmitOrderLogicProps {
  isProductSelectionComplete: boolean;
  areAllFieldsValid: boolean;
  forceAllTouchedAndValidate: (currentLang: Language) => Promise<void>;
  onModalOpen: () => void;
  currentLang: Language;
}

interface UseSubmitOrderLogicReturn {
  showOptionsError: boolean;
  canSubmit: boolean;
  handleSubmitClick: () => Promise<void>;
}

export const useSubmitOrderLogic = ({
  isProductSelectionComplete,
  areAllFieldsValid,
  forceAllTouchedAndValidate,
  onModalOpen,
  currentLang,
}: UseSubmitOrderLogicProps): UseSubmitOrderLogicReturn => {
  const [showOptionsError, setShowOptionsError] = useState(false);

  const canSubmit = areAllFieldsValid && isProductSelectionComplete;

  const handleSubmitClick = async () => {
    await forceAllTouchedAndValidate(currentLang);
    
    // Re-check validation after forced validation
    const finalCanSubmit = areAllFieldsValid && isProductSelectionComplete;

    setShowOptionsError(!isProductSelectionComplete);

    if (finalCanSubmit) {
      onModalOpen();
    }
  };

  return {
    showOptionsError,
    canSubmit,
    handleSubmitClick,
  };
};
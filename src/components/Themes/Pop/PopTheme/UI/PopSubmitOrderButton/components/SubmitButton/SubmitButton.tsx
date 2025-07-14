import React from 'react';
import SubmitLoadingSpinner from '../SubmitLoadingSpinner/SubmitLoadingSpinner';
import './SubmitButton.css';
import { getTranslation, type Language } from '../../../../../../../../lib/utils/i18n/translations';

interface SubmitButtonProps {
  isValidating: boolean;
  onClick: () => void;
  disabled: boolean;
  currentLang: Language;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isValidating,
  onClick,
  disabled,
  currentLang,
}) => {
  return (
    <button
      type="button"
      data-submit-order-button
      className={`pop-submit-button-button-base text-sm px-6 py-3 md:text-base md:px-8 md:py-4 ${
        isValidating ? 'pop-submit-button-button-validating' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
      aria-busy={isValidating}
    >
      {isValidating ? (
        <SubmitLoadingSpinner />
      ) : (
        getTranslation("form.submit", currentLang)
      )}
    </button>
  );
};

export default SubmitButton;
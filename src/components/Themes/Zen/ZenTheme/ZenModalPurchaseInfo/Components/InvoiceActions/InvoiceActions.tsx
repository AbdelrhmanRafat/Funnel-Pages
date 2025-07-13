import React from 'react';
import { getTranslation, type Language } from "../../../../../../../lib/utils/i18n/translations";
import './InvoiceActions.css';
import ZenConfirmPurchaseButtonReact from '../../../UI/ZenConfirmPurchaseButton/ZenConfirmPurchaseButtonReact';

interface InvoiceActionsProps {
  isProcessing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isArabic: boolean;
  currentLang: Language;
}

const InvoiceActions: React.FC<InvoiceActionsProps> = ({
  isProcessing,
  onConfirm,
  onCancel,
  isArabic,
  currentLang,
}) => {
  return (
    <div className="zen-invoice-actions flex flex-col sm:flex-row gap-4 pt-6">
      <ZenConfirmPurchaseButtonReact 
        isArabic={isArabic}
        onClick={onConfirm}
        disabled={isProcessing}
      />
      <button
        type="button"
        className="zen-cancel-button flex-1 px-6 py-4 rounded-xl font-semibold border-2 transition-all duration-300 hover:transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        onClick={onCancel}
        disabled={isProcessing}
      >
        {getTranslation('modal.cancel', currentLang)}
      </button>
    </div>
  );
};

export default InvoiceActions;
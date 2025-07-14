import React from 'react';
import { getTranslation, type Language } from "../../../../../../../lib/utils/i18n/translations";
import './InvoiceHeader.css';

interface InvoiceHeaderProps {
  currentLang: Language;
  invoiceNumber: string;
  invoiceDate: string;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
  currentLang,
  invoiceNumber,
  invoiceDate,
}) => {
  return (
    <div className="urban-invoiceheader-div-container p-6 md:p-8 rounded-t-xl">
      <div className="text-center">
        <h3
          id="invoice-title"
          className="urban-invoiceheader-h1-title text-xl md:text-2xl lg:text-3xl font-bold"
        >
          {getTranslation('modal.purchaseInfo', currentLang)}
        </h3>
      </div>
    </div>
  );
};

export default InvoiceHeader;
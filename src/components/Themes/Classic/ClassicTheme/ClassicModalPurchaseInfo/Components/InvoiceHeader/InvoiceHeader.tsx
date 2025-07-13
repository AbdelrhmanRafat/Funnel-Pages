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
    <div className="classic-invoice-header p-8 rounded-t-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 
            id="invoice-title" 
            className="classic-invoice-title text-2xl md:text-3xl font-bold mb-2"
          >
            {getTranslation('modal.purchaseInfo', currentLang)}
          </h1>
          <p className="classic-invoice-subtitle text-sm opacity-80">
            {getTranslation('modal.secureEncrypted', currentLang)}
          </p>
        </div>
        <div className="text-right">
          <div className="classic-invoice-number text-lg font-bold mb-1">
            {invoiceNumber}
          </div>
          <div className="classic-invoice-date text-sm opacity-75">
            {invoiceDate}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
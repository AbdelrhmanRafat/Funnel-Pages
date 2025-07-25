import React from 'react';
import { getTranslation, type Language } from "../../../../../../../lib/utils/i18n/translations";
import './PaymentSummarySection.css';

interface PricingDetails {
  total: number;
}

interface PaymentSummarySectionProps {
  pricingDetails: PricingDetails;
  currentLang: Language;
}

const PaymentSummarySection: React.FC<PaymentSummarySectionProps> = ({
  pricingDetails,
  currentLang,
}) => {
  return (
    <div className="classic-paymentsummary-div-container">
      <h3 className="classic-paymentsummary-h3-title text-lg font-bold mb-4 pb-2 border-b-2">
        {getTranslation('modal.finalTotal', currentLang)}
      </h3>
      
      <div className="classic-paymentsummary-div-table rounded-lg p-6">
        <div className="classic-paymentsummary-div-totalrow flex justify-between items-center p-4 rounded-lg">
          <span className="classic-paymentsummary-span-totallabel text-xl font-bold">
            {getTranslation('modal.finalTotal', currentLang)}
          </span>
          <span className="classic-paymentsummary-span-totalamount text-2xl font-bold">
            ${pricingDetails.total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummarySection;
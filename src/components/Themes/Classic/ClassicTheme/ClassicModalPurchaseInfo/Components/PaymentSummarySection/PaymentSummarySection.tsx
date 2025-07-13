import React from 'react';
import { getTranslation, type Language } from "../../../../../../../lib/utils/i18n/translations";
import './PaymentSummarySection.css';

interface PricingDetails {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  quantity: number;
  itemCount?: number;
  pricePerItem?: number;
}

interface PaymentSummarySectionProps {
  pricingDetails: PricingDetails;
  hasBundles: boolean;
  currentLang: Language;
}

const PaymentSummarySection: React.FC<PaymentSummarySectionProps> = ({
  pricingDetails,
  hasBundles,
  currentLang,
}) => {
  return (
    <div className="classic-payment-summary">
      <h3 className="classic-section-title text-lg font-bold mb-4">
        Payment Summary
      </h3>
      
      <div className="classic-summary-table rounded-lg p-6">
        <div className="space-y-4">
          <div className="classic-subtotal-row flex justify-between items-center">
            <span className="text-base">{getTranslation('modal.subtotal', currentLang)}</span>
            <span className="font-medium">${pricingDetails.subtotal.toFixed(2)}</span>
          </div>
          
          {pricingDetails.discount > 0 && (
            <div className="classic-discount-row flex justify-between items-center">
              <span className="text-base">{getTranslation('modal.totalDiscount', currentLang)}</span>
              <span className="classic-discount-amount font-medium">-${pricingDetails.discount.toFixed(2)}</span>
            </div>
          )}
          
          {pricingDetails.shipping > 0 && (
            <div className="classic-shipping-row flex justify-between items-center">
              <span className="text-base">Shipping</span>
              <span className="font-medium">${pricingDetails.shipping.toFixed(2)}</span>
            </div>
          )}
          
          {hasBundles && pricingDetails.itemCount && (
            <div className="classic-bundle-info-row flex justify-between items-center text-sm opacity-75">
              <span>Bundle Item Count</span>
              <span>{pricingDetails.itemCount} Items</span>
            </div>
          )}
          
          {hasBundles && pricingDetails.pricePerItem && (
            <div className="classic-bundle-info-row flex justify-between items-center text-sm opacity-75">
              <span>{getTranslation('modal.pricePerItem', currentLang)}</span>
              <span>${pricingDetails.pricePerItem.toFixed(2)}</span>
            </div>
          )}
          
          <div className="classic-divider my-4"></div>
          
          <div className="classic-total-row flex justify-between items-center">
            <span className="text-xl font-bold">{getTranslation('modal.finalTotal', currentLang)}</span>
            <span className="classic-total-amount text-2xl font-bold">${pricingDetails.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummarySection;
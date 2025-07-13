import React from 'react';
import { getTranslation, type Language } from "../../../../../../../lib/utils/i18n/translations";
import './BillingSection.css';

interface BillingSectionProps {
  form: any; // FormStore state
  delivery: any; // DeliveryStore state  
  payment: any; // PaymentStore state
  currentLang: Language;
}

const BillingSection: React.FC<BillingSectionProps> = ({
  form,
  delivery,
  payment,
  currentLang,
}) => {
  return (
    <div className="classic-billing-section">
      <h3 className="classic-section-title text-lg font-bold mb-4 flex items-center gap-3">
        <div className="classic-section-icon p-2 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        {getTranslation('modal.customerInfo', currentLang)}
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bill To */}
        <div className="classic-billing-address">
          <h4 className="classic-address-title text-base font-bold mb-4">
            Bill To
          </h4>
          <div className="classic-address-details space-y-3">
            <div className="classic-field-row">
              <span className="classic-field-label">{getTranslation('modal.fullName', currentLang)}</span>
              <span className="classic-field-value">{form.fullName.value || '-'}</span>
            </div>
            <div className="classic-field-row">
              <span className="classic-field-label">{getTranslation('modal.email', currentLang)}</span>
              <span className="classic-field-value">{form.email.value || '-'}</span>
            </div>
            <div className="classic-field-row">
              <span className="classic-field-label">{getTranslation('modal.phone', currentLang)}</span>
              <span className="classic-field-value">{form.phone.value || '-'}</span>
            </div>
            <div className="classic-field-row">
              <span className="classic-field-label">{getTranslation('modal.address', currentLang)}</span>
              <span className="classic-field-value">{form.address.value || '-'}</span>
            </div>
            <div className="classic-field-row">
              <span className="classic-field-label">{getTranslation('modal.city', currentLang)}</span>
              <span className="classic-field-value">{form.city.value || '-'}</span>
            </div>
          </div>
        </div>

        {/* Delivery & Payment Info */}
        <div className="classic-delivery-info">
          <h4 className="classic-address-title text-base font-bold mb-4">
            Order Details
          </h4>
          <div className="classic-delivery-details space-y-3">
            <div className="classic-field-row">
              <span className="classic-field-label">{getTranslation('modal.deliveryMethod', currentLang)}</span>
              <span className="classic-field-value">{delivery.selectedDeliveryOptionValue || '-'}</span>
            </div>
            <div className="classic-field-row">
              <span className="classic-field-label">{getTranslation('modal.paymentMethod', currentLang)}</span>
              <span className="classic-field-value">{payment.selectedPaymentOptionValue || '-'}</span>
            </div>
            {form.notes.value && (
              <div className="classic-field-row">
                <span className="classic-field-label">{getTranslation('modal.notes', currentLang)}</span>
                <span className="classic-field-value">{form.notes.value}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingSection;
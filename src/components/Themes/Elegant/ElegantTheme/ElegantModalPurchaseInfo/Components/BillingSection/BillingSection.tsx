import React from 'react';
import { getTranslation, type Language } from "../../../../../../../lib/utils/i18n/translations";
import './BillingSection.css';

interface FormStore {
  fullName: { value: string };
  email: { value: string };
  phone: { value: string };
  address: { value: string };
  city: { value: string };
  notes: { value: string };
}

interface DeliveryStore {
  selectedDeliveryOptionValue: string;
}

interface PaymentStore {
  selectedPaymentOptionValue: string;
}

interface BillingSectionProps {
  form: FormStore;
  delivery: DeliveryStore;
  payment: PaymentStore;
  currentLang: Language;
}

const BillingSection: React.FC<BillingSectionProps> = ({
  form,
  delivery,
  payment,
  currentLang,
}) => {
  return (
    <div className="elegant-billingsection-div-container">
      <h3 className="elegant-billingsection-h3-title text-lg md:text-xl font-bold mb-4 md:mb-6 pb-2 border-b-2 flex items-center gap-3">
        <div className="elegant-billingsection-div-icon p-2 rounded-lg">
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        {getTranslation('modal.customerInfo', currentLang)}
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Customer Details Card */}
        <div className="elegant-billingsection-div-customercard p-4 md:p-6 rounded-lg border">
          <div className="space-y-3 md:space-y-4">
            {/* Full Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-2">
              <span className="elegant-billingsection-span-label text-sm font-medium">
                {getTranslation('modal.fullName', currentLang)}:
              </span>
              <span className="elegant-billingsection-span-value md:col-span-2 font-semibold text-sm md:text-base">
                {form.fullName.value || '-'}
              </span>
            </div>
            
            {/* Email */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-2">
              <span className="elegant-billingsection-span-label text-sm font-medium">
                {getTranslation('modal.email', currentLang)}:
              </span>
              <span className="elegant-billingsection-span-value md:col-span-2 font-semibold text-sm md:text-base">
                {form.email.value || '-'}
              </span>
            </div>
            
            {/* Phone */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-2">
              <span className="elegant-billingsection-span-label text-sm font-medium">
                {getTranslation('modal.phone', currentLang)}:
              </span>
              <span className="elegant-billingsection-span-value md:col-span-2 font-semibold text-sm md:text-base">
                {form.phone.value || '-'}
              </span>
            </div>
            
            {/* Address */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-2">
              <span className="elegant-billingsection-span-label text-sm font-medium">
                {getTranslation('modal.address', currentLang)}:
              </span>
              <span className="elegant-billingsection-span-value md:col-span-2 font-semibold text-sm md:text-base break-words">
                {form.address.value || '-'}
              </span>
            </div>
            
            {/* City */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-2">
              <span className="elegant-billingsection-span-label text-sm font-medium">
                {getTranslation('modal.city', currentLang)}:
              </span>
              <span className="elegant-billingsection-span-value md:col-span-2 font-semibold text-sm md:text-base">
                {form.city.value || '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="elegant-billingsection-div-ordercard p-4 md:p-6 rounded-lg border">
          
          <div className="space-y-3 md:space-y-4">
            {/* Delivery Method */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-2">
              <span className="elegant-billingsection-span-label text-sm font-medium">
                {getTranslation('modal.deliveryMethod', currentLang)}:
              </span>
              <span className="elegant-billingsection-span-value md:col-span-2 font-semibold text-sm md:text-base">
                {delivery.selectedDeliveryOptionValue || '-'}
              </span>
            </div>
            
            {/* Payment Method */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-2">
              <span className="elegant-billingsection-span-label text-sm font-medium">
                {getTranslation('modal.paymentMethod', currentLang)}:
              </span>
              <span className="elegant-billingsection-span-value md:col-span-2 font-semibold text-sm md:text-base">
                {payment.selectedPaymentOptionValue || '-'}
              </span>
            </div>
            
            {/* Notes (if any) */}
            {form.notes.value && (
              <div className="grid grid-cols-1 gap-1 md:gap-2">
                <span className="elegant-billingsection-span-label text-sm font-medium">
                  {getTranslation('modal.notes', currentLang)}:
                </span>
                <div className="elegant-billingsection-div-notes p-3 rounded border mt-2">
                  <span className="elegant-billingsection-span-notesvalue text-sm md:text-base leading-relaxed">
                    {form.notes.value}
                  </span>
                </div>
              </div>
            )}
            
            {/* Empty State for Notes */}
            {!form.notes.value && (
              <div className="elegant-billingsection-div-empty text-center py-4">
                <span className="elegant-billingsection-span-empty text-xs md:text-sm">
                  {getTranslation('modal.noAdditionalNotes', currentLang) || 'No additional notes'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingSection;
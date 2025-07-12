import "./ClassicModalPurchaseInfo.css";
import React, { useState, useEffect, useMemo } from 'react';
import type { Language } from "../../../../../lib/utils/i18n/translations";
import { getTranslation } from "../../../../../lib/utils/i18n/translations";
import { useBundleStore } from '../../../../../lib/stores/bundleStore';
import { useCustomOptionBundleStore } from '../../../../../lib/stores/customOptionBundleStore';
import { useFormStore } from '../../../../../lib/stores/formStore';
import { usePaymentStore } from '../../../../../lib/stores/paymentStore';
import { useDeliveryStore } from '../../../../../lib/stores/deliveryStore';
import ClassicConfirmPurchaseButtonReact from "../UI/ClassicConfirmPurchaseButton/ClassicConfirmPurchaseButtonReact";
import { useProductStore } from "../../../../../lib/stores/customOptionsNonBundleStore";
import type { Product } from "../../../../../lib/api/types";
import CelebrationView from "./CelebrationView";

interface ClassicModalPurchaseInfoReactProps {
  product: Product;
  isArabic: boolean;
  currentLang: Language;
  hasVariants: boolean;
  hasBundles: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const ClassicModalPurchaseInfoReact: React.FC<ClassicModalPurchaseInfoReactProps> = ({
  product,
  isArabic,
  currentLang,
  hasVariants,
  hasBundles,
  isOpen,
  onClose
}) => {
  const [currentView, setCurrentView] = useState<'purchase' | 'celebration'>('purchase');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [invoiceNumber] = useState(() => 'INV-' + Date.now().toString().slice(-6));
  const [invoiceDate] = useState(() => new Date().toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US'));

  // Store hooks
  const bundle = useBundleStore();
  const productOptions = useProductStore();
  const customOptions = useCustomOptionBundleStore((state) => state.options);
  const form = useFormStore();
  const payment = usePaymentStore();
  const delivery = useDeliveryStore();

  // Calculate pricing details
  const pricingDetails = useMemo(() => {
    let subtotal = 0;
    let discount = 0;
    let shipping = 0;
    let quantity = 1;

    if (hasBundles && bundle.selectedOffer) {
      subtotal = bundle.selectedOffer.final_total + bundle.selectedOffer.discount;
      discount = bundle.selectedOffer.discount;
      shipping = delivery.selectedDeliveryOptionId === 'delivery-pickup' ? 0 : bundle.selectedOffer.shipping_price;
      quantity = bundle.quantity;
    } else if (productOptions.selectedOption) {
      const option = productOptions.selectedOption;
      quantity = option.qty || 1;
      const unitPrice = option.price || 0;
      const unitDiscountPrice = option.price_after_discount || unitPrice;
      
      subtotal = unitPrice * quantity;
      discount = (unitPrice - unitDiscountPrice) * quantity;
      shipping = 0; // Add shipping logic if needed
    }

    const total = subtotal - discount + shipping;

    return { subtotal, discount, shipping, total, quantity };
  }, [bundle.selectedOffer, bundle.quantity, productOptions.selectedOption, delivery.selectedDeliveryOptionId, hasBundles]);

  // Create line items for invoice table
  const createLineItems = () => {
    const items = [];

    if (hasBundles && bundle.selectedOffer) {
      items.push({
        description: bundle.selectedOffer.title,
        sku: `BUNDLE-${bundle.selectedOffer || 'PKG'}`,
        quantity: bundle.quantity,
        unitPrice: bundle.selectedOffer.final_total / bundle.quantity,
        discount: bundle.selectedOffer.discount,
        total: bundle.selectedOffer.final_total
      });
    } else if (productOptions.selectedOption) {
      const option = productOptions.selectedOption;
      const productName = isArabic ? product.name_ar : product.name_en;
      
      items.push({
        description: productName,
        sku: product.sku_code,
        quantity: option.qty || 1,
        unitPrice: option.price || 0,
        discount: ((option.price || 0) - (option.price_after_discount || 0)) * (option.qty || 1),
        total: (option.price_after_discount || 0) * (option.qty || 1),
        variants: [option.firstOption, option.secondOption].filter(Boolean)
      });
    }

    return items;
  };

  // Handle order confirmation
  const handleOrderConfirm = async () => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newOrderNumber = '#' + Math.floor(Math.random() * 900000 + 100000);
      setOrderNumber(newOrderNumber);
      setCurrentView('celebration');
    } catch (error) {
      // Handle error
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setCurrentView('purchase');
    setOrderNumber('');
    onClose();
  };

  // Handle continue shopping
  const handleContinue = () => {
    handleClose();
    window.location.reload();
  };

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const lineItems = createLineItems();

  return (
    <div 
      className="fixed inset-0 z-[1000] flex justify-center items-center transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-title"
    >
      {/* Overlay */}
      <div 
        className="classic-modal-overlay absolute inset-0 z-[1001] transition-opacity duration-300" 
        onClick={handleClose}
        aria-hidden="true"
      />
      
      {/* Invoice Container */}
      <div className="relative container md:w-10/12 lg:w-8/12 xl:w-6/12 max-h-[95vh] overflow-y-auto z-[1002] m-4 transition-all duration-300 transform">
        <div className="classic-invoice-container rounded-xl shadow-2xl">
          
          {/* Purchase Invoice View */}
          {currentView === 'purchase' && (
            <div className="w-full">
              {/* Invoice Header */}
              <div className="classic-invoice-header p-8 rounded-t-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 id="invoice-title" className="classic-invoice-title text-2xl md:text-3xl font-bold mb-2">
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

              {/* Invoice Body */}
              <div className="p-6 md:p-8 space-y-8">
                
                {/* Product Information Section */}
                <div className="classic-product-details-section">
                  <h2 className="classic-section-title text-xl font-bold mb-4 flex items-center gap-3">
                    <div className="classic-section-icon p-2 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                      </svg>
                    </div>
                    {getTranslation('modal.orderSummary', currentLang)}
                  </h2>
                  
                  <div className="classic-product-info-card rounded-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                      <div className="flex-1">
                        <h3 className="classic-product-name text-lg font-bold mb-2">
                          {isArabic ? product.name_ar : product.name_en}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="classic-product-sku">
                            <span className="font-medium">{getTranslation('product.productCode', currentLang)}:</span>
                            <span className="ml-2">{product.sku_code}</span>
                          </div>
                          <div className="classic-product-status">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.is_active 
                                ? 'classic-status-active' 
                                : 'classic-status-inactive'
                            }`}>
                              {product.is_active 
                                ? getTranslation('product.available', currentLang)
                                : getTranslation('product.notAvailable', currentLang)
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="classic-line-items-section">
                  <h3 className="classic-section-title text-lg font-bold mb-4">
                    {getTranslation('modal.itemsCount', currentLang)}
                  </h3>
                  
                  <div className="classic-line-items-table rounded-lg overflow-hidden">
                    {/* Table Header */}
                    <div className="classic-table-header grid grid-cols-12 gap-4 p-4 text-sm font-bold">
                      <div className="col-span-5">{getTranslation('modal.item', currentLang)}</div>
                      <div className="col-span-2 text-center">{getTranslation('modal.totalQuantity', currentLang)}</div>
                      <div className="col-span-2 text-right">{getTranslation('modal.pricePerItem', currentLang)}</div>
                      <div className="col-span-2 text-right">{getTranslation('modal.discount', currentLang)}</div>
                      <div className="col-span-1 text-right">{getTranslation('modal.subtotal', currentLang)}</div>
                    </div>
                    
                    {/* Table Body */}
                    <div className="classic-table-body">
                      {lineItems.map((item, index) => (
                        <div key={index} className="classic-line-item-row grid grid-cols-12 gap-4 p-4 border-t">
                          <div className="col-span-5">
                            <div className="classic-line-item-description">
                              <div className="font-medium mb-1">{item.description}</div>
                              <div className="text-xs opacity-75 mb-2">SKU: {item.sku}</div>
                              {item.variants && item.variants.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                  {item.variants.map((variant, idx) => (
                                    <span key={idx} className="classic-variant-tag px-2 py-1 rounded-full text-xs">
                                      {variant}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-span-2 text-center">
                            <span className="classic-line-item-quantity px-3 py-1 rounded-lg text-sm font-bold">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="col-span-2 text-right">
                            <div className="classic-line-item-price font-medium">
                              ${item.unitPrice.toFixed(2)}
                            </div>
                          </div>
                          <div className="col-span-2 text-right">
                            <div className="classic-line-item-discount font-medium">
                              {item.discount > 0 ? `-$${item.discount.toFixed(2)}` : '$0.00'}
                            </div>
                          </div>
                          <div className="col-span-1 text-right">
                            <div className="classic-line-item-total font-bold">
                              ${item.total.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Custom Options Section */}
                {hasVariants && hasBundles && customOptions.length > 0 && (
                  <div className="classic-bundle-options-section">
                    <h3 className="classic-section-title text-lg font-bold mb-4 flex items-center gap-3">
                      <div className="classic-section-icon p-2 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                        </svg>
                      </div>
                      {getTranslation('modal.bundleOptions', currentLang)}
                    </h3>
                    
                    <div className="classic-options-grid grid grid-cols-1 md:grid-cols-2 gap-4">
                      {customOptions.map((option, index) => (
                        <div key={index} className="classic-option-item rounded-lg p-4">
                          <div className="classic-option-header text-sm font-bold mb-2">
                            {getTranslation('modal.item', currentLang)} {option.bundleIndex}
                          </div>
                          <div className="classic-option-details space-y-2">
                            <div className="classic-option-selection">
                              <span className="classic-selection-tag px-3 py-1 rounded-full text-xs font-medium">
                                {option.firstOption}
                              </span>
                            </div>
                            {option.secondOption && (
                              <div className="classic-option-selection">
                                <span className="classic-selection-tag px-3 py-1 rounded-full text-xs font-medium">
                                  {option.secondOption}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Billing Information Section */}
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
                        {getTranslation('modal.billTo', currentLang)}
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
                        {getTranslation('modal.orderDetails', currentLang)}
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

                {/* Payment Summary Section */}
                <div className="classic-payment-summary">
                  <h3 className="classic-section-title text-lg font-bold mb-4">
                    {getTranslation('modal.paymentSummary', currentLang)}
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
                          <span className="text-base">{getTranslation('modal.shipping', currentLang)}</span>
                          <span className="font-medium">${pricingDetails.shipping.toFixed(2)}</span>
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

                {/* Action Buttons */}
                <div className="classic-invoice-actions flex flex-col sm:flex-row gap-4 pt-6">
                  <ClassicConfirmPurchaseButtonReact 
                    isArabic={isArabic}
                    onClick={handleOrderConfirm}
                    disabled={isProcessing}
                  />
                  <button
                    type="button"
                    className="classic-cancel-button flex-1 px-6 py-4 rounded-xl font-semibold border-2 transition-all duration-300 hover:transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    onClick={handleClose}
                    disabled={isProcessing}
                  >
                    {getTranslation('modal.cancel', currentLang)}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Celebration View */}
          {currentView === 'celebration' && (
            <CelebrationView
              currentLang={currentLang}
              orderNumber={orderNumber}
              onContinue={handleContinue}
              onClose={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassicModalPurchaseInfoReact;
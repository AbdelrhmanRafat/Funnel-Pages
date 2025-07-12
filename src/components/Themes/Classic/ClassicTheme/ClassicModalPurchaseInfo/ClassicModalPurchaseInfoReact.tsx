// ClassicModalPurchaseInfoReact.tsx
import "./ClassicModalPurchaseInfo.css";
import React, { useState, useEffect, useMemo } from 'react';
import type { Language } from "../../../../../lib/utils/i18n/translations";
import { getTranslation } from "../../../../../lib/utils/i18n/translations";
import { useBundleStore } from '../../../../../lib/stores/bundleStore';
import { useProductStore } from '../../../../../lib/stores/customOptionsNonBundleStore';
import { useCustomOptionBundleStore } from '../../../../../lib/stores/customOptionBundleStore';
import { useFormStore } from '../../../../../lib/stores/formStore';
import { usePaymentStore } from '../../../../../lib/stores/paymentStore';
import { useDeliveryStore } from '../../../../../lib/stores/deliveryStore';
import ClassicConfirmPurchaseButtonReact from "../UI/ClassicConfirmPurchaseButton/ClassicConfirmPurchaseButtonReact";

interface ClassicModalPurchaseInfoReactProps {
  isArabic: boolean;
  currentLang: Language;
  hasVariants: boolean;
  hasBundles: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const ClassicModalPurchaseInfoReact: React.FC<ClassicModalPurchaseInfoReactProps> = ({
  isArabic,
  currentLang,
  hasVariants,
  hasBundles,
  isOpen,
  onClose
}) => {
  const [currentView, setCurrentView] = useState<'purchase' | 'celebration'>('purchase');
  const [orderNumber, setOrderNumber] = useState<string>('');

  // Store hooks
  const bundle = useBundleStore();
  const product = useProductStore();
  const customOptions = useCustomOptionBundleStore((state) => state.options);
  const form = useFormStore();
  const payment = usePaymentStore();
  const delivery = useDeliveryStore();

  // Debug function - comprehensive store state logging
  const debugStoreStates = () => {
    console.group('🔍 === COMPLETE STORE STATE DEBUG ===');
    
    console.group('📦 Bundle Store');
    console.log('Selected Offer:', bundle.selectedOffer);
    console.log('Quantity:', bundle.quantity);
    console.groupEnd();

    console.group('🛍️ Product Store');
    console.log('Has Variant:', product.isHaveVariant);
    console.log('Has Second Option:', product.hasSecondOption);
    console.log('Selected Option:', product.selectedOption);
    console.groupEnd();

    console.group('🎨 Custom Options (Bundle)');
    console.log('Options Array:', customOptions);
    console.log('Options Count:', customOptions.length);
    customOptions.forEach((opt, idx) => {
      console.log(`Option ${idx + 1}:`, {
        bundleIndex: opt.bundleIndex,
        firstOption: opt.firstOption,
        secondOption: opt.secondOption,
        numberOfOptions: opt.numberOfOptions,
        sku_id: opt.sku_id
      });
    });
    console.groupEnd();

    console.group('📝 Form Store');
    console.log('Form Valid:', form.areAllFieldsValid());
    console.log('Form Fields:', {
      fullName: { value: form.fullName.value, isValid: form.fullName.isValid },
      phone: { value: form.phone.value, isValid: form.phone.isValid },
      email: { value: form.email.value, isValid: form.email.isValid },
      address: { value: form.address.value, isValid: form.address.isValid },
      city: { value: form.city.value, isValid: form.city.isValid },
      notes: { value: form.notes.value, isValid: form.notes.isValid }
    });
    console.groupEnd();

    console.group('💳 Payment Store');
    console.log('Selected Payment ID:', payment.selectedPaymentOptionId);
    console.log('Selected Payment Value:', payment.selectedPaymentOptionValue);
    console.groupEnd();

    console.group('🚚 Delivery Store');
    console.log('Selected Delivery ID:', delivery.selectedDeliveryOptionId);
    console.log('Selected Delivery Value:', delivery.selectedDeliveryOptionValue);
    console.groupEnd();

    console.groupEnd();
  };

  // Calculate final total with detailed logging
  const finalTotal = useMemo(() => {
    console.group('💰 === PRICE CALCULATION DEBUG ===');
    
    let total = 0;
    
    if (hasBundles && bundle.selectedOffer) {
      console.log('Bundle Calculation:');
      console.log('  Base Total:', bundle.selectedOffer.final_total);
      console.log('  Shipping Price:', bundle.selectedOffer.shipping_price);
      console.log('  Is Pickup:', delivery.selectedDeliveryOptionId === 'delivery-pickup');
      
      total = delivery.selectedDeliveryOptionId === 'delivery-pickup'
        ? bundle.selectedOffer.final_total - bundle.selectedOffer.shipping_price
        : bundle.selectedOffer.final_total;
      
      console.log('  Final Bundle Total:', total);
    } else if (product.selectedOption) {
      console.log('Direct Product Calculation:');
      console.log('  Price After Discount:', product.selectedOption.price_after_discount);
      console.log('  Quantity:', product.selectedOption.qty);
      
      total = (product.selectedOption.price_after_discount || 0) * product.selectedOption.qty;
      
      console.log('  Final Product Total:', total);
    }
    
    console.log('🎯 CALCULATED FINAL TOTAL:', total);
    console.groupEnd();
    
    return total;
  }, [bundle.selectedOffer, product.selectedOption, delivery.selectedDeliveryOptionId, hasBundles]);

  // Generate order processing data
  const generateOrderData = () => {
    console.group('📋 === ORDER DATA GENERATION ===');
    
    const orderData = {
      type: hasBundles ? 'bundle' : 'direct',
      timestamp: new Date().toISOString(),
      
      // Bundle specific data
      ...(hasBundles && {
        bundle: {
          offer: bundle.selectedOffer,
          quantity: bundle.quantity,
          customOptions: customOptions
        }
      }),
      
      // Direct product data
      ...(!hasBundles && {
        product: {
          selectedOption: product.selectedOption,
          hasVariants: product.isHaveVariant,
          hasSecondOption: product.hasSecondOption
        }
      }),
      
      // Customer data
      customer: {
        fullName: form.fullName.value,
        phone: form.phone.value,
        email: form.email.value,
        address: form.address.value,
        city: form.city.value,
        notes: form.notes.value
      },
      
      // Order details
      payment: {
        id: payment.selectedPaymentOptionId,
        value: payment.selectedPaymentOptionValue
      },
      delivery: {
        id: delivery.selectedDeliveryOptionId,
        value: delivery.selectedDeliveryOptionValue
      },
      
      // Totals
      finalTotal: finalTotal
    };
    
    console.log('Generated Order Data:', orderData);
    console.groupEnd();
    
    return orderData;
  };

  // Create direct purchase item HTML
  const createDirectItemHTML = () => {
    if (!product.selectedOption) return '';
    
    const option = product.selectedOption;
    const quantity = option.qty || 1;
    const price = option.price || 0;
    const discountPrice = option.price_after_discount || price;
    const hasDiscount = price > discountPrice;
    
    console.log('🏷️ Direct Item HTML Generation:', {
      option,
      quantity,
      price,
      discountPrice,
      hasDiscount
    });
    
    const optionTags = [];
    if (option.firstOption) optionTags.push(`<span class="classic-direct-option-tag">${option.firstOption}</span>`);
    if (option.secondOption) optionTags.push(`<span class="classic-direct-option-tag">${option.secondOption}</span>`);

    return `
      <div class="classic-direct-item">
        <div class="classic-direct-item-info">
          <div class="classic-direct-item-title">المنتج المحدد</div>
          ${optionTags.length > 0 ? `<div class="classic-direct-item-options">${optionTags.join('')}</div>` : ''}
        </div>
        <div class="classic-direct-item-pricing">
          <div class="classic-direct-item-price">${discountPrice} $</div>
          ${hasDiscount ? `<div class="classic-direct-item-original-price">${price} $</div>` : ''}
          ${hasDiscount ? `<div class="classic-direct-item-discount">وفر ${price - discountPrice} $</div>` : ''}
        </div>
        <div class="classic-direct-item-quantity">${quantity}</div>
      </div>
    `;
  };

  // Handle order confirmation
  const handleOrderConfirm = async () => {
    console.group('🚀 === ORDER CONFIRMATION PROCESS ===');
    
    // Debug all stores before processing
    debugStoreStates();
    
    // Generate order data
    const orderData = generateOrderData();
    
    try {
      console.log('Processing order...');
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate order number
      const newOrderNumber = '#' + Math.floor(Math.random() * 900000 + 100000);
      setOrderNumber(newOrderNumber);
      
      console.log('✅ Order processed successfully!');
      console.log('Order Number:', newOrderNumber);
      
      // Switch to celebration view
      setCurrentView('celebration');
      
      console.groupEnd();
      
    } catch (error) {
      console.error('❌ Order processing failed:', error);
      console.groupEnd();
      throw error;
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
    // Reset modal state and close
    handleClose();
    // Optionally reload page or reset stores
    window.location.reload();
  };

  // Debug on modal open
  useEffect(() => {
    if (isOpen) {
      console.log('🔓 Modal opened - triggering debug');
      debugStoreStates();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="classic-modal fixed inset-0 z-[1000] flex justify-center items-center">
      <div className="classic-modal-overlay absolute inset-0 z-[1001]" onClick={handleClose}></div>
      <div className="classic-modal-container relative container md:w-8/12 lg:w-6/12 max-h-[92vh] overflow-y-auto z-[1002] m-4">
        
        {/* Purchase Info View */}
        {currentView === 'purchase' && (
          <div className="modal-view w-full">
            <div className="classic-modal-header flex justify-between items-center">
              <div className="classic-header-content flex justify-start items-center gap-2">
                <div className="classic-header-accent"></div>
                <h3 className="classic-modal-title">
                  {getTranslation('modal.purchaseInfo', currentLang)}
                </h3>
              </div>
            </div>

            <div className="classic-modal-body">
              <div className="classic-modal-content">
                <div className="classic-purchase-summary">
                  <div className="classic-section-header">
                    <div className="classic-section-icon classic-icon-summary">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <h4 className="classic-section-title">
                      {getTranslation('modal.orderSummary', currentLang)}
                    </h4>
                  </div>

                  {/* Bundle Information */}
                  {hasBundles && bundle.selectedOffer ? (
                    <div className="classic-summary-section">
                      <div className="classic-summary-grid">
                        <div className="classic-summary-column">
                          <div className="classic-summary-item">
                            <span className="classic-summary-label">{getTranslation('modal.orderType', currentLang)}</span>
                            <span className="classic-summary-value">{bundle.selectedOffer.title}</span>
                          </div>
                          <div className="classic-summary-item">
                            <span className="classic-summary-label">{getTranslation('modal.itemsCount', currentLang)}</span>
                            <span className="classic-summary-value">{bundle.selectedOffer.items}</span>
                          </div>
                        </div>
                        <div className="classic-summary-column">
                          <div className="classic-summary-item">
                            <span className="classic-summary-label">{getTranslation('modal.pricePerItem', currentLang)}</span>
                            <span className="classic-summary-value">{bundle.selectedOffer.price_per_item} $</span>
                          </div>
                          <div className="classic-summary-item">
                            <span className="classic-summary-label">{getTranslation('modal.discount', currentLang)}</span>
                            <span className="classic-summary-value classic-discount-info">
                              {bundle.selectedOffer.discount > 0 
                                ? `${bundle.selectedOffer.discount} $ (${bundle.selectedOffer.discount_percent}%)`
                                : getTranslation('modal.noDiscount', currentLang)
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Direct Purchase Information */
                    <div className="classic-summary-section classic-direct-purchase-section">
                      <div className="classic-section-header">
                        <div className="classic-section-icon classic-icon-direct">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                          </svg>
                        </div>
                        <h5 className="classic-subsection-title">{getTranslation('modal.directPurchaseDetails', currentLang)}</h5>
                      </div>

                      <div className="classic-direct-items-list" dangerouslySetInnerHTML={{ __html: createDirectItemHTML() }}></div>

                      <div className="classic-direct-summary">
                        <div className="classic-direct-summary-item">
                          <span className="classic-summary-label">{getTranslation('modal.totalQuantity', currentLang)}</span>
                          <span className="classic-summary-value">{product.selectedOption?.qty || 1}</span>
                        </div>
                        <div className="classic-direct-summary-item">
                          <span className="classic-summary-label">{getTranslation('modal.subtotal', currentLang)}</span>
                          <span className="classic-summary-value">{((product.selectedOption?.price || 0) * (product.selectedOption?.qty || 1))} $</span>
                        </div>
                        <div className="classic-direct-summary-item">
                          <span className="classic-summary-label">{getTranslation('modal.totalDiscount', currentLang)}</span>
                          <span className="classic-summary-value classic-discount-info">
                            {((product.selectedOption?.price || 0) - (product.selectedOption?.price_after_discount || 0)) * (product.selectedOption?.qty || 1)} $
                          </span>
                        </div>
                        <div className="classic-direct-summary-item">
                          <span className="classic-summary-label">{getTranslation('modal.finalTotal', currentLang)}</span>
                          <span className="classic-summary-value">{finalTotal} $</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Custom Options Section */}
                  {hasVariants && hasBundles && customOptions.length > 0 && (
                    <div className="classic-summary-section classic-options-section">
                      <div className="classic-section-header">
                        <div className="classic-section-icon classic-icon-options">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path>
                          </svg>
                        </div>
                        <h5 className="classic-subsection-title">
                          {getTranslation('modal.bundleOptions', currentLang)}
                        </h5>
                      </div>
                      
                      <div className="classic-selection-items flex flex-col gap-2">
                        {customOptions.map((option, index) => (
                          <div className="classic-selection-item" key={index}>
                            <div className="classic-panel-info">{getTranslation('modal.item', currentLang)} {option.bundleIndex}</div>
                            <div className="classic-selection-display"><span>{option.firstOption}</span></div>
                            {option.secondOption && <div className="classic-selection-display"><span>{option.secondOption}</span></div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Customer Information */}
                  <div className="classic-summary-section classic-customer-section">
                    <div className="classic-section-header">
                      <div className="classic-section-icon classic-icon-customer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                      <h5 className="classic-section-title">{getTranslation('modal.customerInfo', currentLang)}</h5>
                    </div>
                    
                    <div className="classic-customer-details">
                      <div className="classic-customer-grid">
                        <div className="classic-customer-column">
                          <div className="classic-customer-field">
                            <span className="classic-field-label">{getTranslation('modal.fullName', currentLang)}</span>
                            <span className="classic-field-value">{form.fullName.value || '-'}</span>
                          </div>
                          <div className="classic-customer-field">
                            <span className="classic-field-label">{getTranslation('modal.phone', currentLang)}</span>
                            <span className="classic-field-value">{form.phone.value || '-'}</span>
                          </div>
                          <div className="classic-customer-field">
                            <span className="classic-field-label">{getTranslation('modal.email', currentLang)}</span>
                            <span className="classic-field-value">{form.email.value || '-'}</span>
                          </div>
                        </div>
                        <div className="classic-customer-column">
                          <div className="classic-customer-field">
                            <span className="classic-field-label">{getTranslation('modal.address', currentLang)}</span>
                            <span className="classic-field-value">{form.address.value || '-'}</span>
                          </div>
                          <div className="classic-customer-field">
                            <span className="classic-field-label">{getTranslation('modal.city', currentLang)}</span>
                            <span className="classic-field-value">{form.city.value || '-'}</span>
                          </div>
                          <div className="classic-customer-field">
                            <span className="classic-field-label">{getTranslation('modal.paymentMethod', currentLang)}</span>
                            <span className="classic-field-value">{payment.selectedPaymentOptionValue || '-'}</span>
                          </div>
                          <div className="classic-customer-field">
                            <span className="classic-field-label">{getTranslation('modal.deliveryMethod', currentLang)}</span>
                            <span className="classic-field-value">{delivery.selectedDeliveryOptionValue || '-'}</span>
                          </div>
                        </div>
                      </div>
                      
                      {form.notes.value && (
                        <div className="classic-customer-field classic-notes-field">
                          <span className="classic-field-label">{getTranslation('modal.notes', currentLang)}</span>
                          <span className="classic-field-value">{form.notes.value}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Total Section */}
                  <div className="classic-summary-total">
                    <div className="classic-total-content">
                      <div className="classic-total-icon">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                        </svg>
                      </div>
                      <span className="classic-total-label">{getTranslation('modal.finalTotal', currentLang)}</span>
                      <span className="classic-total-value">{finalTotal} $</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="classic-modal-actions">
                  <ClassicConfirmPurchaseButtonReact 
                    isArabic={isArabic}
                    onClick={handleOrderConfirm}
                  />
                  <button
                    type="button"
                    className="classic-modal-cancel"
                    onClick={handleClose}
                  >
                    {getTranslation('modal.cancel', currentLang)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Celebration View */}
        {currentView === 'celebration' && (
          <div className="modal-view classic-celebration-view">
            <div className="classic-modal-header classic-celebration-header">
              <div className="classic-celebration-header-content">
                <div className="classic-celebration-icon">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="classic-celebration-title">
                  {getTranslation('celebration.orderConfirmed', currentLang)}
                </h3>
              </div>
            </div>

            <div className="classic-modal-body">
              <div className="classic-celebration-content">
                <div className="classic-celebration-animation">
                  <div className="classic-success-checkmark">
                    <div className="classic-check-icon"></div>
                  </div>
                </div>

                <div className="classic-celebration-message">
                  <h2 className="classic-celebration-main-title">
                    {getTranslation('celebration.thankYou', currentLang)}
                  </h2>
                  <p className="classic-celebration-subtitle">
                    {getTranslation('celebration.detailsMessage', currentLang)}
                  </p>
                </div>

                <div className="classic-celebration-summary">
                  <div className="classic-celebration-items">
                    <div className="classic-celebration-summary-item">
                      <div className="classic-celebration-item-icon classic-icon-order">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                        </svg>
                      </div>
                      <div className="classic-celebration-item-text">
                        <strong>{getTranslation('celebration.orderNumber', currentLang)}</strong>
                        <span>{orderNumber}</span>
                      </div>
                    </div>
                    
                    <div className="classic-celebration-summary-item">
                      <div className="classic-celebration-item-icon classic-icon-delivery">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div className="classic-celebration-item-text">
                        <strong>{getTranslation('celebration.expectedDelivery', currentLang)}</strong>
                        <span>{getTranslation('celebration.deliveryTime', currentLang)}</span>
                      </div>
                    </div>
                    
                    <div className="classic-celebration-summary-item">
                      <div className="classic-celebration-item-icon classic-icon-contact">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                      </div>
                      <div className="classic-celebration-item-text">
                        <strong>{getTranslation('celebration.contactYou', currentLang)}</strong>
                        <span>{getTranslation('celebration.contactTime', currentLang)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="classic-celebration-actions">
                  <button
                    type="button"
                    className="classic-celebration-primary-button"
                    onClick={handleContinue}
                  >
                    {getTranslation('celebration.continueShopping', currentLang)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassicModalPurchaseInfoReact;
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

// Enhanced interfaces for line items
interface LineItem {
  description: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  total: number;
  variants?: string[];
  type: 'bundle-main' | 'bundle-item' | 'direct-purchase';
  parentBundle?: string;
}

interface PricingDetails {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  quantity: number;
  itemCount?: number;
  pricePerItem?: number;
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

  // Enhanced SKU management
  const getDisplaySKU = (item: any, fallback: string): string => {
    return item?.sku_id?.toString() || fallback || `TEMP-${Date.now()}`;
  };

  // Enhanced Bundle Pricing Calculation
  const calculateBundlePricing = useMemo((): PricingDetails => {
    if (!bundle.selectedOffer) {
      return { subtotal: 0, discount: 0, shipping: 0, total: 0, quantity: 0 };
    }

    const offer = bundle.selectedOffer;
    const isPickup = delivery.selectedDeliveryOptionId === 'delivery-pickup';
    
    const subtotal = offer.final_total + offer.discount;
    const discount = offer.discount;
    const shipping = isPickup ? 0 : offer.shipping_price;
    const total = offer.final_total - (isPickup ? offer.shipping_price : 0);

    return {
      subtotal,
      discount,
      shipping,
      total,
      quantity: bundle.quantity,
      itemCount: offer.items,
      pricePerItem: offer.price_per_item
    };
  }, [bundle.selectedOffer, bundle.quantity, delivery.selectedDeliveryOptionId]);

  // Enhanced Direct Purchase Pricing Calculation
  const calculateDirectPricing = useMemo((): PricingDetails => {
    if (!productOptions.selectedOption) {
      return { subtotal: 0, discount: 0, shipping: 0, total: 0, quantity: 0 };
    }

    const option = productOptions.selectedOption;
    const quantity = option.qty || 1;
    const unitPrice = option.price || 0;
    const unitDiscountPrice = option.price_after_discount || unitPrice;
    
    const subtotal = unitPrice * quantity;
    const discount = (unitPrice - unitDiscountPrice) * quantity;
    const shipping = 0; // Add shipping logic if needed
    const total = unitDiscountPrice * quantity;

    return {
      subtotal,
      discount,
      shipping,
      total,
      quantity
    };
  }, [productOptions.selectedOption]);

  // Main pricing details selector
  const pricingDetails = useMemo((): PricingDetails => {
    return hasBundles ? calculateBundlePricing : calculateDirectPricing;
  }, [hasBundles, calculateBundlePricing, calculateDirectPricing]);

  // Enhanced Bundle Line Items Generation
  const createBundleLineItems = (): LineItem[] => {
    if (!bundle.selectedOffer) return [];

    const offer = bundle.selectedOffer;
    const items: LineItem[] = [];

    // Main bundle line item
    const bundleMainItem: LineItem = {
      description: offer.title,
      sku: `BUNDLE-${offer || 'PKG'}`,
      quantity: bundle.quantity,
      unitPrice: offer.final_total / bundle.quantity,
      discountAmount: offer.discount,
      total: offer.final_total,
      type: 'bundle-main'
    };
    items.push(bundleMainItem);

    // Individual bundle items with their SKUs from customOptions
    if (hasVariants && customOptions.length > 0) {
      const individualItems = customOptions.map(option => ({
        description: `${offer.title} - ${getTranslation('modal.item', currentLang)} ${option.bundleIndex}`,
        sku: getDisplaySKU(option, `BUNDLE-ITEM-${option.bundleIndex}`),
        quantity: 1,
        unitPrice: offer.price_per_item,
        discountAmount: 0,
        total: offer.price_per_item,
        variants: [option.firstOption, option.secondOption].filter(Boolean),
        type: 'bundle-item' as const,
        parentBundle: offer?.toString()
      }));
      items.push(...individualItems);
    }

    return items;
  };

  // Enhanced Direct Purchase Line Items Generation
  const createDirectLineItems = (): LineItem[] => {
    if (!productOptions.selectedOption) return [];

    const option = productOptions.selectedOption;
    const productName = isArabic ? product.name_ar : product.name_en;
    const quantity = option.qty || 1;
    const unitPrice = option.price || 0;
    const unitDiscountPrice = option.price_after_discount || unitPrice;
    const discountAmount = (unitPrice - unitDiscountPrice) * quantity;
    const total = unitDiscountPrice * quantity;

    return [{
      description: productName,
      sku: getDisplaySKU(option, product.sku_code),
      quantity,
      unitPrice,
      discountAmount,
      total,
      variants: [option.firstOption, option.secondOption].filter(Boolean),
      type: 'direct-purchase'
    }];
  };

  // Main line items generator
  const createLineItems = (): LineItem[] => {
    return hasBundles ? createBundleLineItems() : createDirectLineItems();
  };

  // Validation functions
  const validatePricing = (pricing: PricingDetails): boolean => {
    const requiredFields: (keyof PricingDetails)[] = ['subtotal', 'total'];
    return requiredFields.every(field => 
      typeof pricing[field] === 'number' && 
      pricing[field] >= 0
    );
  };

  // Enhanced Invoice Data Generation
  const getInvoiceData = () => {
    const pricing = pricingDetails;
    
    if (!validatePricing(pricing)) {
      console.error('Invalid pricing data:', pricing);
      return null;
    }

    if (hasBundles) {
      return {
        type: 'bundle',
        mainItem: bundle.selectedOffer,
        bundleItems: customOptions,
        pricing,
        lineItems: createBundleLineItems()
      };
    } else {
      return {
        type: 'direct',
        item: productOptions.selectedOption,
        pricing,
        lineItems: createDirectLineItems()
      };
    }
  };

  // Handle order confirmation
  const handleOrderConfirm = async () => {
    setIsProcessing(true);
    
    try {
      // Get comprehensive invoice data for processing
      const invoiceData = getInvoiceData();
      if (!invoiceData) {
        throw new Error('Invalid invoice data');
      }

      // Simulate API call with invoice data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newOrderNumber = '#' + Math.floor(Math.random() * 900000 + 100000);
      setOrderNumber(newOrderNumber);
      setCurrentView('celebration');
    } catch (error) {
      console.error('Order confirmation failed:', error);
      // Handle error appropriately
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
                          {/* Enhanced Type Display */}
                          <div className="classic-product-type">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              hasBundles ? 'classic-type-bundle' : 'classic-type-direct'
                            }`}>
                              {hasBundles 
                                ? 'Bundle Product'
                                : 'Direct Product'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Line Items Table */}
                <div className="classic-line-items-section">
                  <h3 className="classic-section-title text-lg font-bold mb-4 flex items-center justify-between">
                    <span>{getTranslation('modal.itemsCount', currentLang)}</span>
                    <span className="text-sm font-normal opacity-75">
                      {lineItems.length} Items
                    </span>
                  </h3>
                  
                  <div className="classic-line-items-table rounded-lg overflow-hidden">
                    {/* Enhanced Table Header */}
                    <div className="classic-table-header grid grid-cols-12 gap-4 p-4 text-sm font-bold">
                      <div className="col-span-4">Item Description</div>
                      <div className="col-span-2 text-center">SKU</div>
                      <div className="col-span-1 text-center">Qty</div>
                      <div className="col-span-2 text-right">Unit Price</div>
                      <div className="col-span-2 text-right">{getTranslation('modal.discount', currentLang)}</div>
                      <div className="col-span-1 text-right">Total</div>
                    </div>
                    
                    {/* Enhanced Table Body */}
                    <div className="classic-table-body">
                      {lineItems.map((item, index) => (
                        <div key={index} className={`classic-line-item-row grid grid-cols-12 gap-4 p-4 border-t ${
                          item.type === 'bundle-main' ? 'classic-bundle-main-row' : 
                          item.type === 'bundle-item' ? 'classic-bundle-item-row' : 
                          'classic-direct-row'
                        }`}>
                          {/* Item Description */}
                          <div className="col-span-4">
                            <div className="classic-line-item-description">
                              <div className="font-medium mb-1 flex items-center gap-2">
                                {item.type === 'bundle-main' && (
                                  <span className="classic-bundle-main-badge px-2 py-1 rounded text-xs font-bold">
                                    Bundle Main
                                  </span>
                                )}
                                {item.type === 'bundle-item' && (
                                  <span className="classic-bundle-item-badge px-2 py-1 rounded text-xs">
                                    Bundle Item
                                  </span>
                                )}
                                <span>{item.description}</span>
                              </div>
                              {item.variants && item.variants.length > 0 && (
                                <div className="flex gap-2 flex-wrap mt-2">
                                  {item.variants.map((variant, idx) => (
                                    <span key={idx} className="classic-variant-tag px-2 py-1 rounded-full text-xs">
                                      {variant}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* SKU */}
                          <div className="col-span-2 text-center">
                            <span className="classic-sku-display text-xs font-mono px-2 py-1 rounded">
                              {item.sku}
                            </span>
                          </div>
                          
                          {/* Quantity */}
                          <div className="col-span-1 text-center">
                            <span className="classic-line-item-quantity px-3 py-1 rounded-lg text-sm font-bold">
                              {item.quantity}
                            </span>
                          </div>
                          
                          {/* Unit Price */}
                          <div className="col-span-2 text-right">
                            <div className="classic-line-item-price font-medium">
                              ${item.unitPrice.toFixed(2)}
                            </div>
                          </div>
                          
                          {/* Discount */}
                          <div className="col-span-2 text-right">
                            <div className="classic-line-item-discount font-medium">
                              {item.discountAmount > 0 ? `-$${item.discountAmount.toFixed(2)}` : '$0.00'}
                            </div>
                          </div>
                          
                          {/* Total */}
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

                {/* Enhanced Custom Options Section - Only for Bundle Items */}
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
                          <div className="classic-option-header text-sm font-bold mb-3 flex items-center justify-between">
                            <span>{getTranslation('modal.item', currentLang)} {option.bundleIndex}</span>
                            <span className="classic-option-sku text-xs font-mono opacity-75">
                              SKU: {getDisplaySKU(option, `ITEM-${option.bundleIndex}`)}
                            </span>
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

                {/* Enhanced Payment Summary Section */}
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
                      
                      {/* Enhanced Bundle-specific Information */}
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
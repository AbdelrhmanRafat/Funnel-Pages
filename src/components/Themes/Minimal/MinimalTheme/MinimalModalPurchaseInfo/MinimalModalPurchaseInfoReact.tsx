import "./MinimalModalPurchaseInfo.css";
import React, { useState, useEffect, useMemo } from 'react';
import type { Language } from "../../../../../lib/utils/i18n/translations";
import { useBundleStore } from '../../../../../lib/stores/bundleStore';
import { useCustomOptionBundleStore } from '../../../../../lib/stores/customOptionBundleStore';
import { useFormStore } from '../../../../../lib/stores/formStore';
import { usePaymentStore } from '../../../../../lib/stores/paymentStore';
import { useDeliveryStore } from '../../../../../lib/stores/deliveryStore';
import { useProductStore } from "../../../../../lib/stores/customOptionsNonBundleStore";
import type { Product } from "../../../../../lib/api/types";

// Import components
import InvoiceHeader from './Components/InvoiceHeader/InvoiceHeader';
import ProductDetailsSection from './Components/ProductDetailsSection/ProductDetailsSection';
import DirectProductItemDetails from './Components/DirectProductItemDetails/DirectProductItemDetails';
import BundleOptionsSection from './Components/BundleOptionsSection/BundleOptionsSection';
import BillingSection from './Components/BillingSection/BillingSection';
import PaymentSummarySection from './Components/PaymentSummarySection/PaymentSummarySection';
import InvoiceActions from './Components/InvoiceActions/InvoiceActions';
import CelebrationView from './Components/CelebrationView/CelebrationView';

interface MinimalModalPurchaseInfoReactProps {
  product: Product;
  isArabic: boolean;
  currentLang: Language;
  hasVariants: boolean;
  hasBundles: boolean;
  isOpen: boolean;
  onClose: () => void;
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

const MinimalModalPurchaseInfoReact: React.FC<MinimalModalPurchaseInfoReactProps> = ({
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
  

  // Enhanced SKU management
  const getDisplaySKU = (item: any, fallback: string): string => {
    return item?.sku_id?.toString() || fallback || `TEMP-${Date.now()}`;
  };

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
        pricing
      };
    } else {
      return {
        type: 'direct',
        item: productOptions.selectedOption,
        pricing
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

  return (
    <div 
      className="fixed inset-0 z-[1000] flex justify-center items-center transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-title"
    >
      {/* Overlay */}
      <div 
        className="minimal-modal-div-overlay absolute inset-0 z-[1001] transition-opacity duration-300" 
        onClick={handleClose}
        aria-hidden="true"
      />
      
      {/* Invoice Container */}
      <div className="relative container md:w-10/12 lg:w-8/12 xl:w-6/12 max-h-[95vh] overflow-y-auto z-[1002] m-4 transition-all duration-300 transform">
        <div className="minimal-modal-div-invoice rounded-xl">
          
          {/* Purchase Invoice View */}
          {currentView === 'purchase' && (
            <div className="w-full">
              <InvoiceHeader 
                currentLang={currentLang}
                invoiceNumber={invoiceNumber}
                invoiceDate={invoiceDate}
              />

              <div className="p-6 md:p-8 space-y-8">
                <ProductDetailsSection 
                  product={product}
                  isArabic={isArabic}
                  currentLang={currentLang}
                />
                
                {/* Direct Product Details - Only for non-bundle purchases */}
                {hasBundles === false && productOptions.selectedOption && (
                  <DirectProductItemDetails 
                    product={product}
                    selectedOption={productOptions.selectedOption}
                    currentLang={currentLang}
                    isArabic={isArabic}
                  />
                )}

                <BundleOptionsSection 
                  hasVariants={hasVariants}
                  hasBundles={hasBundles}
                  customOptions={customOptions}
                  currentLang={currentLang}
                  getDisplaySKU={getDisplaySKU}
                  
                />

                <BillingSection 
                  form={form}
                  delivery={delivery}
                  payment={payment}
                  currentLang={currentLang}
                />

                <PaymentSummarySection 
                  pricingDetails={pricingDetails}
                  hasBundles={hasBundles}
                  currentLang={currentLang}
                />

                <InvoiceActions 
                  isProcessing={isProcessing}
                  onConfirm={handleOrderConfirm}
                  onCancel={handleClose}
                  isArabic={isArabic}
                  currentLang={currentLang}
                />
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

export default MinimalModalPurchaseInfoReact;
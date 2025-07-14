import React from 'react';
import { useProductHeaderState } from './hooks/useProductHeaderState';
import type { Product, BlockData } from '../../../../../lib/api/types';
import { getTranslation, type Language } from '../../../../../lib/utils/i18n/translations';
import MinimalThemeRatesReact from '../MinimalThemeRates/MinimalThemeRatesReact';

interface MinimalProductHeaderReactProps {
  product: Product;
  purchaseOptions: BlockData | null;
  isHaveVariant: string;
  currentLang: Language;
  ratingData?: BlockData;
}

const MinimalProductHeaderReact: React.FC<MinimalProductHeaderReactProps> = ({
  product,
  purchaseOptions,
  isHaveVariant,
  currentLang,
  ratingData,
}) => {
  // Get reactive state from custom hook (replaces entire Observer pattern)
  const headerState = useProductHeaderState({
    product,
    purchaseOptions,
    isHaveVariant,
  });

  const isArabic = currentLang === 'ar';
  
  // Replaces conditional SKU display logic from original Astro component
  const showSku = !purchaseOptions || isHaveVariant === "false";

  return (
    <div className="w-full flex flex-col justify-start items-start gap-2">
      {/* Availability Badge + SKU Row */}
      <div className="flex items-center gap-2">
        {/* Product Availability Badge */}
        <span
          className={`${
            product.is_active
              ? "minimal-product-details-badge-success text-xs py-1 px-3 rounded-full font-medium"
              : "minimal-product-details-badge-error text-xs py-1 px-3 rounded-full font-medium"
          }`}
          data-translate={
            product.is_active
              ? "product.available"
              : "product.notAvailable"
          }
        >
          {product.is_active
            ? getTranslation("product.available", currentLang)
            : getTranslation("product.notAvailable", currentLang)}
        </span>
        
        {/* SKU Display - Reactive to store changes */}
        {showSku && (
          <div className="minimal-product-details-sku text-sm">
            <span data-translate="product.productCode">
              {getTranslation("product.productCode", currentLang)}
            </span>
            <span>: <span data-product-sku>{headerState.currentSku}</span></span>
          </div>
        )}
      </div>

      {/* Product Title + Rating Row */}
      <div className="w-full flex justify-start items-center gap-4">
        <h2 className="minimal-product-details-title text-3xl lg:text-4xl font-bold leading-tight">
          {isArabic ? product.name_ar : product.name_en}
        </h2>
        {ratingData && (
          <MinimalThemeRatesReact 
            ratingData={ratingData} 
            currentLang={currentLang} 
          />
        )}
      </div>

      {/* Pricing Display - Reactive to store changes */}
      <div className="flex justify-start items-center gap-4">
        {/* Original Price (strikethrough) */}
        <div className="minimal-product-details-price minimal-product-details-price--discount flex justify-center line-through items-center gap-2 text-4xl font-bold">
          <span data-product-price>{headerState.currentPrice}</span>
        </div>
        
        {/* Discounted Price */}
        <div className="minimal-product-details-price flex justify-center items-center gap-2 text-4xl font-bold">
          <span data-product-price-discount>{headerState.currentPriceAfterDiscount}</span>
          <span data-translate="productFunnel.currency">
            {getTranslation("productFunnel.currency", currentLang)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MinimalProductHeaderReact;
import React from 'react';
import { getTranslation, type Language } from "../../../../../../../lib/utils/i18n/translations";
import type { Product } from "../../../../../../../lib/api/types";
import './ProductDetailsSection.css';

interface ProductDetailsSectionProps {
  product: Product;
  isArabic: boolean;
  currentLang: Language;
  hasBundles: boolean;
}

const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({
  product,
  isArabic,
  currentLang,
  hasBundles,
}) => {
  return (
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
  );
};

export default ProductDetailsSection;
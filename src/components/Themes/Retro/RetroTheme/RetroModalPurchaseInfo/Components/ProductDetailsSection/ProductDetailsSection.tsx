import React from 'react';
import { getTranslation, type Language } from "../../../../../../../lib/utils/i18n/translations";
import type { Product } from "../../../../../../../lib/api/types";
import './ProductDetailsSection.css';

interface ProductDetailsSectionProps {
  product: Product;
  isArabic: boolean;
  currentLang: Language;
}

const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({
  product,
  isArabic,
  currentLang,
}) => {
  return (
    <div className="retro-productdetails-div-container">
      <h2 className="retro-productdetails-h2-title text-xl md:text-2xl font-bold mb-4 md:mb-6 pb-2 border-b-2 flex items-center gap-3">
        <div className="retro-productdetails-div-icon p-2 rounded-lg">
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        {getTranslation('modal.orderSummary', currentLang)}
      </h2>

      <div className="retro-productdetails-div-card rounded-lg border border-l-4 p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Product Image */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            <div className="aspect-square w-full max-w-sm mx-auto md:max-w-none">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-lg">
                <img
                  src={product.image || '/placeholder-product.jpg'}
                  alt={isArabic ? product.name_ar : product.name_en}
                  className="w-full h-full object-fill transition-transform duration-300 ease-in-out hover:scale-105"
                  loading="lazy"
                />
              </div>

            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-4">
            <h3 className="retro-productdetails-h3-name text-lg md:text-xl lg:text-2xl font-bold leading-tight">
              {isArabic ? product.name_ar : product.name_en}
            </h3>
            {(product.description_ar || product.description_en) && (
              <p
                className="retro-productdetails-p-description text-sm md:text-base leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: isArabic ? product.description_ar : product.description_en,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSection;
import React from 'react';
import { getTranslation, type Language } from "../../../../../../../lib/utils/i18n/translations";
import './DirectProductItemDetails.css';

interface ProductOption {
  qty?: number;
  price?: number;
  price_after_discount?: number;
  image?: string;
  firstOption?: string;
  secondOption?: string;
  sku_id?: string;
}

interface Product {
  name_ar: string;
  name_en: string;
  sku_code: string;
  image?: string;
}

interface DirectProductItemDetailsProps {
  product: Product;
  selectedOption: ProductOption;
  currentLang: Language;
  isArabic: boolean;
}

const DirectProductItemDetails: React.FC<DirectProductItemDetailsProps> = ({
  product,
  selectedOption,
  currentLang,
  isArabic,
}) => {
  // Extract product data
  const productName = isArabic ? product.name_ar : product.name_en;
  const productImage = selectedOption.image || product.image || '/placeholder-product.jpg';
  const sku = selectedOption.sku_id?.toString() || product.sku_code || 'N/A';
  
  // Extract pricing data
  const quantity = selectedOption.qty || 1;
  const unitPrice = selectedOption.price || 0;
  const unitDiscountPrice = selectedOption.price_after_discount || unitPrice;
  const discountAmount = (unitPrice - unitDiscountPrice) * quantity;
  const total = unitDiscountPrice * quantity;
  
  // Extract variants
  const variants = [selectedOption.firstOption, selectedOption.secondOption].filter(Boolean);

  return (
    <div className="classic-directproduct-div-container">
      
      <div className="classic-directproduct-div-card rounded-lg border border-l-4 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          
          {/* Product Image - 1/3 */}
          <div className="md:col-span-1 flex justify-center md:justify-start">
            <div className="w-32 h-32 md:w-full md:h-40 lg:h-48">
              <img 
                src={productImage} 
                alt={productName}
                className="classic-directproduct-img-product w-full h-full object-cover rounded-lg border"
                loading="lazy"
              />
            </div>
          </div>
          
          {/* Product Details - 1/3 */}
          <div className="md:col-span-1 space-y-3 md:space-y-4">
            {/* Product Name */}
            <div>
              <h4 className="classic-directproduct-h4-name text-base md:text-lg lg:text-xl font-semibold leading-tight mb-2">
                {productName}
              </h4>
              <p className="classic-directproduct-p-sku text-xs md:text-sm font-mono px-2 py-1 rounded w-fit">
                SKU: {sku}
              </p>
            </div>
            
            {/* Product Variants */}
            {variants.length > 0 && (
              <div>
                <span className="classic-directproduct-span-variantlabel text-xs md:text-sm font-medium block mb-2">
                  {getTranslation('modal.productOptions', currentLang) || 'Selected Options'}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant, idx) => (
                    <span 
                      key={idx} 
                      className="classic-directproduct-span-variant px-3 py-1 rounded-full text-xs md:text-sm border font-medium"
                    >
                      {variant}
                    </span>
                  ))}
                </div>
              </div>
            )}
          
          </div>
          
          {/* Pricing Summary - 1/3 */}
          <div className="md:col-span-1">
            <div className="classic-directproduct-div-pricing p-4 rounded-lg border space-y-3">
              <h5 className="classic-directproduct-h5-pricingtitle text-sm md:text-base font-semibold mb-3">
                {getTranslation('modal.pricePerItem', currentLang) || 'Pricing Details'}
              </h5>
              
              {/* Quantity */}
              <div className="flex justify-between items-center">
                <span className="classic-directproduct-span-label text-sm">
                  {getTranslation('modal.quantity', currentLang) || 'Quantity'}:
                </span>
                <span className="classic-directproduct-span-quantity px-3 py-1 rounded-lg text-sm font-bold">
                  {quantity}
                </span>
              </div>
              
              {/* Unit Price */}
              <div className="flex justify-between items-center">
                <span className="classic-directproduct-span-label text-sm">
                  {getTranslation('modal.unitPrice', currentLang) || 'Unit Price'}:
                </span>
                <span className="classic-directproduct-span-unitprice text-sm md:text-base font-medium">
                  ${unitPrice.toFixed(2)}
                </span>
              </div>
              
              {/* Discount (if any) */}
              {discountAmount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="classic-directproduct-span-label text-sm">
                    {getTranslation('modal.discount', currentLang) || 'Discount'}:
                  </span>
                  <span className="classic-directproduct-span-discount text-sm md:text-base font-medium">
                    -${discountAmount.toFixed(2)}
                  </span>
                </div>
              )}
              
              {/* Divider */}
              <div className="classic-directproduct-div-divider h-px my-3"></div>
              
              {/* Total */}
              <div className="flex justify-between items-center pt-2">
                <span className="classic-directproduct-span-label text-base md:text-lg font-semibold">
                  {getTranslation('modal.total', currentLang) || 'Total'}:
                </span>
                <span className="classic-directproduct-span-total text-lg md:text-xl lg:text-2xl font-bold">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectProductItemDetails;
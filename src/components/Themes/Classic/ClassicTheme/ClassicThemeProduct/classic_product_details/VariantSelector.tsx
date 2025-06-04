import React, { useId, useRef, useEffect } from 'react';
import DirectColorPicker from './DirectColorPicker';
import ColorPicker from './ColorPicker';
import SizePicker from './SizePicker';

interface Variant {
  id?: number | string;
  name?: string;
  display?: string;
  value?: string;
  hex?: string;
}

interface VariantOption {
  size?: Variant;
  color?: Variant;
  __index?: number; // Track which variant slot this is
  __uniqueKey?: string; // Unique timestamp to track state changes
  [key: string]: Variant | number | string | undefined;
}

interface ProductOption {
  name: string;
  value: Variant[];
}

interface VariantSelectorProps {
  index: number;
  variant: VariantOption;
  productOptions: ProductOption[] | undefined;
  onSelect: (index: number, variant: VariantOption) => void;
  isArabic: boolean;
  t: (key: string) => string;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  index,
  variant,
  productOptions,
  onSelect,
  isArabic,
  t
}) => {
  // Check if we have size or color options
  const hasSizeOption = productOptions && productOptions.some(opt => opt.name === 'size');
  const hasColorOption = productOptions && productOptions.some(opt => opt.name === 'color');
  
  if (!hasSizeOption && !hasColorOption) return null;
  
  // Get the size options if available
  const sizeOptions = productOptions
    ?.find(opt => opt.name === 'size')
    ?.value || [];
  
  // Get the color options if available
  const colorOptions = productOptions
    ?.find(opt => opt.name === 'color')
    ?.value || [];
  
  // Create a component instance ID to ensure uniqueness
  const instanceId = useId();
  
  // Create references to our picker containers
  const variantContainerRef = useRef<HTMLDivElement>(null);
  
  // Log variant changes to help with debugging
  useEffect(() => {
    console.log('VariantSelector receiving variant:', variant);
  }, [variant]);

  // Let's use a simpler approach with React state rather than direct DOM manipulation
  // React will handle the UI updates for us through the selectedColor prop being passed to ColorPicker
  
  // Handle size selection with extra metadata to ensure uniqueness
  const handleSizeSelect = (size: Variant) => {
    onSelect(index, { 
      ...variant, 
      size, 
      __index: index,
      __uniqueKey: `size-${index}-${Date.now()}-${Math.random()}`
    });
  };
  
  // Handle color selection with extra metadata to ensure uniqueness
  const handleColorSelect = (color: Variant) => {
    onSelect(index, { 
      ...variant, 
      color, 
      __index: index,
      __uniqueKey: `color-${index}-${Date.now()}-${Math.random()}`
    });
  };
  
  return (
    <div ref={variantContainerRef} className="mb-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
      <div className="flex justify-between items-center mb-3">
        <p className="font-medium text-sm text-blue-700">
          {t ? t('select_options_for_item').replace('{index}', String(index + 1)) : (isArabic ? `اختر الخيارات للمنتج ${index + 1}` : `Select options for item ${index + 1}`)}
        </p>
        
        {/* Show what's selected */}
        <div className="flex items-center gap-2">
          {variant?.size && variant.size !== null && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">
              {variant.size.display || variant.size.value}
            </span>
          )}
          {variant?.color && variant.color !== null && (
            <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: variant.color.hex || '#000000' }}></span>
              {variant.color.name}
            </span>
          )}
        </div>
      </div>
      
      {/* Use the dedicated size picker component with a unique key */}
      {hasSizeOption && sizeOptions.length > 0 && (
        <SizePicker
          key={`size-${instanceId}-${index}`}
          sizes={sizeOptions}
          selectedSize={variant?.size || null}
          itemIndex={index}
          onSelectSize={handleSizeSelect}
          isArabic={isArabic}
          t={t}
        />
      )}
      
      {/* Use the completely new DirectColorPicker component with a unique key */}
      {hasColorOption && colorOptions.length > 0 && (
        <DirectColorPicker
          key={`color-${instanceId}-${index}`}
          colors={colorOptions}
          selectedColor={variant?.color || null}
          itemIndex={index}
          onSelectColor={handleColorSelect}
          isArabic={isArabic}
          t={t}
        />
      )}
    </div>
  );
};

export default VariantSelector;
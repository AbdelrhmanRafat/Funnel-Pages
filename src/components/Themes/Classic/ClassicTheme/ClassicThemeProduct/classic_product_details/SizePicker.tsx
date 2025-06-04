import React, { useState } from 'react';

interface Variant {
  id?: number | string;
  name?: string;
  display?: string;
  value?: string;
  hex?: string;
}

interface SizePickerProps {
  sizes: Variant[];
  selectedSize: Variant | null;
  itemIndex: number;
  onSelectSize: (size: Variant) => void;
  isArabic: boolean;
  t?: (key: string) => string;
}

const SizePicker = ({
  sizes,
  selectedSize,
  itemIndex,
  onSelectSize,
  isArabic,
  t
}: SizePickerProps): JSX.Element => {
  // Create a local state to track which size is selected for this specific picker
  // This way, we manage the UI selection state independently from the parent component
  const [localSelectedValue, setLocalSelectedValue] = useState<string | null>(
    selectedSize?.value || null
  );

  // When parent component updates selectedSize, we need to sync our local state
  React.useEffect(() => {
    if (selectedSize?.value) {
      setLocalSelectedValue(selectedSize.value);
    }
  }, [selectedSize]);

  // Handle local selection changes
  const handleSizeSelect = (size: Variant) => {
    // Update local UI state
    setLocalSelectedValue(size.value || null);
    // Notify parent component
    onSelectSize(size);
  };

  // Generate a unique ID for this specific size picker to avoid conflicts
  const uniqueId = `size-picker-${itemIndex}-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className="mb-3">
      <h3 className="text-sm text-gray-600 mb-2">{t ? t('size') : ''}</h3>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size, idx) => {
          // Check if this specific size is selected based on our local state
          const isSelected = size.value === localSelectedValue;
          
          return (
            <div key={`${uniqueId}-size-${idx}`}>
              <button
                type="button"
                onClick={() => handleSizeSelect(size)}
                aria-label={`Select size ${size.display || size.value}`}
                aria-pressed={isSelected}
                className={`size-button px-3 py-1 min-w-[40px] text-sm border rounded-md transition-all ${isSelected ? 'border-blue-500 bg-blue-100 text-blue-700 font-bold shadow-sm' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700'}`}
              >
                {size.display || size.value}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SizePicker;
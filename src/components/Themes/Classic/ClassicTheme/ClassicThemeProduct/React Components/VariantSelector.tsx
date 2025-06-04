import React from 'react';

interface Variant {
  id: number;
  name: string;
  display?: string;
  value?: string;
  hex?: string;
}

interface ProductOption {
  name: string;
  value: Variant[];
}

interface VariantSelectorProps {
  options: ProductOption[];
  selectedVariant: { id: number; name: string } | null;
  onSelectVariant: (variant: { id: number; name: string } | null) => void;
  isArabic: boolean;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  options,
  selectedVariant,
  onSelectVariant,
  isArabic
}) => {
  if (!options || options.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {options.map((option, index) => (
        <div key={index} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {option.name}
          </label>
          <div className="flex flex-wrap gap-2">
            {option.value.map((variant) => (
              <button
                key={variant.id}
                onClick={() => onSelectVariant({ id: variant.id, name: variant.name })}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedVariant?.id === variant.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={
                  variant.hex
                    ? {
                        backgroundColor: variant.hex,
                        color: getContrastColor(variant.hex)
                      }
                    : undefined
                }
              >
                {variant.display || variant.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function to determine text color based on background color
function getContrastColor(hexColor: string): string {
  // Remove the # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export default VariantSelector;
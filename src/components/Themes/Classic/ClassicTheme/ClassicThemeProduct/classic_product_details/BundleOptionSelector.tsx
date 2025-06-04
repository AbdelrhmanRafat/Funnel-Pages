import React from 'react';

interface BundleOption {
  id: number | string;
  name: string;
  description?: string;
  quantity: number;
  price_per_item: number;
  original_price_per_item?: number;
  discount?: number;
  discount_percent?: number | string;
  shipping_price?: number;
  final_total?: number;
  is_popular?: boolean;
  estimated_delivery?: string;
}

interface BundleOptionSelectorProps {
  options: BundleOption[];
  selectedOptionId: number | string | null;
  onSelectOption: (option: BundleOption) => void;
  formatCurrency: (amount: number | undefined) => string;
  isArabic: boolean;
  t?: (key: string) => string;
}

const BundleOptionSelector: React.FC<BundleOptionSelectorProps> = ({
  options,
  selectedOptionId, 
  onSelectOption,
  formatCurrency,
  isArabic,
  t
}) => {
  // Ensure options have stable IDs based on their index if not provided
  const optionsWithStableIds = React.useMemo(() => {
    return options.map((option, index) => {
      // If the option already has a stable ID (like an integer), keep it
      // Otherwise assign a stable string ID based on index
      if (typeof option.id === 'number' && option.id % 1 === 0) {
        return option;
      }
      return {
        ...option,
        id: `bundle-${index}`
      };
    });
  }, [options]);

  if (!optionsWithStableIds || optionsWithStableIds.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-gray-500 italic">
        {t ? t('no_purchase_options') : (isArabic ? 'خيارات الشراء غير متوفرة حالياً' : 'Purchase options not available')}
      </div>
    );
  }

  return (
    <div className="space-y-3 mb-4">
      {optionsWithStableIds.map((option) => (
        <div 
          key={option.id}
          onClick={() => onSelectOption(option)}
          className={`relative cursor-pointer transition-all duration-200 border-2 rounded-lg overflow-hidden hover:shadow-md hover:border-blue-300 ${selectedOptionId === option.id ? 'border-blue-500 bg-blue-50/50 shadow-md' : 'border-gray-200 bg-white'}`}
        >
          {/* Best Value tag for popular options */}
          {option.is_popular && (
            <div className="absolute top-0 right-0">
              <div className="bg-blue-600 text-white text-xs px-3 py-1 font-semibold shadow-sm translate-x-2 -translate-y-0.5 transform rotate-12">
                {t ? t('best_value') : (isArabic ? 'أفضل قيمة' : 'BEST VALUE')}
              </div>
            </div>
          )}
          
          <div className="p-4 flex items-center">
            {/* Radio button indicator */}
            <div className={`h-6 w-6 rounded-full border flex-shrink-0 flex items-center justify-center ${selectedOptionId === option.id ? 'border-blue-600' : 'border-gray-300'}`}>
              {selectedOptionId === option.id && <div className="w-3 h-3 rounded-full bg-blue-600"></div>}
            </div>
            
            {/* Option content */}
            <div className="ml-3 flex-grow">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  <span className="mr-1">🛍️</span>
                  {option.name} 
                  <span className="text-sm text-gray-500">({option.quantity} {option.quantity > 1 ? (t ? t('pieces') : (isArabic ? 'قطع' : 'pieces')) : (t ? t('piece') : (isArabic ? 'قطعة' : 'piece'))})</span>
                </div>
                <div className="font-bold text-blue-700">
                  {formatCurrency(option.price_per_item)}
                  <span className="text-xs block text-gray-500 font-normal text-right">{t ? t('per_item') : (isArabic ? 'للقطعة' : 'per item')}</span>
                </div>
              </div>
              
              {/* Discount info */}
              {option.discount !== undefined && option.discount > 0 && (
                <div className="mt-1 flex justify-between text-sm">
                  <div className="flex items-center text-green-600">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <span>{isArabic ? 'توفير' : 'Save'} {formatCurrency(option.discount)}</span>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">
                    {option.discount_percent}% {isArabic ? 'خصم' : 'OFF'}
                  </span>
                </div>
              )}
              
              {/* Delivery estimate */}
              <div className="mt-2 text-xs text-gray-500 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {option.estimated_delivery}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BundleOptionSelector;
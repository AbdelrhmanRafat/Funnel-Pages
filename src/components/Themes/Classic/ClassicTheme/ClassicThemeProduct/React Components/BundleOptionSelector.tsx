import React from 'react';
import type { PurchaseOption } from '../../../../../../lib/validate';

interface BundleOptionSelectorProps {
  options: PurchaseOption[];
  selectedOptionId: number | null;
  onSelectOption: (option: PurchaseOption) => void;
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
  if (!options || options.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-gray-500 italic">
        {t ? t('no_purchase_options') : (isArabic ? 'خيارات الشراء غير متوفرة حالياً' : 'Purchase options not available')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        {t ? t('purchase_options') : (isArabic ? 'خيارات الشراء' : 'Purchase Options')}
      </h3>
      <div className="space-y-3">
        {options.map((option) => (
          <div 
            key={option.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedOptionId === option.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => onSelectOption(option)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-grow">
                <h4 className="font-medium">{option.name}</h4>
                <p className="text-sm text-gray-600">{option.description}</p>
                <div className="mt-2 text-sm">
                  <span className="text-gray-600">
                    {t ? t('quantity') : (isArabic ? 'الكمية' : 'Quantity')}: {option.quantity}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-600">
                  {formatCurrency(option.price_per_item)}
                </div>
                {option.original_price_per_item > option.price_per_item && (
                  <div className="text-sm text-gray-500 line-through">
                    {formatCurrency(option.original_price_per_item)}
                  </div>
                )}
                {option.discount > 0 && (
                  <div className="text-sm text-green-600">
                    {t ? t('save') : (isArabic ? 'وفر' : 'Save')} {option.discount_percent}%
                  </div>
                )}
              </div>
            </div>
            {option.is_popular && (
              <div className="mt-2">
                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                  {t ? t('most_popular') : (isArabic ? 'الأكثر شعبية' : 'Most Popular')}
                </span>
              </div>
            )}
            {option.estimated_delivery && (
              <div className="mt-2 text-sm text-gray-600">
                {t ? t('estimated_delivery') : (isArabic ? 'موعد التسليم المتوقع' : 'Estimated Delivery')}: {option.estimated_delivery}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BundleOptionSelector;
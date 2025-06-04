import React from 'react';
import type { PurchaseOption } from '../../../../../../lib/validate';

interface OptionSummaryProps {
  selectedOption: PurchaseOption;
  formatCurrency: (amount: number | undefined) => string;
  isArabic: boolean;
}

const OptionSummary: React.FC<OptionSummaryProps> = ({
  selectedOption,
  formatCurrency,
  isArabic
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">
        {isArabic ? 'ملخص الطلب' : 'Order Summary'}
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>{isArabic ? 'المنتج' : 'Product'}</span>
          <span>{selectedOption.name}</span>
        </div>
        <div className="flex justify-between">
          <span>{isArabic ? 'الكمية' : 'Quantity'}</span>
          <span>{selectedOption.quantity}</span>
        </div>
        <div className="flex justify-between">
          <span>{isArabic ? 'السعر للقطعة' : 'Price per item'}</span>
          <span>{formatCurrency(selectedOption.price_per_item)}</span>
        </div>
        {selectedOption.original_price_per_item > selectedOption.price_per_item && (
          <div className="flex justify-between text-gray-500">
            <span>{isArabic ? 'السعر الأصلي' : 'Original price'}</span>
            <span className="line-through">{formatCurrency(selectedOption.original_price_per_item)}</span>
          </div>
        )}
        {selectedOption.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>{isArabic ? 'الخصم' : 'Discount'}</span>
            <span>-{formatCurrency(selectedOption.discount)} ({selectedOption.discount_percent}%)</span>
          </div>
        )}
        {selectedOption.shipping_price > 0 && (
          <div className="flex justify-between">
            <span>{isArabic ? 'الشحن' : 'Shipping'}</span>
            <span>{formatCurrency(selectedOption.shipping_price)}</span>
          </div>
        )}
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold">
            <span>{isArabic ? 'المجموع النهائي' : 'Final Total'}</span>
            <span>{formatCurrency(selectedOption.final_total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionSummary;
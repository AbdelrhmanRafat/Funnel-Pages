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

interface OptionSummaryProps {
  selectedOption: BundleOption;
  formatCurrency: (amount: number | undefined) => string;
  isArabic: boolean;
}

const OptionSummary: React.FC<OptionSummaryProps> = ({ 
  selectedOption, 
  formatCurrency, 
  isArabic 
}) => {
  if (!selectedOption) return null;
  
  return (
    <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
      <div className={`flex ${isArabic ? 'flex-row-reverse' : 'flex-row'} justify-between text-sm`}>
        <span className="text-gray-600">{isArabic ? 'المنتج:' : 'Product:'}:</span>
        <span className={`font-medium ${isArabic ? 'text-right' : 'text-left'}`}>
          {selectedOption.quantity} {selectedOption.description}
        </span>
      </div>
      
      <div className={`flex ${isArabic ? 'flex-row-reverse' : 'flex-row'} justify-between text-sm mt-1`}>
        <span className="text-gray-600">{isArabic ? 'سعر القطعة:' : 'Price per item:'}:</span>
        <span className="font-medium">{formatCurrency(selectedOption.price_per_item)}</span>
      </div>
      
      <div className={`flex ${isArabic ? 'flex-row-reverse' : 'flex-row'} justify-between text-sm mt-1`}>
        <span className="text-gray-600">{isArabic ? 'المجموع' : 'Subtotal'}:</span>
        <span className="font-medium">{formatCurrency(selectedOption.price_per_item * selectedOption.quantity)}</span>
      </div>
      
      {selectedOption.shipping_price !== undefined && (
        <div className={`flex ${isArabic ? 'flex-row-reverse' : 'flex-row'} justify-between text-sm mt-1`}>
          <span className="text-gray-600">{isArabic ? 'الشحن:' : 'Shipping:'}:</span>
          <span className="font-medium">{formatCurrency(selectedOption.shipping_price)}</span>
        </div>
      )}
      
      {/* Only show discount in summary if there is one */}
      {selectedOption.discount !== undefined && selectedOption.discount > 0 && (
        <div className={`flex ${isArabic ? 'flex-row-reverse' : 'flex-row'} justify-between text-sm mt-1 text-green-600`}>
          <span>{isArabic ? 'الخصم:' : 'Discount:'}:</span>
          <span>- {formatCurrency(selectedOption.discount)}</span>
        </div>
      )}
      
      <div className="border-t border-blue-200 my-2"></div>
      <div className={`flex ${isArabic ? 'flex-row-reverse' : 'flex-row'} justify-between font-bold`}>
        <span>{isArabic ? 'الإجمالي:' : 'Total:'}:</span>
        <span className="text-blue-700">{formatCurrency(selectedOption.final_total)}</span>
      </div>
    </div>
  );
};

export default OptionSummary;
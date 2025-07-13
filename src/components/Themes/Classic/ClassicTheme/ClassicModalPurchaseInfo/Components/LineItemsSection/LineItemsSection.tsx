import React from 'react';
import { getTranslation, type Language } from "../../../../../../../lib/utils/i18n/translations";
import './LineItemsSection.css';

interface LineItem {
  description: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  total: number;
  variants?: string[];
  type: 'bundle-main' | 'bundle-item' | 'direct-purchase';
  parentBundle?: string;
}

interface LineItemsSectionProps {
  lineItems: LineItem[];
  currentLang: Language;
}

const LineItemsSection: React.FC<LineItemsSectionProps> = ({
  lineItems,
  currentLang,
}) => {
  return (
    <div className="classic-line-items-section">
      <h3 className="classic-section-title text-lg font-bold mb-4 flex items-center justify-between">
        <span>{getTranslation('modal.itemsCount', currentLang)}</span>
        <span className="text-sm font-normal opacity-75">
          {lineItems.length} Items
        </span>
      </h3>
      
      <div className="classic-line-items-table rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="classic-table-header grid grid-cols-12 gap-4 p-4 text-sm font-bold">
          <div className="col-span-4">Item Description</div>
          <div className="col-span-2 text-center">SKU</div>
          <div className="col-span-1 text-center">Qty</div>
          <div className="col-span-2 text-right">Unit Price</div>
          <div className="col-span-2 text-right">{getTranslation('modal.discount', currentLang)}</div>
          <div className="col-span-1 text-right">Total</div>
        </div>
        
        {/* Table Body */}
        <div className="classic-table-body">
          {lineItems.map((item, index) => (
            <div key={index} className={`classic-line-item-row grid grid-cols-12 gap-4 p-4 border-t ${
              item.type === 'bundle-main' ? 'classic-bundle-main-row' : 
              item.type === 'bundle-item' ? 'classic-bundle-item-row' : 
              'classic-direct-row'
            }`}>
              {/* Item Description */}
              <div className="col-span-4">
                <div className="classic-line-item-description">
                  <div className="font-medium mb-1 flex items-center gap-2">
                    {item.type === 'bundle-main' && (
                      <span className="classic-bundle-main-badge px-2 py-1 rounded text-xs font-bold">
                        Bundle Main
                      </span>
                    )}
                    {item.type === 'bundle-item' && (
                      <span className="classic-bundle-item-badge px-2 py-1 rounded text-xs">
                        Bundle Item
                      </span>
                    )}
                    <span>{item.description}</span>
                  </div>
                  {item.variants && item.variants.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {item.variants.map((variant, idx) => (
                        <span key={idx} className="classic-variant-tag px-2 py-1 rounded-full text-xs">
                          {variant}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* SKU */}
              <div className="col-span-2 text-center">
                <span className="classic-sku-display text-xs font-mono px-2 py-1 rounded">
                  {item.sku}
                </span>
              </div>
              
              {/* Quantity */}
              <div className="col-span-1 text-center">
                <span className="classic-line-item-quantity px-3 py-1 rounded-lg text-sm font-bold">
                  {item.quantity}
                </span>
              </div>
              
              {/* Unit Price */}
              <div className="col-span-2 text-right">
                <div className="classic-line-item-price font-medium">
                  ${item.unitPrice.toFixed(2)}
                </div>
              </div>
              
              {/* Discount */}
              <div className="col-span-2 text-right">
                <div className="classic-line-item-discount font-medium">
                  {item.discountAmount > 0 ? `-${item.discountAmount.toFixed(2)}` : '$0.00'}
                </div>
              </div>
              
              {/* Total */}
              <div className="col-span-1 text-right">
                <div className="classic-line-item-total font-bold">
                  ${item.total.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LineItemsSection;
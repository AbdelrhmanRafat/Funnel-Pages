import React, { useEffect, useState } from 'react';
import './ClassicBundleOptions.css';
import type { PurchaseOption, Product } from '../../../../../../lib/api/types';
import { getTranslation } from '../../../../../../lib/utils/i18n/translations';
import { useBundleStore } from '../../../../../../lib/stores/bundleStore';
import { useCustomOptionStore } from '../../../../../../lib/stores/customOptionBundleStore';
import ClassicBundleOptionsContainer from '../ClassicBundleOptionsContainer/ClassicBundleOptionsContainer';


interface ClassicBundleOptionsProps {
  data: PurchaseOption[];
  product: Product;
}

const ClassicBundleOptionReact: React.FC<ClassicBundleOptionsProps> = ({ data, product }) => {
  const isHaveVariant = product.is_have_variant === 'true';
  const name = 'qty';
  const [selectedIndex, setSelectedIndex] = useState(0);
  const setBundleState = useBundleStore((state) => state.setState);
  const initializeBundle = useCustomOptionStore((state) => state.initializeBundle);

  useEffect(() => {
    // On mount, set initial bundle state and custom options
    setBundleState({
      quantity: data[0]?.items || 1,
      selectedOffer: data[0] || null,
    });
    initializeBundle(data[0]?.items || 1);
  }, [data, setBundleState, initializeBundle]);

  const handleRadioChange = (index: number, item: PurchaseOption) => {
    setSelectedIndex(index);
    setBundleState({
      quantity: item.items || 1,
      selectedOffer: item,
    });
    initializeBundle(item.items || 1);
  };

  return (
    <div id="classic-bundle-options">
      <h3
        className="classic-bundle-options-title text-2xl py-3"
        data-translate="quantityOptions.chooseQuantity"
      >
        {getTranslation('quantityOptions.chooseQuantity')}
      </h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index}>
            <div className="classic-bundle-options-group border border-primary rounded-2xl p-1.5 sm:p-2">
              <label
                className="classic-bundle-options-label group relative overflow-hidden cursor-pointer block rounded-lg"
                htmlFor={`${name}${index + 1}`}
              >
                <input
                  type="radio"
                  id={`${name}${index + 1}`}
                  name={name}
                  className="hidden"
                  checked={selectedIndex === index}
                  onChange={() => handleRadioChange(index, item)}
                  data-offer-radio
                  data-offer-selected-item={JSON.stringify(item)}
                  data-offer-items={item.items?.toString() || '0'}
                />
                <div className="classic-bundle-options-content p-1.5 sm:p-2">
                  <div className="classic-bundle-options-header grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                    {/* Title and Details - Takes full width on mobile, 2 columns on desktop */}
                    <div className="sm:col-span-2 space-y-1">
                      <h3 className="classic-bundle-options-option-title font-bold text-xl leading-tight">
                        {item.title}
                      </h3>
                      <div className="classic-bundle-options-option-details flex flex-wrap items-center gap-1 sm:gap-2 text-xs">
                        <div className="classic-bundle-options-unit-badge py-0.5 px-2 rounded-full inline-block">
                          <span>{item.items === 1 ? '' : item.items}</span>
                          <span data-translate="quantityOptions.itemUnit.singular" />
                        </div>
                        <span className="hidden sm:inline text-gray-400">•</span>
                        <div className="classic-bundle-options-price-info flex items-center gap-1 text-xs">
                          <span>{item.price_per_item}</span>
                          <span data-translate="productFunnel.currency" />
                          <span data-translate="quantityOptions.pricePerItem" />
                        </div>
                      </div>
                    </div>
                    {/* Price Section - Right aligned on desktop, full width on mobile */}
                    <div className="flex flex-col items-start sm:items-end justify-center">
                      <div
                        className={`classic-bundle-options-final-price text-lg sm:text-xl font-bold leading-tight ${
                          item.discount > 0
                            ? 'classic-bundle-options-price-discount'
                            : 'classic-bundle-options-price-regular'
                        }`}
                      >
                        {item.final_total.toLocaleString()} {getTranslation('productFunnel.currency')}
                      </div>
                      {item.discount > 0 && (
                        <div className="flex flex-col items-start sm:items-end mt-1">
                          <div className="classic-bundle-options-original-price text-xs line-through text-gray-500">
                            {item.original_total.toLocaleString()} {getTranslation('productFunnel.currency')}
                          </div>
                          <div className="classic-bundle-options-discount-badge inline-flex items-center text-xs font-medium py-0.5 px-1.5 rounded-full mt-0.5">
                            <svg
                              className="classic-bundle-options-discount-icon w-2.5 h-2.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="ml-1">
                              {getTranslation('quantityOptions.saveDiscount')
                                .replace(
                                  '{discountAmount}',
                                  item.discount.toLocaleString() + ' ' + getTranslation('productFunnel.currency'),
                                )
                                .replace('{discountPercent}', item.discount_percent.toString())}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </label>
              {isHaveVariant && (
                <div
                  className={`flex flex-col gap-1 mt-2 ${selectedIndex === index ? '' : 'hidden'}`}
                  data-offer-bundle-options-elements
                  data-offer-option-id={`${name}${index + 1}`}
                >
                  {[...Array(item.items || 0)].map((_, panelIndex) => (
                    <ClassicBundleOptionsContainer
                      product={product}
                      key={panelIndex}
                      panelIndex={panelIndex + 1}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassicBundleOptionReact; 
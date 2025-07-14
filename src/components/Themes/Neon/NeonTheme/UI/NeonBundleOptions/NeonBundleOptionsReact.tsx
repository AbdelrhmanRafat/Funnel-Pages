import React, { useState, useEffect } from 'react';
import type { PurchaseOption, Product } from "../../../../../../lib/api/types";
import { getTranslation, type Language } from "../../../../../../lib/utils/i18n/translations";
import { useBundleStore } from "../../../../../../lib/stores/bundleStore";
import NeonBundleOptionsContainerReact from "../NeonBundleOptionsContainer/NeonBundleOptionsContainerReact.tsx";
import { useCustomOptionBundleStore } from '../../../../../../lib/stores/customOptionBundleStore.ts';

interface NeonBundleOptionsReactProps {
  data: PurchaseOption[];
  product: Product;
  name: string;
  currentLang: Language;
}

const NeonBundleOptionsReact: React.FC<NeonBundleOptionsReactProps> = ({
  data,
  product,
  name,
  currentLang,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isHaveVariant = product.is_have_variant === "true";
  
  // Zustand stores
  const { setQuantity, setSelectedOffer } = useBundleStore();
  const { initializeBundle, updatePanelOption } = useCustomOptionBundleStore();

  // Calculate numberOfOptions once for this product
  const numberOfOptions = product.custom_options ? Object.keys(product.custom_options).length : 0;

  // Initialize bundle with first option on mount
  useEffect(() => {
    if (data.length > 0) {
      const firstItem = data[0];
      handleOfferSelection(firstItem, 0);
    }
  }, [data]);

  const handleOfferSelection = (item: PurchaseOption, index: number) => {
    
    // Update Zustand stores
    setSelectedOffer(item);
    setQuantity(item.items || 1);
    initializeBundle(item.items || 1);
    
    // Initialize numberOfOptions for all panels
    const quantity = item.items || 1;
    for (let i = 1; i <= quantity; i++) {
      if (product.is_have_variant !== "true") {
        // Single product without variants
        updatePanelOption(i, {
          bundleIndex: i,
          sku_id: parseInt(product.sku_code || '0'),
          numberOfOptions: numberOfOptions,
        });
      } else {
        // Product with variants
        updatePanelOption(i, {
          bundleIndex: i,
          numberOfOptions: numberOfOptions,
        });
      }
    }
    

    
    // Update local state for UI
    setSelectedIndex(index);
  };

  const handleRadioChange = (item: PurchaseOption, index: number) => {
    handleOfferSelection(item, index);
  };

  return (
    <div id="neon-bundle-options">
      <h3 className="neon-bundle-options-title text-2xl py-3">
        {getTranslation("quantityOptions.chooseQuantity", currentLang)}
      </h3>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index}>
            <div className="neon-bundle-options-group border border-primary rounded-2xl p-1.5 sm:p-2">
              <label
                className="neon-bundle-options-label group relative overflow-hidden cursor-pointer block rounded-lg"
                htmlFor={`${name}${index + 1}`}
              >
                <input
                  type="radio"
                  id={`${name}${index + 1}`}
                  name={name}
                  className="hidden"
                  checked={index === selectedIndex}
                  onChange={() => handleRadioChange(item, index)}
                />
                <div className="neon-bundle-options-content p-1.5 sm:p-2">
                  <div className="neon-bundle-options-header grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <h3 className="neon-bundle-options-option-title font-bold text-xl leading-tight">
                        {item.title}
                      </h3>
                      <div className="neon-bundle-options-option-details flex flex-wrap items-center gap-1 sm:gap-2 text-xs">
                        <div className="neon-bundle-options-unit-badge py-0.5 px-2 rounded-full inline-block">
                          <span>{item.items === 1 ? "" : item.items}</span>
                          <span> {getTranslation("quantityOptions.itemUnit.singular", currentLang)}</span>
                        </div>
                        <span className="hidden sm:inline text-gray-400">•</span>
                        <div className="neon-bundle-options-price-info flex items-center gap-1 text-xs">
                          <span>{item.price_per_item}</span>
                          <span> {getTranslation("productFunnel.currency", currentLang)}</span>
                          <span> {getTranslation("quantityOptions.pricePerItem", currentLang)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start sm:items-end justify-center">
                      <div
                        className={`neon-bundle-options-final-price text-lg sm:text-xl font-bold leading-tight ${
                          item.discount > 0 ? "neon-bundle-options-price-discount" : "neon-bundle-options-price-regular"
                        }`}
                      >
                        {item.final_total.toLocaleString()}{" "}
                        {getTranslation("productFunnel.currency", currentLang)}
                      </div>

                      {item.discount > 0 && (
                        <div className="flex flex-col items-start sm:items-end mt-1">
                          <div className="neon-bundle-options-original-price text-xs line-through text-gray-500">
                            {item.original_total.toLocaleString()}{" "}
                            {getTranslation("productFunnel.currency", currentLang)}
                          </div>
                          <div className="neon-bundle-options-discount-badge inline-flex items-center text-xs font-medium py-0.5 px-1.5 rounded-full mt-0.5">
                            <svg
                              className="neon-bundle-options-discount-icon w-2.5 h-2.5"
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
                              {getTranslation("quantityOptions.saveDiscount", currentLang)
                                ?.replace(
                                  "{discountAmount}",
                                  item.discount.toLocaleString() +
                                    " " +
                                    getTranslation("productFunnel.currency", currentLang),
                                )
                                ?.replace(
                                  "{discountPercent}",
                                  item.discount_percent.toString(),
                                )}
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
                  className={`flex flex-col gap-1 mt-2 ${index === selectedIndex ? "" : "hidden"}`}
                >
                  {Array.from({ length: item.items || 0 }).map((_, panelIndex) => (
                    <NeonBundleOptionsContainerReact
                      key={panelIndex}
                      panelIndex={panelIndex + 1}
                      product={product}
                      currentLang={currentLang}
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

export default NeonBundleOptionsReact;
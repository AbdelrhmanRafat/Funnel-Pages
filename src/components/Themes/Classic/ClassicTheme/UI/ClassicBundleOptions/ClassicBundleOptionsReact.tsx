import React from 'react';
import type { PurchaseOption, Product } from "../../../../../../lib/api/types";
import { getTranslation, type Language } from "../../../../../../lib/utils/i18n/translations";
// Import the actual ClassicBundleOptionsContainerReact component and its types
import ClassicBundleOptionsContainerReact, {
  type ProcessedOptionData,
  // We don't need OptionDetail, OptionValue here, they are internal to Container's props
} from "../ClassicBundleOptionsContainer/ClassicBundleOptionsContainerReact.tsx";


interface ClassicBundleOptionsReactProps {
  data: PurchaseOption[];
  product: Product;
  isHaveVariant: boolean;
  name: string; // Corresponds to the radio button group name, e.g., "qty"
  currentLang: Language; // For translations if needed directly
  initialSelectedIndex?: number; // To control which item is initially "selected" visually
}

const ClassicBundleOptionsReact: React.FC<ClassicBundleOptionsReactProps> = ({
  data,
  product,
  isHaveVariant,
  name,
  currentLang,
  initialSelectedIndex = 0, // Default to the first item being selected
}) => {
  console.log("helllo",ClassicBundleOptionsReact);
  return (
    <div id="classic-bundle-options">
      <h3
        className="classic-bundle-options-title text-2xl py-3"
      >
        {getTranslation("quantityOptions.chooseQuantity", currentLang)}
      </h3>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index}> {/* Use item.id if available and unique, otherwise index */}
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
                  defaultChecked={index === initialSelectedIndex}
                  // data-offer-radio // These data attributes were for the .ts file
                  // data-offer-selected-item={JSON.stringify(item)}
                  // data-offer-items={item.items?.toString() || "0"}
                />
                <div className="classic-bundle-options-content p-1.5 sm:p-2">
                  <div className="classic-bundle-options-header grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <h3 className="classic-bundle-options-option-title font-bold text-xl leading-tight">
                        {item.title}
                      </h3>
                      <div className="classic-bundle-options-option-details flex flex-wrap items-center gap-1 sm:gap-2 text-xs">
                        <div className="classic-bundle-options-unit-badge py-0.5 px-2 rounded-full inline-block">
                          <span>{item.items === 1 ? "" : item.items}</span>
                          {/* Using getTranslation directly here */}
                          <span> {getTranslation("quantityOptions.itemUnit.singular", currentLang)}</span>
                        </div>
                        <span className="hidden sm:inline text-gray-400">•</span>
                        <div className="classic-bundle-options-price-info flex items-center gap-1 text-xs">
                          <span>{item.price_per_item}</span>
                          <span> {getTranslation("productFunnel.currency", currentLang)}</span>
                          <span> {getTranslation("quantityOptions.pricePerItem", currentLang)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start sm:items-end justify-center">
                      <div
                        className={`classic-bundle-options-final-price text-lg sm:text-xl font-bold leading-tight ${
                          item.discount > 0 ? "classic-bundle-options-price-discount" : "classic-bundle-options-price-regular"
                        }`}
                      >
                        {item.final_total.toLocaleString()}{" "}
                        {getTranslation("productFunnel.currency", currentLang)}
                      </div>

                      {item.discount > 0 && (
                        <div className="flex flex-col items-start sm:items-end mt-1">
                          <div className="classic-bundle-options-original-price text-xs line-through text-gray-500">
                            {item.original_total.toLocaleString()}{" "}
                            {getTranslation("productFunnel.currency", currentLang)}
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
                              {getTranslation("quantityOptions.saveDiscount", currentLang)}
                         
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
                  className={`flex flex-col gap-1 mt-2 ${index === initialSelectedIndex ? "" : "hidden"}`}
                  // data-offer-bundle-options-elements // For .ts file
                  // data-offer-option-id={`${name}${index + 1}`} // For .ts file
                >
                  {/* Render placeholders for ClassicBundleOptionsContainerReact */}
                  {Array.from({ length: item.items || 0 }).map((_, panelIndex) => (
                    <ClassicBundleOptionsContainerReact
                      
                      key={panelIndex}
                      panelIndex={panelIndex + 1}
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

export default ClassicBundleOptionsReact;

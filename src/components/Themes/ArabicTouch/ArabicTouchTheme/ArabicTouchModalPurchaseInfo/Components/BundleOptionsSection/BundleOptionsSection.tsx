import React from 'react';
import { getTranslation, type Language } from "../../../../../../../lib/utils/i18n/translations";
import './BundleOptionsSection.css';

interface BundleOptionsSectionProps {
  hasVariants: boolean;
  hasBundles: boolean;
  customOptions: any[];
  currentLang: Language;
  getDisplaySKU: (item: any, fallback: string) => string;
}

const BundleOptionsSection: React.FC<BundleOptionsSectionProps> = ({
  hasVariants,
  hasBundles,
  customOptions,
  currentLang,
  getDisplaySKU,
}) => {
  // Only render if conditions are met
  if (!hasVariants || !hasBundles || customOptions.length === 0) {
    return null;
  }

  return (
    <div className="arabictouch-bundle-options-section">
      <div className="arabictouch-options-grid grid grid-cols-1 md:grid-cols-2 gap-4">
        {customOptions.map((option, index) => (
          <div key={index} className="arabictouch-option-item rounded-lg p-4">
            <div className="arabictouch-option-header text-sm font-bold mb-3 flex items-center justify-between">
              <span>{getTranslation('modal.item', currentLang)} {option.bundleIndex}</span>
              <span className="arabictouch-option-sku text-xs font-mono opacity-75">
                SKU: {getDisplaySKU(option, `ITEM-${option.bundleIndex}`)}
              </span>
            </div>
            <div className="arabictouch-option-details space-y-2">
              <div className="arabictouch-option-selection">
                <span className="arabictouch-selection-tag px-3 py-1 rounded-full text-xs font-medium">
                  {option.firstOption}
                </span>
              </div>
              {option.secondOption && (
                <div className="arabictouch-option-selection">
                  <span className="arabictouch-selection-tag px-3 py-1 rounded-full text-xs font-medium">
                    {option.secondOption}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BundleOptionsSection;
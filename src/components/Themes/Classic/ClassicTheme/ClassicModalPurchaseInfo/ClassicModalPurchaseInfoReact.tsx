import React from 'react';
import type { Language } from "../../../../../lib/utils/i18n/translations";
// We might need a more specific type for all the data points if they are passed individually
// For now, using a generic approach or assuming data objects.

interface PurchaseInfoData {
  orderTitle?: string;
  itemsCount?: string | number;
  pricePerItem?: string;
  discountInfo?: string;
  totalQuantity?: string | number;
  subtotal?: string;
  totalDiscount?: string;
  finalTotal?: string; // For summary
  summaryFinalTotal?: string; // For direct purchase summary
  // Add other fields from data-modal-* attributes as needed
}

interface CustomerInfoData {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  paymentMethod?: string;
  deliveryMethod?: string;
  notes?: string;
}

interface CelebrationData {
  orderNumber?: string;
}

// Props for the React component
interface ClassicModalPurchaseInfoReactProps {
  isArabic: boolean;
  currentLang: Language;
  hasVariants: boolean;
  hasBundles: boolean;

  // Data for the views - these would be populated by the logic formerly in .ts
  purchaseInfoData?: PurchaseInfoData;
  customerInfoData?: CustomerInfoData;
  celebrationData?: CelebrationData;

  // To control which view is visible initially, or if both are rendered and CSS handles it.
  // For pure presentation, we might just render the structure of both.
  // Let's assume for now we render structure, and interactivity handles visibility.
  // Placeholder for selected custom options if needed for display
  bundleCustomOptions?: { panelIndex: number; firstOption: string; secondOption?: string }[];
  directPurchaseItemsHTML?: string; // If HTML is passed directly, otherwise needs structured data

  // Props for the <ClassicConfirmPurchaseButton /> if it's rendered by React.
  // For now, assuming the Astro component handles it or it's passed as a child.
}

const ClassicModalPurchaseInfoReact: React.FC<ClassicModalPurchaseInfoReactProps> = ({
  isArabic,
  currentLang,
  hasVariants,
  hasBundles,
  purchaseInfoData = {},
  customerInfoData = {},
  celebrationData = {},
  bundleCustomOptions = [],
  directPurchaseItemsHTML = ""
}) => {
  // The original component had two main views. We'll include both structures.
  // Visibility would be controlled by JS/CSS later.
  // The outermost `classic-purchase-modal` custom tag is removed.
  // The `data-modal-container` div with class `classic-modal` will be the root.

  return (
    <div
      // data-modal-container // This was used by .ts, may not be needed for pure presentation
      className="classic-modal fixed inset-0 z-[1000] flex justify-center items-center" // Default to visible for storybook/dev
      // style={{ display: 'flex' }} // Or use a prop to control visibility
    >
      <div
        // data-modal-overlay // Used by .ts
        className="classic-modal-overlay absolute inset-0 z-[1001]"
      ></div>
      <div
        className="classic-modal-container relative container md:w-8/12 lg:w-6/12 max-h-[92vh] overflow-y-auto z-[1002] m-4"
      >
        {/* Purchase Info View (Default) */}
        <div /* data-modal-purchase-info-view */ className="modal-view w-full"> {/* Assuming this view is visible by default */}
          <div className="classic-modal-header flex justify-between items-center">
            <div className="classic-header-content flex justify-start items-center gap-2">
              <div className="classic-header-accent"></div>
              <h3
                className="classic-modal-title"
                data-translate="modal.purchaseInfo" // i18n will handle this text
              >
                {/* Text filled by i18n */}
              </h3>
            </div>
          </div>

          <div className="classic-modal-body">
            <div className="classic-modal-content">
              <div className="classic-purchase-summary">
                <div className="classic-section-header">
                  <div className="classic-section-icon classic-icon-summary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <h4
                    className="classic-section-title"
                    data-translate="modal.orderSummary"
                  >
                    {/* Text filled by i18n */}
                  </h4>
                </div>

                {hasBundles ? (
                  <div
                    // data-modal-Bundle-info
                    className="classic-summary-section"
                  >
                    <div className="classic-summary-grid">
                      <div className="classic-summary-column">
                        <div className="classic-summary-item">
                          <span className="classic-summary-label" data-translate="modal.orderType"></span>
                          <span className="classic-summary-value" /* data-modal-order-title */>{purchaseInfoData.orderTitle || ''}</span>
                        </div>
                        <div className="classic-summary-item">
                          <span className="classic-summary-label" data-translate="modal.itemsCount"></span>
                          <span className="classic-summary-value" /* data-modal-items-count */>{purchaseInfoData.itemsCount || ''}</span>
                        </div>
                      </div>
                      <div className="classic-summary-column">
                        <div className="classic-summary-item">
                          <span className="classic-summary-label" data-translate="modal.pricePerItem"></span>
                          <span className="classic-summary-value" /* data-modal-price-per-item */>{purchaseInfoData.pricePerItem || ''}</span>
                        </div>
                        <div className="classic-summary-item">
                          <span className="classic-summary-label" data-translate="modal.discount"></span>
                          <span className="classic-summary-value classic-discount-info" /* data-modal-discount-info */>{purchaseInfoData.discountInfo || ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    // data-modal-direct-purchase-info
                    className="classic-summary-section classic-direct-purchase-section"
                  >
                    <div className="classic-section-header">
                      <div className="classic-section-icon classic-icon-direct">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                      </div>
                      <h5 className="classic-subsection-title" data-translate="modal.directPurchaseDetails"></h5>
                    </div>
                    <div
                      // data-modal-direct-items-container
                      className="classic-direct-items-list"
                      dangerouslySetInnerHTML={{ __html: directPurchaseItemsHTML || "<!-- Dynamic direct items from prop -->" }}
                    >
                    </div>
                    <div className="classic-direct-summary">
                      <div className="classic-direct-summary-item">
                        <span className="classic-summary-label" data-translate="modal.totalQuantity"></span>
                        <span className="classic-summary-value" /* data-modal-total-quantity */ >{purchaseInfoData.totalQuantity || ''}</span>
                      </div>
                      <div className="classic-direct-summary-item">
                        <span className="classic-summary-label" data-translate="modal.subtotal"></span>
                        <span className="classic-summary-value" /* data-modal-subtotal */ >{purchaseInfoData.subtotal || ''}</span>
                      </div>
                      <div className="classic-direct-summary-item">
                        <span className="classic-summary-label" data-translate="modal.totalDiscount"></span>
                        <span className="classic-summary-value classic-discount-info" /* data-modal-total-discount */ >{purchaseInfoData.totalDiscount || ''}</span>
                      </div>
                      <div className="classic-direct-summary-item">
                        <span className="classic-summary-label" data-translate="modal.finalTotal"></span>
                        <span className="classic-summary-value" /* data-modal-summary-final-total */ >{purchaseInfoData.summaryFinalTotal || ''}</span>
                      </div>
                    </div>
                  </div>
                )}

                {hasVariants && hasBundles && (
                  <div
                    // data-modal-color-size-info
                    className="classic-summary-section classic-options-section"
                  >
                    <div className="classic-section-header">
                      <div className="classic-section-icon classic-icon-options">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path></svg>
                      </div>
                      <h5 className="classic-subsection-title">
                        <span data-translate={hasBundles ? "modal.bundleOptions" : "modal.productOptions"}></span>
                      </h5>
                    </div>
                    <div
                      // data-modal-selection-items
                      className="classic-selection-items flex flex-col gap-2"
                    >
                      {bundleCustomOptions.map((option, index) => (
                        <div className="classic-selection-item" key={index}>
                          <div className="classic-panel-info">{/* getTranslation('modal.item', currentLang) */} Item {option.panelIndex}</div>
                          <div className="classic-selection-display"><span>{option.firstOption}</span></div>
                          {option.secondOption && <div className="classic-selection-display"><span>{option.secondOption}</span></div>}
                        </div>
                      ))}
                      {bundleCustomOptions.length === 0 && !directPurchaseItemsHTML && <p>No options selected or available.</p>}
                    </div>
                  </div>
                )}

                <div
                  // data-modal-customer-info
                  className="classic-summary-section classic-customer-section"
                >
                  <div className="classic-section-header">
                    <div className="classic-section-icon classic-icon-customer">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                    <h5 className="classic-section-title" data-translate="modal.customerInfo"></h5>
                  </div>
                  <div className="classic-customer-details">
                    <div className="classic-customer-grid">
                      <div className="classic-customer-column">
                        <div className="classic-customer-field">
                          <span className="classic-field-label" data-translate="modal.fullName"></span>
                          <span className="classic-field-value" /* data-modal-customer-name */ >{customerInfoData.name || '-'}</span>
                        </div>
                        <div className="classic-customer-field">
                          <span className="classic-field-label" data-translate="modal.phone"></span>
                          <span className="classic-field-value" /* data-modal-customer-phone */ >{customerInfoData.phone || '-'}</span>
                        </div>
                        <div className="classic-customer-field">
                          <span className="classic-field-label" data-translate="modal.email"></span>
                          <span className="classic-field-value" /* data-modal-customer-email */ >{customerInfoData.email || '-'}</span>
                        </div>
                      </div>
                      <div className="classic-customer-column">
                        <div className="classic-customer-field">
                          <span className="classic-field-label" data-translate="modal.address"></span>
                          <span className="classic-field-value" /* data-modal-customer-address */ >{customerInfoData.address || '-'}</span>
                        </div>
                        <div className="classic-customer-field">
                          <span className="classic-field-label" data-translate="modal.city"></span>
                          <span className="classic-field-value" /* data-modal-customer-city */ >{customerInfoData.city || '-'}</span>
                        </div>
                        <div className="classic-customer-field">
                          <span className="classic-field-label" data-translate="modal.paymentMethod"></span>
                          <span className="classic-field-value" /* data-modal-payment-method */ >{customerInfoData.paymentMethod || '-'}</span>
                        </div>
                        <div className="classic-customer-field">
                          <span className="classic-field-label" data-translate="modal.deliveryMethod"></span>
                          <span className="classic-field-value" /* data-modal-delivery-method */ >{customerInfoData.deliveryMethod || '-'}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="classic-customer-field classic-notes-field"
                      /* data-modal-notes-section */
                      style={{ display: customerInfoData.notes ? 'block' : 'none' }}
                    >
                      <span className="classic-field-label" data-translate="modal.notes"></span>
                      <span className="classic-field-value" /* data-modal-customer-notes */ >{customerInfoData.notes || ''}</span>
                    </div>
                  </div>
                </div>

                <div className="classic-summary-total">
                  <div className="classic-total-content">
                    <div className="classic-total-icon">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path></svg>
                    </div>
                    <span className="classic-total-label" data-translate="modal.finalTotal"></span>
                    <span className="classic-total-value" /* data-modal-final-total */ >{purchaseInfoData.finalTotal || ''}</span>
                  </div>
                </div>
              </div>

              <div className="classic-modal-actions">
                {/* ClassicConfirmPurchaseButton would be rendered here by Astro or passed as children
                    For now, this React component won't render it directly to keep it simple.
                    User will integrate the Astro button later.
                */}
                 <div>{/* Placeholder for ClassicConfirmPurchaseButton */}</div>
                <button
                  type="button"
                  className="classic-modal-cancel"
                  // data-modal-cancel-button // Handled by interactivity layer
                  data-translate="modal.cancel"
                >
                  {/* Text from i18n */}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Celebration View */}
        <div
          // data-modal-celebration-view
          className="modal-view classic-celebration-view"
          style={{ display: 'none' }} // Initially hidden
        >
          <div className="classic-modal-header classic-celebration-header">
            <div className="classic-celebration-header-content">
              <div className="classic-celebration-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="classic-celebration-title" data-translate="celebration.orderConfirmed"></h3>
            </div>
          </div>
          <div className="classic-modal-body">
            <div className="classic-celebration-content">
              <div className="classic-celebration-animation">
                <div className="classic-success-checkmark"><div className="classic-check-icon"></div></div>
              </div>
              <div className="classic-celebration-message">
                <h2 className="classic-celebration-main-title" data-translate="celebration.thankYou"></h2>
                <p className="classic-celebration-subtitle" data-translate="celebration.detailsMessage"></p>
              </div>
              <div className="classic-celebration-summary">
                <div className="classic-celebration-items">
                  <div className="classic-celebration-summary-item">
                    <div className="classic-celebration-item-icon classic-icon-order">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    </div>
                    <div className="classic-celebration-item-text">
                      <strong data-translate="celebration.orderNumber"></strong>
                      <span /* data-modal-order-number */ >{celebrationData.orderNumber || '#00000'}</span>
                    </div>
                  </div>
                  <div className="classic-celebration-summary-item">
                    <div className="classic-celebration-item-icon classic-icon-delivery">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div className="classic-celebration-item-text">
                      <strong data-translate="celebration.expectedDelivery"></strong>
                      <span data-translate="celebration.deliveryTime"></span>
                    </div>
                  </div>
                  <div className="classic-celebration-summary-item">
                    <div className="classic-celebration-item-icon classic-icon-contact">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    </div>
                    <div className="classic-celebration-item-text">
                      <strong data-translate="celebration.contactYou"></strong>
                      <span data-translate="celebration.contactTime"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="classic-celebration-actions">
                <button
                  type="button"
                  className="classic-celebration-primary-button"
                  // data-modal-celebration-continue-button
                  data-translate="celebration.continueShopping"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassicModalPurchaseInfoReact;

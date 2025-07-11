import React from 'react';

interface ClassicProductCostsReactProps {
  hasBundles: boolean;
  showDiscountWhenZero?: boolean;
  currencySymbol: string;
  getTranslation: (key: string) // Simplified getTranslation type for this component
    => string;

  // Data props for display
  quantity?: number | string;
  unitPrice?: number | string;
  subtotal?: number | string;
  shippingCost?: number | string; // Only relevant if hasBundles is true
  discount?: number | string;
  total?: number | string;

  isLoading?: boolean; // For future use if a loading state for the whole block is needed
}

const ClassicProductCostsReact: React.FC<ClassicProductCostsReactProps> = ({
  hasBundles,
  showDiscountWhenZero = false,
  currencySymbol,
  getTranslation,
  quantity = 0,
  unitPrice = 0,
  subtotal = 0,
  shippingCost = 0,
  discount = 0,
  total = 0,
  isLoading = false, // Placeholder for loading state application
}) => {
  const formatPrice = (value: number | string) => {
    return `${value} ${currencySymbol}`;
  };

  const discountVisible = discount !== 0 && discount !== "0" || (showDiscountWhenZero && (discount === 0 || discount === "0"));

  return (
    <div className={`classic-product-costs-container ${isLoading ? 'classic-product-costs-loading' : ''}`}>
      <div className="classic-product-costs-body">
        <div className="classic-product-costs-content space-y-3">
          <div className="classic-product-costs-row flex justify-between items-center">
            <span className="classic-product-costs-label">
              {getTranslation('productFunnel.quantity')}
            </span>
            <div>
              <span className="classic-product-costs-value" /* data-funnel-price-quantity */>
                {quantity}
              </span>
              <span> {/* space before piece is important if quantity is just a number */}
                {' '}{getTranslation('productFunnel.piece')}
              </span>
            </div>
          </div>

          <div className="classic-product-costs-row flex justify-between items-center">
            <span className="classic-product-costs-label">
              {getTranslation('productFunnel.unitPrice')}
            </span>
            <span className="classic-product-costs-value" /* data-funnel-price-unit */>
              {formatPrice(unitPrice)}
            </span>
          </div>

          <div className="classic-product-costs-row flex justify-between items-center">
            <span className="classic-product-costs-label">
              {getTranslation('productFunnel.subtotal')}
            </span>
            <span className="classic-product-costs-value" /* data-funnel-price-subtotal */>
              {formatPrice(subtotal)}
            </span>
          </div>

          {hasBundles && (
            <div className="classic-product-costs-row flex justify-between items-center">
              <span className="classic-product-costs-label">
                {getTranslation('productFunnel.shippingCost')}
              </span>
              <span className="classic-product-costs-value" /* data-funnel-price-shipping */>
                {formatPrice(shippingCost || 0)}
              </span>
            </div>
          )}

          {discountVisible && (
            <div
              className="classic-product-costs-row flex justify-between items-center"
              /* data-funnel-discount-container -- not needed for React directly */
            >
              <span className="classic-product-costs-label">
                {getTranslation('productFunnel.discount')}
              </span>
              <span className="classic-product-costs-discount" /* data-funnel-price-discount */>
                - {formatPrice(Math.abs(Number(discount)))} {/* Ensure discount is shown as positive reduction */}
              </span>
            </div>
          )}
        </div>

        <div className="classic-product-costs-total-section">
          <div className="flex justify-between items-center">
            <span className="classic-product-costs-total-label">
              {getTranslation('productFunnel.total')}
            </span>
            <span className="classic-product-costs-total-value" /* data-funnel-price-total */>
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassicProductCostsReact;

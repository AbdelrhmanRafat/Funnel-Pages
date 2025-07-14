// TechnoConfirmPurchaseButtonReact.tsx
import "./TechnoConfirmPurchaseButton.css";
import React, { useState } from 'react';

// Loader Icon Component
const LoaderIcon = ({ width = "16", height = "16", className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide lucide-loader-2 ${className}`}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

interface TechnoConfirmPurchaseButtonReactProps {
  isArabic: boolean;
  onClick?: () => Promise<void> | void;
  confirmTextOverride?: string;
  loadingTextOverride?: string;
  disabled : boolean;
}

const TechnoConfirmPurchaseButtonReact: React.FC<TechnoConfirmPurchaseButtonReactProps> = ({
  disabled,
  isArabic,
  onClick,
  confirmTextOverride,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const buttonText = confirmTextOverride
    ? confirmTextOverride
    : (isArabic ? "تأكيد الطلب" : "Confirm Order");

  const handleClick = async () => {
    if (isLoading || !onClick) return;

    try {
      setIsLoading(true);
      await onClick();
    } catch (error) {
      console.error('Order confirmation failed:', error);
      // Error handling can be enhanced here (e.g., show error message)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`techno-modal-confirm ${isLoading ? 'loading' : ''}`}
      onClick={handleClick}
      disabled={isLoading}
      aria-busy={isLoading}
    >
      <span 
        className="confirm-text" 
        style={{ 
          opacity: isLoading ? 0 : 1,
          transform: isLoading ? 'translateY(-10px)' : 'translateY(0)',
          transition: 'all 0.2s ease'
        }}
      >
        {buttonText}
      </span>
      <span
        className="loading-spinner"
        style={{
          display: isLoading ? 'inline-flex' : 'none',
          opacity: isLoading ? 1 : 0,
          transition: 'opacity 0.2s ease'
        }}
      >
        <LoaderIcon width="16" height="16" className="animate-spin" />
      </span>
    </button>
  );
};

export default TechnoConfirmPurchaseButtonReact;
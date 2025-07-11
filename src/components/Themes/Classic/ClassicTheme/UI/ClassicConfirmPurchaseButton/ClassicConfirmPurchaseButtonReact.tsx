import React from 'react';

// Placeholder for LucideIcon functionality if it's not available as a React component
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


interface ClassicConfirmPurchaseButtonReactProps {
  isArabic: boolean;
  isLoading?: boolean;
  onClick?: () => void; // The actual async logic and state update will be handled by parent
  // Any other props like text overrides if needed
  confirmTextOverride?: string;
  loadingTextOverride?: string; // Though current design hides text on load
}

const ClassicConfirmPurchaseButtonReact: React.FC<ClassicConfirmPurchaseButtonReactProps> = ({
  isArabic,
  isLoading = false,
  onClick,
  confirmTextOverride,
}) => {
  const buttonText = confirmTextOverride
    ? confirmTextOverride
    : (isArabic ? "تأكيد الطلب" : "Confirm Order");

  return (
    <button
      type="button"
      className={`classic-modal-confirm ${isLoading ? 'loading' : ''}`}
      onClick={onClick}
      disabled={isLoading}
      aria-busy={isLoading}
    >
      <span className="confirm-text" style={{ opacity: isLoading ? 0 : 1, transform: isLoading ? 'translateY(-10px)' : 'translateY(0)' }}>
        {buttonText}
      </span>
      <span
        className="loading-spinner"
        style={{
          display: isLoading ? 'inline-flex' : 'none',
          opacity: isLoading ? 1 : 0, // Added for transition if any
         }}
      >
        {/* Using the placeholder LoaderIcon */}
        <LoaderIcon width="16" height="16" className="animate-spin" />
      </span>
    </button>
  );
};

export default ClassicConfirmPurchaseButtonReact;

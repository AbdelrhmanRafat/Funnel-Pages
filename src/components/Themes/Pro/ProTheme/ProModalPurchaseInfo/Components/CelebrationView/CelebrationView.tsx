import "./CelebrationView.css";
import { getTranslation, type Language } from "../../../../../../../lib/utils/i18n/translations";

const CelebrationView: React.FC<{
  currentLang: Language;
  orderNumber: string;
  onContinue: () => void;
  onClose: () => void;
}> = ({ currentLang, orderNumber, onContinue, onClose }) => (
  <div className="w-full">
    {/* Celebration Header */}
    <div className="pro-celebration-header flex justify-center items-center p-6 rounded-t-xl">
      <div className="flex items-center gap-3">
        <div className="pro-celebration-icon p-3 rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold m-0">
          {getTranslation('celebration.orderConfirmed', currentLang)}
        </h3>
      </div>
    </div>

    {/* Celebration Body */}
    <div className="p-6 md:p-8">
      <div className="flex flex-col items-center text-center space-y-6">
        
        {/* Success Animation */}
        <div className="flex justify-center items-center my-8">
          <div className="pro-success-checkmark w-24 h-24 rounded-full border-4 relative">
            <div className="pro-check-icon w-20 h-20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        {/* Celebration Message */}
        <div className="space-y-4 max-w-md">
          <h2 className="pro-celebration-main-title text-3xl font-bold">
            {getTranslation('celebration.thankYou', currentLang)}
          </h2>
          <p className="pro-celebration-subtitle text-lg leading-relaxed">
            {getTranslation('celebration.detailsMessage', currentLang)}
          </p>
        </div>

        {/* Celebration Summary */}
        <div className="pro-celebration-summary w-full max-w-lg rounded-xl border-2 p-6 mt-6">
          <div className="space-y-6">
            
            {/* Order Number */}
            <div className="pro-celebration-summary-item flex items-center gap-4 p-4 rounded-xl border">
              <div className="pro-celebration-item-icon pro-icon-order p-3 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <div className="flex-1 text-right">
                <div className="font-bold mb-1">{getTranslation('celebration.orderNumber', currentLang)}</div>
                <div className="text-sm opacity-75">{orderNumber}</div>
              </div>
            </div>
            
            {/* Expected Delivery */}
            <div className="pro-celebration-summary-item flex items-center gap-4 p-4 rounded-xl border">
              <div className="pro-celebration-item-icon pro-icon-delivery p-3 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="flex-1 text-right">
                <div className="font-bold mb-1">{getTranslation('celebration.expectedDelivery', currentLang)}</div>
                <div className="text-sm opacity-75">{getTranslation('celebration.deliveryTime', currentLang)}</div>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="pro-celebration-summary-item flex items-center gap-4 p-4 rounded-xl border">
              <div className="pro-celebration-item-icon pro-icon-contact p-3 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </div>
              <div className="flex-1 text-right">
                <div className="font-bold mb-1">{getTranslation('celebration.contactYou', currentLang)}</div>
                <div className="text-sm opacity-75">{getTranslation('celebration.contactTime', currentLang)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8">
          <button
            type="button"
            className="pro-celebration-primary-button px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 active:scale-95"
            onClick={onContinue}
          >
            {getTranslation('celebration.continueShopping', currentLang)}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default CelebrationView;
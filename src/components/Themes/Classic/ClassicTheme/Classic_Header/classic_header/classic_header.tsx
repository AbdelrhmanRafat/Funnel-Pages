/**
 * Classic Header Component
 * 
 * This component renders the header section of the Classic theme funnel.
 * 
 * API Integration:
 * - Uses the 'classic_header' block from the Baseet API response
 * - API Endpoint: https://baseet.co/api.php?id={funnelId}
 * - Required Headers: 
 *   - Accept: 'application/json'
 *   - Accept-Language: 'ar' or 'en'
 *   - App-Version: '11'
 *   - Device-Name: 'iphone 11 pro'
 *   - Device-OS-Version: '13'
 *   - Device-UDID: '1234'
 *   - Device-Push-Token: '123456'
 *   - Device-Type: 'web'
 *   - country-code: 'EG'
 *   - Cookie: 'laravel_session={session}'
 * 
 * Expected API Response Structure for this component:
 * {
 *   "name": "classic_header",
 *   "data": {
 *     "title": "Product Title", // Used for main heading
 *     "subtitle": "Product Description", // Used for subheading
 *     "logo": "/images/logo.png" // Path to logo image
 *   }
 * }
 * 
 * @version 1.0.0
 * @author Replit AI
 * @lastModified May 4, 2025
 */

import React from 'react';
import './classic_header.css';
import type { BlockData } from "../../../../../../Interfaces/Products";
const defaultLogo: string = "assets/default-logo.svg";

interface HeaderProps {
  headerData: BlockData;
}

const ClassicHeader: React.FC<HeaderProps> = ({ headerData }) => {


  console.log('Header block data:', headerData);

  return (
    <header className="bg-white shadow-sm rtl">
      <div className="container mx-auto px-2">
        <div className="flex flex-col items-center py-1">
          <div className="w-full flex justify-end">
            <button
              // onClick={toggleLanguage} 
              className="p-1 text-xs rounded-full hover:bg-gray-100 focus:outline-none"
            // aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              {/* <span className="text-xs font-medium">
                {isArabic ? 'EN' : 'عربي'}
              </span> */}
              <span className="text-xs font-medium">EN</span>
            </button>
          </div>

          <div className="flex flex-col items-center text-center mt-0">
            <img
              src={defaultLogo}
              alt={headerData.title}
              className="h-14 w-auto mb-1"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.onerror = null; // Prevent infinite loop if default also fails
                img.src = defaultLogo + '?fallback=' + Date.now(); // Force reload with cache-busting
              }}
            />
            <h1 className="text-base font-bold text-gray-900 leading-tight">
              {headerData.title}
            </h1>
            {headerData.subtitle && (
              <p
                className="text-xs text-gray-600 max-w-xs"
                title={headerData.subtitle}
              >
                {headerData.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClassicHeader;

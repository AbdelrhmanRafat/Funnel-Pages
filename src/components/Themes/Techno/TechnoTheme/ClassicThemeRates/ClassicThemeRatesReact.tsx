import React, { useMemo } from 'react';
import { getTranslation, type Language } from '../../../../../lib/utils/i18n/translations';
import { FunnelClassicComponents } from "../../../../../lib/constants/themes";
import type { BlockData } from '../../../../../lib/api/types';
import './ClassicThemeRates.css';

interface ClassicThemeRatesReactProps {
  ratingData: BlockData;
  currentLang: Language;
}

interface Star {
  type: 'full' | 'half' | 'empty';
  key: string;
}

const ClassicThemeRatesReact: React.FC<ClassicThemeRatesReactProps> = ({
  ratingData,
  currentLang,
}) => {
  // Generate stars function (converted from Astro)
  const generateStars = (rating: number): Star[] => {
    const stars: Star[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    for (let i = 0; i < fullStars; i++) {
      stars.push({ type: 'full', key: `full-${i}` });
    }

    if (hasHalfStar) {
      stars.push({ type: 'half', key: 'half' });
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push({ type: 'empty', key: `empty-${i}` });
    }

    return stars;
  };

  // Extract rating from ratingData (same logic as Astro)
  const rating = useMemo(() => {
    return Array.isArray(ratingData?.items) && ratingData.items.length > 0
      ? parseFloat(ratingData.items[0].number ?? "0")
      : 0;
  }, [ratingData]);

  // Generate stars array
  const stars = useMemo(() => generateStars(rating), [rating]);

  // Language and direction logic
  const isArabic = currentLang === "ar";
  const displayStars = isArabic ? [...stars].reverse() : stars;

  // Star component for different types
  const StarIcon: React.FC<{ star: Star }> = ({ star }) => {
    const baseProps = {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      width: "20",
      height: "20",
    };

    const starPath = "M12 .587l3.668 7.431 8.2 1.191-5.934 5.782 1.402 8.172L12 18.896l-7.336 3.867 1.402-8.172L.132 9.209l8.2-1.191z";

    switch (star.type) {
      case 'full':
        return (
          <svg className="classic-rating-star-full" {...baseProps}>
            <path d={starPath} fill="currentColor" />
          </svg>
        );
      
      case 'half':
        return (
          <svg className="classic-rating-star-half" {...baseProps}>
            <defs>
              <linearGradient id="halfGradient">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="var(--classic-color-outline)" />
              </linearGradient>
            </defs>
            <path d={starPath} fill="url(#halfGradient)" />
          </svg>
        );
      
      case 'empty':
        return (
          <svg className="classic-rating-star-empty" {...baseProps}>
            <path d={starPath} fill="currentColor" />
          </svg>
        );
      
      default:
        return null;
    }
  };

  return (
    <div id={FunnelClassicComponents.ClassicRates} className="classic-rates">
      <div 
        className="classic-rating-display" 
        style={{ direction: isArabic ? "rtl" : "ltr" }}
      >
        {displayStars.map((star) => (
          <span key={star.key}>
            <StarIcon star={star} />
          </span>
        ))}
        <span className="classic-rating-number">({rating})</span>
      </div>
    </div>
  );
};

export default ClassicThemeRatesReact;
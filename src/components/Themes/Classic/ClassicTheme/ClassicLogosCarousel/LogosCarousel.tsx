import React, { useEffect, useState } from 'react';
import type { Item } from '../../../../../lib/api/types';



interface LogosCarouselProps {
  logos: Item[];
}

const LogosCarousel: React.FC<LogosCarouselProps> = ({ logos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isRTL, setIsRTL] = useState(false);

  // Client-side only and detect RTL
  useEffect(() => {
    setIsMounted(true);
    
    // Detect RTL from document direction or HTML lang
    if (typeof document !== 'undefined') {
      const htmlLang = document.documentElement.lang;
      const direction = document.documentElement.dir || 
                       getComputedStyle(document.documentElement).direction;
      
      // Common RTL languages
      const rtlLanguages = ['ar', 'he', 'fa', 'ur', 'ku'];
      const isRTLLang = rtlLanguages.some(lang => htmlLang.startsWith(lang));
      
      setIsRTL(direction === 'rtl' || isRTLLang);
    }
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (!isMounted) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % Math.max(1, logos.length - 3));
    }, 3000);

    return () => clearInterval(interval);
  }, [isMounted, logos.length]);

  const goToPrev = () => {
    if (isRTL) {
      setCurrentIndex(prev => Math.min(logos.length - 4, prev + 1));
    } else {
      setCurrentIndex(prev => Math.max(0, prev - 1));
    }
  };

  const goToNext = () => {
    if (isRTL) {
      setCurrentIndex(prev => Math.max(0, prev - 1));
    } else {
      setCurrentIndex(prev => Math.min(logos.length - 4, prev + 1));
    }
  };

  // SSR placeholder
  if (!isMounted) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center gap-8">
          {logos.slice(0, 4).map((_, index) => (
            <div key={index} className="w-24 h-16 animate-pulse rounded" style={{ backgroundColor: '#f3f4f6' }}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <style dangerouslySetInnerHTML={{
        __html: `
          .simple-carousel {
            overflow: hidden;
            direction: inherit;
          }
          
          .carousel-track {
            display: flex;
            transition: transform 0.5s ease;
            gap: 2rem;
          }
          
          .carousel-track.rtl {
            direction: rtl;
          }
          
          .carousel-item {
            min-width: 120px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 1rem;
          }
          
          .logo-img {
            max-width: 100%;
            max-height: 60px;
            object-fit: contain;
          }
          
          .nav-btn {
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .nav-btn:hover {
            background: #e5e7eb;
          }
          
          .nav-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          .dots {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 1.5rem;
          }
          
          .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #d1d5db;
            cursor: pointer;
            transition: background 0.2s ease;
            border: none;
          }
          
          .dot.active {
            background: #3b82f6;
          }
        `
      }} />

      <div className="flex items-center gap-4">
        {/* Previous Button */}
        <button 
          className="nav-btn"
          onClick={goToPrev}
          disabled={isRTL ? currentIndex >= logos.length - 4 : currentIndex === 0}
          type="button"
        >
          {isRTL ? '→' : '←'}
        </button>

        {/* Carousel */}
        <div className="simple-carousel flex-1">
          <div 
            className={`carousel-track ${isRTL ? 'rtl' : ''}`}
            style={{ 
              transform: `translateX(${isRTL ? '' : '-'}${currentIndex * 152}px)` // 120px width + 32px gap
            }}
          >
            {logos.map((logo, index) => (
              <div key={index} className="carousel-item">
                <img 
                  src={logo.image} 
                  alt={logo.label} 
                  className="logo-img"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <button 
          className="nav-btn"
          onClick={goToNext}
          disabled={isRTL ? currentIndex === 0 : currentIndex >= logos.length - 4}
          type="button"
        >
          {isRTL ? '←' : '→'}
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="dots">
        {Array.from({ length: Math.max(1, logos.length - 3) }).map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
};

export default LogosCarousel;
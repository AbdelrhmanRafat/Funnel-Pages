import React, { useEffect, useState, useCallback, useRef } from 'react';
import type { Item } from '../../../../../lib/api/types';

interface LogosCarouselProps {
  logos: Item[];
}

const NeonLogosCarousel: React.FC<LogosCarouselProps> = ({ logos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Responsive items per view
  const [itemsPerView, setItemsPerView] = useState(3);

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        if (width < 640) setItemsPerView(1);
        else if (width < 1024) setItemsPerView(2);
        else setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // Client-side only and detect RTL
  useEffect(() => {
    setIsMounted(true);
    
    if (typeof document !== 'undefined') {
      const htmlLang = document.documentElement.lang;
      const direction = document.documentElement.dir || 
                       getComputedStyle(document.documentElement).direction;
      
      const rtlLanguages = ['ar', 'he', 'fa', 'ur', 'ku'];
      const isRTLLang = rtlLanguages.some(lang => htmlLang.startsWith(lang));
      
      setIsRTL(direction === 'rtl' || isRTLLang);
    }
  }, []);

  // Auto-advance carousel with pause on hover
  const startAutoPlay = useCallback(() => {
    if (logos.length <= itemsPerView || isPaused) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const maxIndex = Math.max(0, logos.length - itemsPerView);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 4000);
  }, [logos.length, itemsPerView, isPaused]);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    startAutoPlay();
    return stopAutoPlay;
  }, [isMounted, startAutoPlay, stopAutoPlay]);

  // Smooth navigation with transition lock
  const navigateToIndex = useCallback((newIndex: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const goToPrev = useCallback(() => {
    const maxIndex = Math.max(0, logos.length - itemsPerView);
    const newIndex = isRTL 
      ? Math.min(maxIndex, currentIndex + 1)
      : Math.max(0, currentIndex - 1);
    navigateToIndex(newIndex);
  }, [currentIndex, logos.length, itemsPerView, isRTL, navigateToIndex]);

  const goToNext = useCallback(() => {
    const maxIndex = Math.max(0, logos.length - itemsPerView);
    const newIndex = isRTL 
      ? Math.max(0, currentIndex - 1)
      : Math.min(maxIndex, currentIndex + 1);
    navigateToIndex(newIndex);
  }, [currentIndex, logos.length, itemsPerView, isRTL, navigateToIndex]);

  // Touch/swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    // In RTL mode, logical directions are flipped
    if (isLeftSwipe) {
      isRTL ? goToPrev() : goToNext();
    } else if (isRightSwipe) {
      isRTL ? goToNext() : goToPrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Mouse interaction handlers
  const handleMouseEnter = () => {
    setIsPaused(true);
    stopAutoPlay();
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    startAutoPlay();
  };

  // If few logos, show in a grid without carousel
  if (logos.length <= itemsPerView) {
    return (
              <div className="neon-carousel-container w-full  mx-auto" data-component="neon-logos-static">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {logos.map((logo, index) => (
            <div 
              key={index} 
              className="neon-carousel-card rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 w-full max-w-sm"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <div className="neon-carousel-logo w-20 sm:w-24 h-20 sm:h-24 mx-auto mb-4 rounded-xl overflow-hidden flex items-center justify-center">
                <img 
                  src={logo.image} 
                  alt={logo.label || `Trusted partner ${index + 1}`}
                  className="object-contain w-full h-full p-3"
                  loading="lazy"
                  data-logo-image
                />
              </div>
              <h4 className="neon-carousel-name text-sm font-semibold mb-3">{logo.label || `Partner ${index + 1}`}</h4>
              <div className="neon-carousel-accent w-full h-1 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // SSR placeholder with skeleton loading
  if (!isMounted) {
    return (
              <div className="neon-carousel-container w-full max-w-6xl mx-auto px-4 sm:px-6" data-component="neon-logos-loading">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {Array.from({ length: itemsPerView }).map((_, index) => (
            <div 
              key={index} 
              className="neon-carousel-card rounded-2xl p-6 text-center animate-pulse w-full max-w-sm"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="w-20 sm:w-24 h-20 sm:h-24 mx-auto mb-4 rounded-xl bg-gray-300"></div>
              <div className="h-4 bg-gray-300 rounded mb-3 w-3/4 mx-auto"></div>
              <div className="h-1 bg-gray-300 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const maxIndex = Math.max(0, logos.length - itemsPerView);
  const itemWidth = 100 / itemsPerView;
  const translateValue = currentIndex * itemWidth;

  return (
    <div 
      className="neon-carousel-container w-full max-w-6xl mx-auto px-4 sm:px-6" 
      data-component="neon-logos-carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative">
        {/* Navigation buttons - only show if needed */}
        {logos.length > itemsPerView && (
          <>
            <button 
              className="neon-carousel-nav-left absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-lg z-10"
              onClick={goToPrev}
              disabled={isRTL ? currentIndex >= maxIndex : currentIndex === 0}
              type="button"
              data-carousel-prev
              aria-label={isRTL ? "View next partners" : "View previous partners"}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button 
              className="neon-carousel-nav-right absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-lg z-10"
              onClick={goToNext}
              disabled={isRTL ? currentIndex === 0 : currentIndex >= maxIndex}
              type="button"
              data-carousel-next
              aria-label={isRTL ? "View previous partners" : "View next partners"}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Carousel Container */}
        <div 
          className="overflow-hidden"
          data-carousel-container
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex transition-transform duration-700 ease-out"
            style={{ 
              transform: `translateX(${isRTL ? '' : '-'}${translateValue}%)`,
              direction: isRTL ? 'rtl' : 'ltr'
            }}
            data-carousel-track
          >
            {logos.map((logo, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 px-3 sm:px-4 py-4"
                style={{ width: `${itemWidth}%` }}
              >
                <div className="neon-carousel-card rounded-2xl p-4 sm:p-6 text-center transition-all duration-300 hover:scale-105 w-full">
                  <div className="neon-carousel-logo w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 mx-auto mb-3 sm:mb-4 rounded-xl overflow-hidden flex items-center justify-center">
                    <img 
                      src={logo.image} 
                      alt={logo.label || `Partner company ${index + 1}`}
                      className="object-contain w-full h-full p-2 sm:p-3"
                      loading="lazy"
                      data-logo-image
                    />
                  </div>
                  <h4 className="neon-carousel-name text-xs sm:text-sm font-semibold mb-2 sm:mb-3 truncate">
                    {logo.label || `Partner ${index + 1}`}
                  </h4>
                  <div className="neon-carousel-accent w-full h-1 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress indicators */}
        {logos.length > itemsPerView && (
          <div className="mt-6 sm:mt-8">
            {maxIndex <= 5 ? (
              // Dots for smaller carousels
              <nav className="flex justify-center gap-2" aria-label="Carousel pagination">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                  <button
                    key={index}
                    className={`neon-carousel-indicator w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'active w-6' : ''
                    }`}
                    onClick={() => navigateToIndex(index)}
                    type="button"
                    data-carousel-dot
                    aria-label={`View partners ${index + 1}-${Math.min(index + itemsPerView, logos.length)}`}
                    aria-current={index === currentIndex ? 'true' : 'false'}
                  />
                ))}
              </nav>
            ) : (
              // Progress bar for larger carousels
              <div className="flex justify-center">
                <div className="neon-carousel-progress w-32 sm:w-48 h-1 rounded-full overflow-hidden">
                  <div 
                    className="neon-carousel-progress-fill h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${((currentIndex + 1) / (maxIndex + 1)) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NeonLogosCarousel;
import React, { useState, useEffect } from "react";
import { ImageOff } from "lucide-react";

/**
 * Optimized Image Component
 * Handles lazy loading, loading states, error fallbacks, and smooth transitions.
 *
 * @param {string} src - The source URL of the image.
 * @param {string} alt - Alt text for accessibility.
 * @param {string} className - Classes for the <img> element itself.
 * @param {string} containerClass - Classes for the wrapper div (useful for sizing).
 * @param {string} fallbackSrc - Optional specific image to show on error.
 * @param {boolean} priority - If true, sets loading="eager" (use for above-the-fold images).
 */
const OptimizedImage = ({
  src,
  alt,
  className = "",
  containerClass = "",
  fallbackSrc = "",
  priority = false,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Reset state if the src prop changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setCurrentSrc(src);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div
      className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${containerClass}`}
    >
      {/* 1. Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center animate-pulse bg-gray-200 dark:bg-gray-700 z-10">
          {/* Optional: Add a logo or small icon here if desired */}
        </div>
      )}

      {/* 2. Error State */}
      {hasError && !fallbackSrc ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
          <ImageOff className="w-8 h-8 mb-2" />
          <span className="text-xs">Failed to load</span>
        </div>
      ) : (
        /* 3. Actual Image */
        <img
          src={hasError && fallbackSrc ? fallbackSrc : currentSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onLoad={handleLoad}
          onError={handleError}
          className={`
            w-full h-full object-contain transition-all duration-500 ease-in-out
            ${
              isLoading
                ? "scale-105 blur-sm opacity-0"
                : "scale-100 blur-0 opacity-100"
            }
            ${className}
          `}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;

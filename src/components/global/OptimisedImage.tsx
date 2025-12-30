import { memo } from "react";

/**
 * Props for the OptimizedImage component
 */
interface OptimizedImageProps {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Intrinsic width of the image */
  width?: number;
  /** Intrinsic height of the image */
  height?: number;
  /** Additional CSS classes */
  className?: string;
  /** Whether to prioritize loading (eager vs lazy) */
  priority?: boolean;
  /** Sizes attribute for responsive images */
  sizes?: string;
  /** srcSet for responsive images */
  srcSet?: string;
}

const OptimizedImage = memo(
  ({
    src,
    alt,
    width,
    height,
    className,
    priority = false,
    sizes = "100vw",
    srcSet,
  }: OptimizedImageProps) => {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        sizes={sizes}
        srcSet={srcSet}
        className={`w-full h-auto object-cover ${className ?? ""}`}
      />
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;

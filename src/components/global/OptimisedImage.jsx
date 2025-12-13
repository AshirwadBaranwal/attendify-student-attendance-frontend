import { memo } from "react";

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
  }) => {
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
        className={`w-full h-auto object-cover ${className}`}
      />
    );
  }
);

export default OptimizedImage;

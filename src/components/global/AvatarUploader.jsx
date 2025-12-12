import React, { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import Spinner from "@/components/global/Spinner";

/**
 * Reusable Avatar Uploader Component
 * * @param {string} src - Image URL
 * @param {string} alt - Alt text for image
 * @param {string} fallback - Fallback text (initials)
 * @param {boolean} isLoading - Loading state
 * @param {function} onFileSelect - Callback function (file) => void
 * @param {number} maxSizeMB - Max file size in MB (default 5)
 * @param {string} containerClass - Classes for the wrapper div
 */
const AvatarUploader = ({
  src,
  alt,
  fallback,
  isLoading,
  onFileSelect,
  maxSizeMB = 5,
  accept = "image/png, image/jpeg, image/gif",
  containerClass = "w-28 h-28 md:w-36 md:h-36",
}) => {
  const fileInputRef = useRef(null);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate File Size
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size exceeds ${maxSizeMB}MB`); // Replace with your Toast notification
      return;
    }

    // Pass file back to parent
    if (onFileSelect) {
      onFileSelect(file);
    }

    // Reset input so same file can be selected again if needed
    event.target.value = null;
  };

  return (
    <div className="relative group">
      <Avatar
        className={`${containerClass} border-4 border-white dark:border-gray-900 shadow-lg`}
      >
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback className="text-4xl">{fallback || "U"}</AvatarFallback>
      </Avatar>

      {/* Upload Overlay Button */}
      <button
        onClick={handleEditClick}
        disabled={isLoading}
        className="absolute inset-0 bg-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-60 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Update profile picture"
      >
        {!isLoading && <Camera className="h-8 w-8 text-white" />}
      </button>

      {/* Loading Spinner Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-60 rounded-full flex items-center justify-center">
          <Spinner />
        </div>
      )}

      {/* Hidden Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={accept}
        disabled={isLoading}
      />
    </div>
  );
};

export default AvatarUploader;

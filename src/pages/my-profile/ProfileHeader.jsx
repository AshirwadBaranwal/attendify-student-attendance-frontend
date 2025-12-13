import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCollegeImage,
  updateProfilePicture,
} from "@/redux/features/user/userSlice";
import AvatarUploader from "@/components/global/AvatarUploader";

const ProfileHeader = () => {
  const dispatch = useDispatch();

  // 1. SELECTORS: Split specific fields to prevent unnecessary re-renders
  // Using specific paths prevents the "Profile" component from refreshing when "Banner" changes.
  const profileImageSrc = useSelector(
    (state) => state.user.user?.collegeAdmin?.profilePicture
  );
  const userInitials = useSelector(
    (state) => state.user.user?.collegeAdmin?.name?.charAt(0) || "A"
  );
  const collegeImageSrc = useSelector(
    (state) => state.user.user?.collegeAdmin?.collegeId?.image
  );

  // 2. LOADING STATES: Select them separately so one spinner doesn't trigger both
  const isProfileLoading = useSelector(
    (state) => state.user.updatingProfilePicture // Make sure this matches your Slice state name
  );
  const isBannerLoading = useSelector(
    (state) => state.user.collegeImage?.updatingImage
  );

  // --- Handlers ---

  const handleProfileUpdate = (file) => {
    const previewUrl = URL.createObjectURL(file);
    dispatch(updateProfilePicture({ imageFile: file, previewUrl }));
  };

  const handleCollegeImageUpdate = (file) => {
    const previewUrl = URL.createObjectURL(file);
    dispatch(updateCollegeImage({ imageFile: file, previewUrl }));
  };

  return (
    // relative container
    <div className="relative">
      {/* Banner Section */}
      <div
        className="w-full h-80 bg-gray-100 relative overflow-hidden bg-cover bg-center bg-no-repeat "
        style={{ backgroundImage: `url(${collegeImageSrc})` }}
      >
        {/* Banner Edit Button (Bottom Right) */}
        {/* Fixed: w-15 is invalid in Tailwind by default. Changed to w-16. */}
        <div className="absolute bottom-4 right-4 z-10">
          <AvatarUploader
            containerClass="w-16 h-16"
            src={collegeImageSrc}
            alt="College Banner"
            fallback="C" // Changed to "C" for College
            isLoading={isBannerLoading} // Use specific loading state
            onFileSelect={handleCollegeImageUpdate}
            maxSizeMB={5} // Banners usually need larger size limits
          />
        </div>
      </div>

      {/* Profile Avatar Section (Hanging Over) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
        <AvatarUploader
          src={profileImageSrc}
          alt="Profile"
          fallback={userInitials}
          isLoading={isProfileLoading} // Use specific loading state
          onFileSelect={handleProfileUpdate}
          maxSizeMB={2}
          containerClass="w-32 h-32 border-4 border-white shadow-md rounded-full bg-white"
        />
      </div>
    </div>
  );
};

export default ProfileHeader;

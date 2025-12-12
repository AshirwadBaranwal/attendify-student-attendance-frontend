import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCollegeImage,
  updateProfilePicture,
} from "@/redux/features/user/userSlice";
import AvatarUploader from "@/components/global/AvatarUploader";

const ProfileHeader = () => {
  const { user } = useSelector((state) => state.user);
  const isLoading = useSelector((state) => state.user.updatingProfilePicture);

  const dispatch = useDispatch();

  // For profile Picture

  const handleProfileUpdate = (file) => {
    const previewUrl = URL.createObjectURL(file);
    dispatch(updateProfilePicture({ imageFile: file, previewUrl }));
  };

  const profileImageSrc = user?.collegeAdmin?.profilePicture;
  const userInitials = user?.collegeAdmin?.name?.charAt(0) || "A";

  // For Banner

  const handleCollegeImageUpdate = (file) => {
    const previewUrl = URL.createObjectURL(file);
    dispatch(updateCollegeImage({ imageFile: file, previewUrl }));
  };

  const collegeImageSrc = user?.collegeAdmin?.collegeId?.image;
  const collegeInitials = user?.collegeAdmin?.name?.charAt(0) || "U";

  return (
    <div className="relative">
      {/* Banner Section */}
      <div
        className="w-full h-80 bg-cover bg-no-repeat bg-center  bg-gray-100 relative"
        style={{ backgroundImage: `url(${collegeImageSrc})` }}
      >
        <div className="absolute bottom-0 right-0 ">
          <AvatarUploader
            containerClass="w-15 h-15"
            src={collegeImageSrc}
            alt={user?.collegeAdmin?.name}
            fallback={collegeInitials}
            isLoading={isLoading}
            onFileSelect={handleCollegeImageUpdate}
            maxSizeMB={2}
          />
        </div>
      </div>

      {/* Avatar Section Positioned Absolute */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
        <AvatarUploader
          src={profileImageSrc}
          alt={user?.collegeAdmin?.name}
          fallback={userInitials}
          isLoading={isLoading}
          onFileSelect={handleProfileUpdate}
          maxSizeMB={2}
        />
      </div>
    </div>
  );
};

export default ProfileHeader;

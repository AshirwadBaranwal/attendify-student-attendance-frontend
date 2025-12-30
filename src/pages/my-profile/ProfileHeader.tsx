import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  updateCollegeImage,
  updateProfilePicture,
  selectProfilePicture,
  selectCollegeAdmin,
  selectCollege,
  selectIsUpdatingProfilePicture,
  selectIsUpdatingCollegeImage,
} from "@/redux/features/user/userSlice";
import AvatarUploader from "@/components/global/AvatarUploader";

const ProfileHeader = () => {
  const dispatch = useAppDispatch();

  // Selectors: Split specific fields to prevent unnecessary re-renders
  const profileImageSrc = useAppSelector(selectProfilePicture);
  const collegeAdmin = useAppSelector(selectCollegeAdmin);
  const college = useAppSelector(selectCollege);

  const userInitials = collegeAdmin?.name?.charAt(0) || "A";
  const collegeImageSrc = college?.image;

  // Loading states
  const isProfileLoading = useAppSelector(selectIsUpdatingProfilePicture);
  const isBannerLoading = useAppSelector(selectIsUpdatingCollegeImage);

  // --- Handlers ---
  const handleProfileUpdate = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    dispatch(updateProfilePicture({ imageFile: file, previewUrl }));
  };

  const handleCollegeImageUpdate = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    dispatch(updateCollegeImage({ imageFile: file, previewUrl }));
  };

  return (
    <div className="relative">
      {/* Banner Section */}
      <div
        className="w-full h-80 bg-gray-100 relative overflow-hidden bg-cover bg-center bg-no-repeat "
        style={{ backgroundImage: `url(${collegeImageSrc})` }}
      >
        {/* Banner Edit Button (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-10">
          <AvatarUploader
            containerClass="w-16 h-16"
            src={collegeImageSrc}
            alt="College Banner"
            fallback="C"
            isLoading={isBannerLoading}
            onFileSelect={handleCollegeImageUpdate}
            maxSizeMB={5}
          />
        </div>
      </div>

      {/* Profile Avatar Section (Hanging Over) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
        <AvatarUploader
          src={profileImageSrc}
          alt="Profile"
          fallback={userInitials}
          isLoading={isProfileLoading}
          onFileSelect={handleProfileUpdate}
          maxSizeMB={2}
          containerClass="w-32 h-32 border-4 border-white shadow-md rounded-full bg-white"
        />
      </div>
    </div>
  );
};

export default ProfileHeader;

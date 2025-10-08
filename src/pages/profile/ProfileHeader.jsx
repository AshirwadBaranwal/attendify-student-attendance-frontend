import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import Spinner from "@/components/global/Spinner";
import { updateProfilePicture } from "@/redux/features/user/userSlice";

const ProfileHeader = ({ user, bannerImage }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  // 1. Get the loading state directly from the Redux store
  const isLoading = useSelector((state) => state.user.updatingProfilePicture);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a temporary local URL for the optimistic update
    const previewUrl = URL.createObjectURL(file);

    // 2. Dispatch the Redux thunk with the file and preview URL
    dispatch(updateProfilePicture({ imageFile: file, previewUrl }));
  };

  const handleEditIconClick = () => {
    fileInputRef.current?.click();
  };

  // 3. The image source is always the user object from Redux.
  // It updates instantly on upload because of your optimistic reducer.
  const imageSrc = user?.collegeAdmin?.profilePicture;

  return (
    <div className="relative">
      <div
        className="w-full h-80 bg-cover bg-center rounded-t-lg bg-gray-100 "
        style={{ backgroundImage: `url(${bannerImage})` }}
      />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
        <div className="relative group">
          <Avatar className="w-28 h-28 md:w-36 md:h-36 border-4 border-white dark:border-gray-900 shadow-lg">
            <AvatarImage src={imageSrc} alt={user?.collegeAdmin?.name} />
            <AvatarFallback className="text-4xl">
              {user?.collegeAdmin?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <button
            onClick={handleEditIconClick}
            disabled={isLoading}
            className="absolute inset-0 bg-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-60 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Update profile picture"
          >
            {!isLoading && <Camera className="h-8 w-8 text-white" />}
          </button>
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-60 rounded-full flex items-center justify-center">
              <Spinner />
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/gif"
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default ProfileHeader;

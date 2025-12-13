import AvatarUploader from "@/components/global/AvatarUploader";
import { updateCollegeLogo } from "@/redux/features/user/userSlice";
import { formatDate } from "@/utils/helper/Formatter";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const RightSection = () => {
  const { user } = useSelector((state) => state.user);
  const isLoading = useSelector((state) => state.user.collegeLogo.updatingLogo);

  const dispatch = useDispatch();

  const handleLogoUpdate = (file) => {
    const previewUrl = URL.createObjectURL(file);
    dispatch(updateCollegeLogo({ imageFile: file, previewUrl }));
  };

  const logoSrc = user?.collegeAdmin?.collegeId?.logo;
  const logoInitials = "L";

  const listArray = [
    {
      title: "University",
      value: user?.collegeAdmin?.collegeId?.university,
    },
    {
      title: "Registration No.",
      value: user?.collegeAdmin?.collegeId?.collegeReg,
    },
    {
      title: "Joined On",
      value: formatDate(user?.collegeAdmin?.collegeId?.createdAt),
    },
  ];
  return (
    <div className="py-5 px-8">
      <div className="flex items-center justify-center my-5">
        <AvatarUploader
          containerClass="w-50 h-50"
          src={logoSrc}
          alt={user?.collegeAdmin?.name}
          fallback={logoInitials}
          isLoading={isLoading}
          onFileSelect={handleLogoUpdate}
          maxSizeMB={2}
        />
      </div>
      <h2 className="text-2xl text-center font-semibold">
        {user?.collegeAdmin?.collegeId?.name}
      </h2>
      <p className="text-muted-foreground font-semibold text-center">
        {user?.collegeAdmin?.collegeId?.address}
      </p>
      <div className="border rounded-xl p-3 text-sm bg-card mt-3">
        {listArray.map((item, idx) => {
          return (
            <div
              key={idx}
              className={`flex justify-between py-2 ${
                idx !== listArray.length - 1 ? "border-b" : ""
              }`}
            >
              <span>{item.title} </span>
              <span>{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RightSection;

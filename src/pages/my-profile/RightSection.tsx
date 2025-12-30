import AvatarUploader from "@/components/global/AvatarUploader";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  updateCollegeLogo,
  selectCollegeAdmin,
  selectCollege,
  selectIsUpdatingCollegeLogo,
} from "@/redux/features/user/userSlice";
import { formatDate } from "@/utils/helper/Formatter";

const RightSection = () => {
  const collegeAdmin = useAppSelector(selectCollegeAdmin);
  const college = useAppSelector(selectCollege);
  const isLoading = useAppSelector(selectIsUpdatingCollegeLogo);
  const dispatch = useAppDispatch();

  const handleLogoUpdate = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    dispatch(updateCollegeLogo({ imageFile: file, previewUrl }));
  };

  const logoSrc = college?.logo;
  const logoInitials = "L";

  const listArray = [
    {
      title: "University",
      value: college?.university,
    },
    {
      title: "Registration No.",
      value: college?.collegeReg,
    },
    {
      title: "Joined On",
      value: formatDate(college?.createdAt),
    },
  ];

  return (
    <div className="py-5 px-8">
      <div className="flex items-center justify-center my-5">
        <AvatarUploader
          containerClass="w-50 h-50"
          src={logoSrc}
          alt={collegeAdmin?.name || "College Logo"}
          fallback={logoInitials}
          isLoading={isLoading}
          onFileSelect={handleLogoUpdate}
          maxSizeMB={2}
        />
      </div>
      <h2 className="text-2xl text-center font-semibold">
        {college?.name}
      </h2>
      <p className="text-muted-foreground font-semibold text-center">
        {college?.address}
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

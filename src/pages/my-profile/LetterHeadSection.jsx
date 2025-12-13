import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Printer } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateCollegeLetterHead } from "@/redux/features/user/userSlice";
import AvatarUploader from "@/components/global/AvatarUploader";

const LetterHeadSection = () => {
  const { user } = useSelector((state) => state.user);
  const isLoading = useSelector(
    (state) => state.user.collegeLetterHead.updatingletterHeadImage
  );

  const dispatch = useDispatch();

  const handleLetterHeadUpdate = (file) => {
    const previewUrl = URL.createObjectURL(file);
    dispatch(updateCollegeLetterHead({ imageFile: file, previewUrl }));
  };

  const letterHeadSrc = user?.collegeAdmin?.collegeId?.letterHead;
  const letterHeadInitials = "L";

  return (
    <Card className="rounded-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Printer size={20} /> Letter Head
          </CardTitle>
          <CardDescription>
            Upload image for college letter head
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div
          className="w-full h-30 bg-contain bg-no-repeat bg-center relative"
          style={{ backgroundImage: `url(${letterHeadSrc})` }}
        >
          <div className="absolute top-1/2 right-0 ">
            <AvatarUploader
              containerClass="w-15 h-15"
              src={letterHeadSrc}
              alt={user?.collegeAdmin?.name}
              fallback={letterHeadInitials}
              isLoading={isLoading}
              onFileSelect={handleLetterHeadUpdate}
              maxSizeMB={2}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default LetterHeadSection;

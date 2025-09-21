import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building } from "lucide-react";

const CollegeDetailsTab = ({ college }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building size={20} /> College Information
        </CardTitle>
        <CardDescription>
          Read-only details about your assigned college.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-gray-600">College Name</span>
          <span>{college?.name}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-gray-600">College ID</span>
          <span className="font-mono text-xs bg-gray-100 p-1 rounded">
            {college?._id}
          </span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-gray-600">Address</span>
          <span>{college?.address}</span>
        </div>
        <p className="text-xs text-gray-500 italic pt-4">
          College details are managed by the platform administrator.
        </p>
      </CardContent>
    </Card>
  );
};

export default CollegeDetailsTab;

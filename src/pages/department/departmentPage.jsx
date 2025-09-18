import { Button } from "@/components/ui/button";
import {
  useCreateDepartment,
  useGetDepartmentsByCollege,
} from "@/utils/api/Departments";
import React from "react";
import { useSelector } from "react-redux";

const DepartmentPage = () => {
  const { user } = useSelector((state) => state.user);
  const collegeId = user?.collegeAdmin?.collegeId._id;
  const {
    data: responseData,
    isLoading,
    isError,
    error,
  } = useGetDepartmentsByCollege(collegeId);

  const { mutate: createDepartment, isPending: isCreating } =
    useCreateDepartment();

  if (isLoading) {
    return <div>Loading departments...</div>;
  }

  if (isError) {
    return <div>An error occurred: {error.message}</div>;
  }
  const handleCreate = () => {
    createDepartment({
      name: "BTech",
      academicType: "year",
      collegeId: collegeId, // API likely needs the college ID on creation
      headOfDepartment: {
        name: "Rohit Mishra",
        phone: "8507785550",
      },
    });
  };

  console.log(responseData);
  return (
    <div>
      <Button onClick={handleCreate} disabled={isCreating}>
        {isCreating ? "Creating..." : "➕ Add New Department"}
      </Button>
      <h2>Departments</h2>
      <div>
        {responseData.data.map((item, index) => {
          return <p key={index}>{item.name}</p>;
        })}
      </div>
    </div>
  );
};

export default DepartmentPage;

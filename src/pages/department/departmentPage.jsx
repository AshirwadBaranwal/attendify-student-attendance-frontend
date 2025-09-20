import { Button } from "@/components/ui/button";
import {
  useDeleteDepartment,
  useGetDepartmentsByCollege,
} from "@/utils/api/Departments";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { DataTable } from "@/components/ui/data-table";
import { Pencil, Trash, UserMinus } from "lucide-react";
import Header from "@/components/global/Header";
import { DepartmentModal } from "./departmentModal";
import { formatDate } from "@/utils/helper/Formatter";

const DepartmentPage = () => {
  const { user } = useSelector((state) => state.user);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null); // ✅ for update
  const collegeId = user?.collegeAdmin?.collegeId._id;

  const {
    data: responseData,
    isLoading,
    isError,
    error,
  } = useGetDepartmentsByCollege(collegeId);

  const { mutate: deleteDepartment, isPending: isDeleting } =
    useDeleteDepartment();

  if (isLoading) {
    return <div>Loading departments...</div>;
  }

  if (isError) {
    return <div>An error occurred: {error.message}</div>;
  }

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleOpenUpdate = (department) => {
    setSelectedDepartment(department); // ✅ save row data
    setOpenUpdate(true);
  };

  const handleDelete = (department) => {
    if (window.confirm(`Are you sure you want to delete ${department.name}?`)) {
      deleteDepartment(department._id);
    }
  };

  const columns = [
    {
      accessorKey: "slNo",
      header: "Sl No.",
      cell: ({ row }) => row.index + 1,
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: "Department Name",
      cell: ({ row }) => row.original.name,
    },
    {
      id: "duration",
      header: "Duration",
      cell: ({ row }) =>
        (row.original.duration || "N/A") +
        " " +
        (row.original.academicType || "N/A"),
      enableSorting: false,
    },
    {
      accessorKey: "adminId?.name",
      header: "Admin",
      cell: ({ row }) =>
        row.original.adminId?.name || (
          <p className="text-red-600">Not Assigned</p>
        ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      accessorKey: "headOfDepartment.name",
      header: "HOD Name",
      cell: ({ row }) =>
        row.original.headOfDepartment?.name || (
          <p className="text-red-600">Not Assigned</p>
        ),
    },
    {
      accessorKey: "headOfDepartment.phone",
      header: "HOD Phone",
      cell: ({ row }) => "+91 " + row.original.headOfDepartment?.phone || "N/A",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const department = row.original;

        return (
          <div className="flex space-x-2">
            {/* ✅ Pass row data on edit */}
            <Button
              onClick={() => handleOpenUpdate(department)}
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 text-yellow-600"
            >
              <UserMinus className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className={`h-8 w-8 p-0 text-red-600 ${
                isDeleting && "cursor-not-allowed"
              }`}
              disabled={isDeleting}
              onClick={() => handleDelete(department)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Header />
      <div className="container mx-auto px-5 ">
        <h1 className="text-2xl font-bold  py-3">Department Management</h1>
        <DataTable
          columns={columns}
          data={responseData.data}
          searchPlaceholder="Search departments..."
          actionButton={
            <Button onClick={handleOpenCreate}>Add New Department</Button>
          }
        />
      </div>

      {/* ✅ Create Modal */}
      <DepartmentModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        collegeId={collegeId}
        action="create"
      />

      {/* ✅ Update Modal with selected row */}
      <DepartmentModal
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        collegeId={collegeId}
        action="update"
        initialData={selectedDepartment} // 👈 pass row data
      />
    </div>
  );
};

export default DepartmentPage;

import Header from "@/components/global/Header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  useDeleteAdmin,
  useGetDepartmentAdminsByCollege,
} from "@/utils/api/DepartmentAdmin";
import { formatDate } from "@/utils/helper/Formatter";
import { Pencil, Trash, UserPlus } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AdminModal } from "./AdminCreateModal";
import TableSkeleton from "@/components/global/TableLoading";

const AdminPage = () => {
  const { user } = useSelector((state) => state.user);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null); // ✅ for update
  const collegeId = user?.collegeAdmin?.collegeId._id;
  const collegeAdminName = user?.collegeAdmin?.name;

  // Getting Admins List Data ***********

  const {
    data: responseData,
    isLoading,
    isError,
    error,
  } = useGetDepartmentAdminsByCollege(collegeId);

  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();

  // if (isLoading) {
  //   return <div>Loading departments...</div>;
  // }

  if (isError) {
    return <div>An error occurred: {error.message}</div>;
  }

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleOpenUpdate = (admin) => {
    setSelectedAdmin(admin); // ✅ save row data
    setOpenUpdate(true);
  };

  const handleDelete = (admin) => {
    if (
      window.confirm(`Are you sure you want to delete admin ${admin.name}?`)
    ) {
      deleteAdmin({ collegeId, adminId: admin._id });
    }
  };

  const columns = [
    {
      id: "slNo",
      header: "Sl No.",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Admin Information",
      cell: ({ row }) => {
        const admin = row.original;
        return (
          <div>
            <div className="font-medium">{admin.name}</div>
            <div className="text-sm text-gray-600">{admin.user.email}</div>
          </div>
        );
      },
    },

    {
      accessorKey: "department.name",
      header: "Department",
      cell: ({ row }) =>
        row.original.department.name || (
          <p className="text-red-600">Not Assigned</p>
        ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) =>
        row.original.status === true ? (
          <span className="bg-green-200 text-green-700 rounded-xl px-3 py-0.5 text-xs">
            Active
          </span>
        ) : (
          <span className="bg-red-200 text-red-700 rounded-xl px-3 py-0.5 text-xs ">
            Inactive
          </span>
        ),
    },
    {
      accessorKey: "phone",
      header: "Admin Phone",
      cell: ({ row }) => "+91 " + row.original.phone || "N/A",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const admin = row.original;

        return (
          <div className="flex space-x-2">
            {/* ✅ Pass row data on edit */}
            <Button
              onClick={() => handleOpenUpdate(admin)}
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className={`h-8 w-8 p-0 text-red-600 ${
                isDeleting && "cursor-not-allowed"
              }`}
              disabled={isDeleting}
              onClick={() => handleDelete(admin)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const ColumnsArray = [
    "Sl No.",
    "Admin Information",
    "Department",
    "Status",
    "Admin Phone",
    "Created At",
    "Actions",
  ];

  return (
    <div>
      <Header />
      <div className="container mx-auto px-5 ">
        <h1 className="text-2xl font-bold  py-3">Admins Management</h1>
        {!responseData?.data ? (
          <TableSkeleton ColumnsArray={ColumnsArray} />
        ) : (
          <DataTable
            columns={columns}
            data={responseData?.data}
            searchPlaceholder="Search Admins..."
            actionButton={
              <Button onClick={handleOpenCreate}>Add New Admin</Button>
            }
          />
        )}
      </div>
      {/* ✅ Create Modal */}
      <AdminModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        collegeId={collegeId}
        collegeAdminName={collegeAdminName}
        action="create"
      />

      {/* ✅ Update Modal with selected row */}
      <AdminModal
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        collegeId={collegeId}
        action="update"
        collegeAdminName={collegeAdminName}
        initialData={selectedAdmin} // 👈 pass row data
      />
    </div>
  );
};

export default AdminPage;

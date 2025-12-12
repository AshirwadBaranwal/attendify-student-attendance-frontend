import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  useDeleteAdmin,
  useGetDepartmentAdminsByCollege,
} from "@/utils/api/DepartmentAdmin";

// Global Components
import Header from "@/components/global/Header";
import TableSkeleton from "@/components/global/TableLoading";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";

// Feature Components

import { getAdminColumns } from "./AdminColumns";
import { AdminModal } from "./AdminCreateModal";
import { ConfirmDeleteModal } from "@/components/global/ConfirmDeleteModal";

const AdminPage = () => {
  const { user } = useSelector((state) => state.user);
  const collegeId = user?.collegeAdmin?.collegeId._id;
  const collegeAdminName = user?.collegeAdmin?.name;

  // --- Unified Modal State ---
  // Convention: Manages all modal types and associated data in one object
  const [modalState, setModalState] = useState({
    type: null, // 'create' | 'update' | 'delete'
    data: null,
  });

  // --- API Hooks ---
  const {
    data: responseData,
    isLoading,
    isError,
    error,
  } = useGetDepartmentAdminsByCollege(collegeId);

  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();

  // --- Handlers ---
  const handleClose = () => setModalState({ type: null, data: null });

  const handleCreate = () => setModalState({ type: "create", data: null });

  const handleUpdate = (admin) =>
    setModalState({ type: "update", data: admin });

  const handleConfirmDelete = (admin) =>
    setModalState({ type: "delete", data: admin });

  const executeDelete = () => {
    if (!modalState.data) return;

    deleteAdmin(
      { collegeId, adminId: modalState.data._id },
      {
        onSuccess: () => {
          // toast.success("Admin deleted successfully"); // Optional if API hook doesn't handle toast
          handleClose();
        },
      }
    );
  };

  // --- Columns Configuration ---
  const columns = useMemo(
    () =>
      getAdminColumns(
        handleUpdate, // onEdit
        handleConfirmDelete // onDelete
      ),
    []
  );

  const skeletonColumns = [
    "Sl No.",
    "Admin Information",
    "Department",
    "Status",
    "Admin Phone",
    "Created At",
    "Actions",
  ];

  if (isError) {
    return (
      <div className="p-5 text-red-500">An error occurred: {error.message}</div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-5">
        <div className="flex justify-between items-center py-3">
          <h1 className="text-2xl font-bold">Admins Management</h1>
        </div>

        {isLoading ? (
          <TableSkeleton ColumnsArray={skeletonColumns} />
        ) : (
          <DataTable
            columns={columns}
            data={responseData?.data || []}
            searchPlaceholder="Search Admins..."
            actionButton={<Button onClick={handleCreate}>Add New Admin</Button>}
          />
        )}
      </div>

      {/* --- Modals --- */}

      {/* Create / Update Modal */}
      {/* We reuse the same component, passing 'action' and 'initialData' derived from state */}
      <AdminModal
        open={modalState.type === "create" || modalState.type === "update"}
        onClose={handleClose}
        collegeId={collegeId}
        collegeAdminName={collegeAdminName}
        action={modalState.type === "create" ? "create" : "update"}
        initialData={modalState.data}
      />

      {/* Universal Delete (With Validation) */}
      <ConfirmDeleteModal
        isOpen={modalState.type === "delete"}
        onClose={handleClose}
        onConfirm={executeDelete}
        isLoading={isDeleting}
        title={`Delete ${modalState.data?.name}?`}
        validationString={modalState.data?.name}
        description="This action cannot be undone. This will permanently remove the admin and their data."
      />
    </div>
  );
};

export default AdminPage;

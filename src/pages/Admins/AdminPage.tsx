import { useState, useMemo, useCallback, lazy, Suspense } from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectCollege, selectCollegeAdmin } from "@/redux/features/user/userSlice";
import {
  useDeleteAdmin,
  useGetDepartmentAdminsByCollege,
} from "@/utils/api/DepartmentAdmin";

// Global Components
import Header from "@/components/global/Header";
import TableSkeleton from "@/components/global/TableLoading";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { getAdminColumns } from "./adminColumns";
import type { DepartmentAdmin } from "@/types";

// Lazy imports
const AdminModal = lazy(() =>
  import("./AdminCreateModal").then((module) => ({
    default: module.AdminModal,
  }))
);
const ConfirmDeleteModal = lazy(() =>
  import("@/components/global/ConfirmDeleteModal").then((module) => ({
    default: module.ConfirmDeleteModal,
  }))
);

// Move static data outside component
const SKELETON_COLUMNS = [
  "Sl No.",
  "Admin Information",
  "Department",
  "Status",
  "Admin Phone",
  "Created At",
  "Actions",
];

interface ModalState {
  type: "create" | "update" | "delete" | null;
  data: DepartmentAdmin | null;
}

const AdminPage = () => {
  const college = useAppSelector(selectCollege);
  const collegeAdmin = useAppSelector(selectCollegeAdmin);
  const collegeId = college?._id;
  const collegeAdminName = collegeAdmin?.name;

  const [modalState, setModalState] = useState<ModalState>({
    type: null,
    data: null,
  });

  const {
    data: responseData,
    isLoading,
    isError,
    error,
  } = useGetDepartmentAdminsByCollege(collegeId);

  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();

  const handleClose = useCallback(
    () => setModalState({ type: null, data: null }),
    []
  );

  const handleCreate = useCallback(
    () => setModalState({ type: "create", data: null }),
    []
  );

  const handleUpdate = useCallback(
    (admin: DepartmentAdmin) => setModalState({ type: "update", data: admin }),
    []
  );

  const handleConfirmDelete = useCallback(
    (admin: DepartmentAdmin) => setModalState({ type: "delete", data: admin }),
    []
  );

  const executeDelete = () => {
    if (!modalState.data) return;
    deleteAdmin(
      { collegeId: collegeId!, adminId: modalState.data._id },
      { onSuccess: handleClose }
    );
  };

  const columns = useMemo(
    () => getAdminColumns(handleUpdate, handleConfirmDelete),
    [handleUpdate, handleConfirmDelete]
  );

  if (isError) {
    return (
      <div className="p-5 text-red-500">
        An error occurred: {(error as Error)?.message}
      </div>
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
          <TableSkeleton ColumnsArray={SKELETON_COLUMNS} />
        ) : (
          <DataTable
            columns={columns}
            data={responseData || []}
            searchPlaceholder="Search Admins..."
            actionButton={<Button onClick={handleCreate}>Add New Admin</Button>}
          />
        )}
      </div>

      {modalState.type && (
        <Suspense fallback={null}>
          {(modalState.type === "create" || modalState.type === "update") && (
            <AdminModal
              open={true}
              onClose={handleClose}
              collegeId={collegeId}
              collegeAdminName={collegeAdminName}
              action={modalState.type === "create" ? "create" : "update"}
              initialData={modalState.data}
            />
          )}

          {modalState.type === "delete" && (
            <ConfirmDeleteModal
              isOpen={true}
              onClose={handleClose}
              onConfirm={executeDelete}
              isLoading={isDeleting}
              title={`Delete ${modalState.data?.name}?`}
              validationString={modalState.data?.name}
              description="This action cannot be undone."
            />
          )}
        </Suspense>
      )}
    </div>
  );
};

export default AdminPage;

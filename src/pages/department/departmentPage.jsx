import { useState, useMemo, useCallback, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import {
  useDeleteDepartment,
  useGetDepartmentsByCollege,
} from "@/utils/api/Departments";

// Global Components
import Header from "@/components/global/Header";
import TableSkeleton from "@/components/global/TableLoading";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { getDepartmentColumns } from "./DepartmentColumns";

// 1. Lazy Import Modals (Named Exports)
// We use .then() to handle the named export "{ DepartmentModal }"
const DepartmentModal = lazy(() =>
  import("./departmentModal").then((module) => ({
    default: module.DepartmentModal,
  }))
);

const ConfirmDeleteModal = lazy(() =>
  import("@/components/global/ConfirmDeleteModal").then((module) => ({
    default: module.ConfirmDeleteModal,
  }))
);

// 2. Move static data outside component
const SKELETON_COLUMNS = [
  "Sl No.",
  "Department Name",
  "Duration",
  "Admin",
  "Created At",
  "HOD Name",
  "HOD Phone",
  "Actions",
];

const DepartmentPage = () => {
  const { user } = useSelector((state) => state.user);
  // Added optional chaining (?._id) for safety
  const collegeId = user?.collegeAdmin?.collegeId?._id;

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
  } = useGetDepartmentsByCollege(collegeId);

  const { mutate: deleteDepartment, isPending: isDeleting } =
    useDeleteDepartment();

  // --- Optimized Handlers (useCallback) ---
  const handleClose = useCallback(() => {
    setModalState({ type: null, data: null });
  }, []);

  const handleCreate = useCallback(() => {
    setModalState({ type: "create", data: null });
  }, []);

  const handleUpdate = useCallback((department) => {
    setModalState({ type: "update", data: department });
  }, []);

  const handleConfirmDelete = useCallback((department) => {
    setModalState({ type: "delete", data: department });
  }, []);

  const executeDelete = () => {
    if (!modalState.data) return;

    deleteDepartment(modalState.data._id, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  // --- Columns Configuration ---
  const columns = useMemo(
    () => getDepartmentColumns(handleUpdate, handleConfirmDelete),
    [handleUpdate, handleConfirmDelete] // Dependencies are now stable
  );

  if (isError) {
    return (
      <div className="p-5 text-red-500">
        An error occurred: {error?.message}
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-5">
        <div className="flex justify-between items-center py-3">
          <h1 className="text-2xl font-bold">Department Management</h1>
        </div>

        {isLoading ? (
          <TableSkeleton ColumnsArray={SKELETON_COLUMNS} />
        ) : (
          <DataTable
            columns={columns}
            data={responseData?.data || []}
            searchPlaceholder="Search departments..."
            actionButton={
              <Button onClick={handleCreate}>Add New Department</Button>
            }
          />
        )}
      </div>

      {/* --- Modals (Lazy Loaded) --- */}
      {modalState.type && (
        <Suspense fallback={null}>
          {(modalState.type === "create" || modalState.type === "update") && (
            <DepartmentModal
              open={true}
              onClose={handleClose}
              collegeId={collegeId}
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
              description="This action cannot be undone. This will permanently delete the department and its associated data."
            />
          )}
        </Suspense>
      )}
    </div>
  );
};

export default DepartmentPage;

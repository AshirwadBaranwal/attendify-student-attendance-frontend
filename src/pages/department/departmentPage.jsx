import { useState, useMemo } from "react";
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

// Feature Components
import { DepartmentModal } from "./departmentModal";
import { getDepartmentColumns } from "./DepartmentColumns";
import { ConfirmDeleteModal } from "@/components/global/ConfirmDeleteModal";

const DepartmentPage = () => {
  const { user } = useSelector((state) => state.user);
  const collegeId = user?.collegeAdmin?.collegeId._id;

  // --- Unified Modal State ---
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

  // --- Handlers ---
  const handleClose = () => setModalState({ type: null, data: null });

  const handleCreate = () => setModalState({ type: "create", data: null });

  const handleUpdate = (department) =>
    setModalState({ type: "update", data: department });

  const handleConfirmDelete = (department) =>
    setModalState({ type: "delete", data: department });

  const executeDelete = () => {
    if (!modalState.data) return;

    deleteDepartment(modalState.data._id, {
      onSuccess: () => {
        // toast.success("Department deleted successfully");
        handleClose();
      },
    });
  };

  // --- Columns Configuration ---
  const columns = useMemo(
    () =>
      getDepartmentColumns(
        handleUpdate, // onEdit
        handleConfirmDelete // onDelete
      ),
    []
  );

  const skeletonColumns = [
    "Sl No.",
    "Department Name",
    "Duration",
    "Admin",
    "Created At",
    "HOD Name",
    "HOD Phone",
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
          <h1 className="text-2xl font-bold">Department Management</h1>
        </div>

        {isLoading ? (
          <TableSkeleton ColumnsArray={skeletonColumns} />
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

      {/* --- Modals --- */}

      {/* Create / Update Modal */}
      <DepartmentModal
        open={modalState.type === "create" || modalState.type === "update"}
        onClose={handleClose}
        collegeId={collegeId}
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
        description="This action cannot be undone. This will permanently delete the department and its associated data."
      />
    </div>
  );
};

export default DepartmentPage;

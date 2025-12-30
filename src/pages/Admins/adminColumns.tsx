import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/helper/Formatter";
import { Pencil, Trash } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { DepartmentAdmin } from "@/types";

export const getAdminColumns = (
  onEdit: (admin: DepartmentAdmin) => void,
  onDelete: (admin: DepartmentAdmin) => void
): ColumnDef<DepartmentAdmin>[] => [
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
          <div className="text-sm text-muted-foreground">
            {typeof admin.user === "object" && admin.user?.email
              ? admin.user.email
              : ""}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "department.name",
    header: "Department",
    cell: ({ row }) =>
      typeof row.original.department === "object" &&
      row.original.department?.name ? (
        row.original.department.name
      ) : (
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
    cell: ({ row }) =>
      row.original.phone ? "+91 " + row.original.phone : "N/A",
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
          {/* Edit Button */}
          <Button
            onClick={() => onEdit(admin)}
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          {/* Delete Button */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 text-red-600"
            onClick={() => onDelete(admin)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/helper/Formatter";
import { Pencil, Trash } from "lucide-react";
import React from "react";

export const getDepartmentColumns = (onEdit, onDelete) => [
  {
    id: "slNo",
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
        <p className="text-red-500">Not Assigned</p>
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
        <p className="text-red-500">Not Assigned</p>
      ),
  },
  {
    accessorKey: "headOfDepartment.phone",
    header: "HOD Phone",
    cell: ({ row }) =>
      row.original.headOfDepartment?.phone
        ? "+91 " + row.original.headOfDepartment.phone
        : "N/A",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const department = row.original;

      return (
        <div className="flex space-x-2">
          {/* Edit Button */}
          <Button
            onClick={() => onEdit(department)}
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
            onClick={() => onDelete(department)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useGetDepartmentsByCollege } from "@/utils/api/Departments";
import { useCreateAdmin, useUpdateAdmin } from "@/utils/api/DepartmentAdmin";
import type { DepartmentAdmin } from "@/types";

interface AdminFormData {
  name: string;
  email: string;
  departmentId: string;
  phone: string;
}

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  collegeId?: string;
  collegeAdminName?: string;
  action: "create" | "update";
  initialData: DepartmentAdmin | null;
}

export function AdminModal({
  open,
  onClose,
  collegeId,
  collegeAdminName,
  action,
  initialData,
}: AdminModalProps) {
  const form = useForm<AdminFormData>({
    defaultValues: {
      name: "",
      email: "",
      departmentId: "",
      phone: "",
    },
  });

  // Fetch departments for the select dropdown
  const { data: departmentsResponse, isLoading: isLoadingDepartments } =
    useGetDepartmentsByCollege(collegeId);

  const departmentList = departmentsResponse || [];

  // Reset form when opening, or when switching between create/update
  useEffect(() => {
    if (open) {
      if (action === "update" && initialData) {
        const userEmail =
          typeof initialData.user === "object" ? initialData.user?.email : "";
        const deptId =
          typeof initialData.department === "object"
            ? initialData.department?._id
            : "";
        form.reset({
          name: initialData.name || "",
          email: userEmail || "",
          departmentId: deptId || "",
          phone: initialData.phone || "",
        });
      } else {
        form.reset({
          name: "",
          email: "",
          departmentId: "",
          phone: "",
        });
      }
    }
  }, [initialData, action, open, form]);

  const { mutate: createAdmin, isPending: isCreating } = useCreateAdmin();
  const { mutate: updateAdmin, isPending: isUpdating } = useUpdateAdmin();

  const onSubmit = (formData: AdminFormData) => {
    if (action === "create" && collegeId) {
      createAdmin(
        {
          ...formData,
          collegeId,
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }

    if (action === "update" && initialData) {
      updateAdmin(
        {
          collegeId: collegeId!,
          adminId: initialData._id,
          data: {
            name: formData.name,
            phone: formData.phone,
            departmentId: formData.departmentId,
          },
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {action === "create"
              ? "Create Department Admin"
              : "Update Department Admin"}
          </DialogTitle>
          <DialogDescription>
            {action === "create"
              ? "Fill in the details to invite a new admin."
              : "Edit the admin's information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Admin Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              {...form.register("name")}
              placeholder="Enter admin's full name"
            />
          </div>

          {/* Admin Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              {...form.register("email")}
              placeholder="admin@example.com"
              disabled={action === "update"}
            />
            {action === "update" && (
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed.
              </p>
            )}
          </div>

          {/* Department Select */}
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <Controller
              name="departmentId"
              control={form.control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoadingDepartments}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingDepartments
                          ? "Loading..."
                          : "Select a department"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentList.map((dept) => {
                      const isCurrent =
                        action === "update" &&
                        typeof initialData?.department === "object" &&
                        initialData?.department?._id === dept._id;

                      const isOccupied = !!dept.adminId;
                      const isDisabled = isOccupied && !isCurrent;

                      return (
                        <SelectItem
                          key={dept._id}
                          value={dept._id}
                          disabled={isDisabled}
                          className={isDisabled ? "opacity-50" : ""}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{dept.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Admin Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input
              type="tel"
              {...form.register("phone")}
              placeholder="Enter 10-digit phone number"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? action === "create"
                  ? "Creating..."
                  : "Updating..."
                : action === "create"
                ? "Create & Send Invite"
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

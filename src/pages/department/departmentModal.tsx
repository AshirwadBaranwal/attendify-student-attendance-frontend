import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import {
  useCreateDepartment,
  useUpdateDepartment,
} from "@/utils/api/Departments";
import type { DepartmentPopulated, AcademicType } from "@/types";

interface DepartmentFormData {
  name: string;
  duration: number;
  academicType: AcademicType;
  headOfDepartment: {
    name: string;
    phone: string;
  };
}

interface DepartmentModalProps {
  open: boolean;
  onClose: () => void;
  collegeId: string;
  action: "create" | "update";
  initialData: DepartmentPopulated | null;
}

export function DepartmentModal({
  open,
  onClose,
  collegeId,
  action,
  initialData,
}: DepartmentModalProps) {
  const form = useForm<DepartmentFormData>({
    defaultValues: {
      name: "",
      duration: 1,
      academicType: "year",
      headOfDepartment: { name: "", phone: "" },
    },
  });

  // Reset when opening or switching action
  useEffect(() => {
    if (action === "update" && initialData) {
      form.reset({
        name: initialData.name,
        duration: initialData.duration,
        academicType: initialData.academicType,
        headOfDepartment: {
          name: initialData.headOfDepartment?.name || "",
          phone: initialData.headOfDepartment?.phone || "",
        },
      });
    } else {
      form.reset({
        name: "",
        duration: 1,
        academicType: "year",
        headOfDepartment: { name: "", phone: "" },
      });
    }
  }, [initialData, action, form]);

  const { mutate: createDepartment, isPending: isCreating } =
    useCreateDepartment();
  const { mutate: updateDepartment, isPending: isUpdating } =
    useUpdateDepartment();

  const onSubmit = (data: DepartmentFormData) => {
    const payload = {
      ...data,
      collegeId,
    };
    if (action === "create") {
      createDepartment(payload, {
        onSuccess: () => {
          form.reset({
            name: "",
            duration: 1,
            academicType: "year",
            headOfDepartment: { name: "", phone: "" },
          });
          onClose();
        },
      });
    }
    if (action === "update" && initialData) {
      updateDepartment(
        {
          id: initialData._id,
          data: payload,
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {action === "create" ? "Create Department" : "Update Department"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Department Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input {...form.register("name")} placeholder="" />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <Input
              type="number"
              {...form.register("duration", { valueAsNumber: true })}
              placeholder=""
            />
          </div>

          {/* Academic Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Academic Type
            </label>
            <Select
              onValueChange={(val) => form.setValue("academicType", val as AcademicType)}
              value={form.watch("academicType")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="semester">Semester</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* HOD Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Head of Department (Name)
            </label>
            <Input {...form.register("headOfDepartment.name")} placeholder="" />
          </div>

          {/* HOD Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Head of Department (Phone)
            </label>
            <Input
              {...form.register("headOfDepartment.phone")}
              placeholder=""
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {action === "create" ? (
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create"}
              </Button>
            ) : (
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

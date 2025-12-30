import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchUser, selectIsLoading } from "@/redux/features/user/userSlice";
import OptimizedImage from "@/components/global/OptimisedImage";
import { useCreateCollege } from "@/utils/api/Auth";

// College form validation schema
const collegeSchema = z.object({
  name: z
    .string()
    .min(3, { message: "College name must be at least 3 characters" }),
  university: z
    .string()
    .min(3, { message: "University name must be at least 3 characters" }),
  collegeReg: z
    .string()
    .min(3, { message: "Registration number must be at least 3 characters" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
});

type CollegeFormData = z.infer<typeof collegeSchema>;

const AddCollegePage = () => {
  const loading = useAppSelector(selectIsLoading);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const createCollegeMutation = useCreateCollege();

  const form = useForm<CollegeFormData>({
    resolver: zodResolver(collegeSchema),
    defaultValues: {
      name: "",
      university: "",
      collegeReg: "",
      address: "",
    },
  });

  if (loading) {
    return null;
  }

  const onSubmit = async (data: CollegeFormData) => {
    createCollegeMutation.mutate(data, {
      onSuccess: () => {
        dispatch(fetchUser());
        navigate("/");
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side Image */}
      <div className="relative max-h-screen overflow-hidden hidden md:flex md:w-1/2 items-center justify-center bg-gray-50">
        {/* Floating Logo Header */}
        <div className="absolute top-8 left-8 space-x-2 flex items-center justify-center z-10">
          <div className="w-6 h-6">
            <OptimizedImage
              src="/logo.png"
              alt="Attendify Logo"
              width={32}
              height={32}
            />
          </div>
          <span className="text-xl font-semibold text-gray-800 drop-shadow-md">
            Attendify
          </span>
        </div>

        {/* Main Background Image */}
        <div className="w-full h-full">
          <OptimizedImage
            src="/Auth_Image.png"
            alt="College Registration Visual"
            width={800}
            height={1000}
            priority={true}
            className="h-full"
          />
        </div>
      </div>

      {/* Right Side Form */}
      <div className="max-h-screen overflow-y-auto w-full md:w-1/2 flex flex-col justify-center items-center px-6 bg-gray-100 py-10">
        <h2 className="text-2xl font-bold">Register Your College</h2>
        <p className="mb-6 text-gray-500">
          Attendify: Your smart attendance partner
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-lg space-y-4 rounded-xl p-8 bg-white shadow-sm"
          >
            <div className="space-y-2">
              <Label htmlFor="name">College Name</Label>
              <Input
                id="name"
                type="text"
                {...form.register("name")}
                placeholder="Enter college name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <Input
                id="university"
                type="text"
                {...form.register("university")}
                placeholder="Enter university name"
              />
              {form.formState.errors.university && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.university.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="collegeReg">Registration Number</Label>
              <Input
                id="collegeReg"
                type="text"
                {...form.register("collegeReg")}
                placeholder="Enter registration number"
              />
              {form.formState.errors.collegeReg && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.collegeReg.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                {...form.register("address")}
                placeholder="Enter college address"
              />
              {form.formState.errors.address && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={createCollegeMutation.isPending}
              className="w-full disabled:opacity-50 mt-4"
            >
              {createCollegeMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Register College"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddCollegePage;

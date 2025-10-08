import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

import { toast } from "sonner";

// UI Components
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { fetchUser } from "@/redux/features/user/userSlice";
import axiosClient from "@/utils/axios/axios";

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

const AddCollegePage = () => {
  const { user, loading } = useSelector((state) => state.user);
  // If loading, show nothing (or could add a loading spinner here)
  if (loading) {
    return null;
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(collegeSchema),
    defaultValues: {
      name: "",
      university: "",
      collegeReg: "",
      address: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await axiosClient.post("/college", data);
      toast.success("College created successfully");

      // Refresh user data to get updated college assignment
      dispatch(fetchUser());

      // Navigate to dashboard
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create college";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side Image */}
      <div className="max-h-screen overflow-hidden hidden md:flex md:w-1/2 items-center justify-center">
        <div className="absolute top-8 left-8 space-x-2 flex items-center justify-center">
          <img src="/logo.png" alt="Attendify" className="w-6 h-6" />
          <span className="text-xl font-semibold text-gray-100">Attendify</span>
        </div>
        <img
          src="/Auth_Image.png"
          alt="College Registration Visual"
          className=""
        />
      </div>

      {/* Right Side Form */}
      <div className="max-h-screen overflow-y-auto w-full md:w-1/2 flex flex-col justify-center items-center px-6 bg-gray-100">
        <h2 className="text-2xl font-bold">Register Your College</h2>
        <p className="mb-6">Attendify: Your smart attendance partner</p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-lg space-y-4 rounded-xl p-8"
          >
            <div>
              <label className="block mb-1 text-sm font-medium">
                College Name
              </label>
              <input
                type="text"
                {...form.register("name")}
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ease-in-out"
                placeholder="Enter college name"
              />
              {form.formState.errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                University
              </label>
              <input
                type="text"
                {...form.register("university")}
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ease-in-out"
                placeholder="Enter university name"
              />
              {form.formState.errors.university && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.university.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-5">
              <div className="w-full">
                <label className="block mb-1 text-sm font-medium">
                  Registration Number
                </label>
                <input
                  type="text"
                  {...form.register("collegeReg")}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ease-in-out"
                  placeholder="Enter registration number"
                />
                {form.formState.errors.collegeReg && (
                  <p className="mt-1 text-sm text-red-500">
                    {form.formState.errors.collegeReg.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Address</label>
              <input
                type="text"
                {...form.register("address")}
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ease-in-out"
                placeholder="Enter college address"
              />
              {form.formState.errors.address && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full disabled:opacity-50 mt-4"
            >
              {isSubmitting ? (
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

import React, { useEffect, useState, useCallback, memo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

// Zod schema for form validation
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Memoized components to prevent unnecessary re-renders
const LogoSection = memo(() => (
  <div className="absolute top-8 left-8 space-x-2 flex items-center justify-center">
    <img src="/logo.png" alt="Attendify" className="w-6 h-6" />
    <span className="text-xl font-semibold text-gray-100">Attendify</span>
  </div>
));

const LeftSideImage = memo(() => (
  <div className="max-h-screen overflow-hidden hidden md:flex md:w-1/2 items-center justify-center bg-primary">
    <LogoSection />
    <img src="/loginpageimage2.svg" alt="Login Visual" className="h-5/6" />
  </div>
));

const WelcomeHeader = memo(() => (
  <div className="text-left mb-8">
    <h2 className="text-4xl font-bold text-gray-800 mb-2">Welcome back.</h2>
    <p className="text-gray-600 text-lg">
      New to Attendify?{" "}
      <button
        type="button"
        onClick={() => console.log("Navigate to register")}
        className="text-primary hover:underline"
      >
        Create an account
      </button>
    </p>
  </div>
));

// Optimized input field component
const InputField = memo(
  ({
    id,
    label,
    type,
    register,
    error,
    placeholder,
    showPassword,
    onTogglePassword,
    isPassword = false,
  }) => (
    <div>
      <label
        htmlFor={id}
        className="block text-gray-700 text-sm font-medium mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && showPassword ? "text" : type}
          {...register(id)}
          className="w-full rounded-md border border-gray-300 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ease-in-out"
          placeholder={placeholder}
        />
        {isPassword && (
          <span
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 transition duration-200 ease-in-out"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  )
);

// Custom Button component to match your Button component
const Button = memo(
  ({ children, disabled, type = "button", className, ...props }) => (
    <button
      type={type}
      disabled={disabled}
      className={`px-4 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out ${className}`}
      {...props}
    >
      {children}
    </button>
  )
);

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form setup with optimized mode
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur", // Only validate on blur to reduce re-renders
    reValidateMode: "onChange", // Re-validate on change after first validation
  });

  // Memoized password toggle handler
  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Memoized forgot password handler
  const handleForgotPassword = useCallback(() => {
    console.log("Open forgot password dialog");
  }, []);

  // Optimized submit handler - clean and simple
  const onSubmit = useCallback(async (data) => {
    console.log("=== LOGIN FORM SUBMISSION ===");
    console.log("📧 Email:", data.email);
    console.log("🔐 Password:", data.password);
    console.log("📊 Form Data:", data);
    console.log("⏰ Timestamp:", new Date().toISOString());
    console.log("================================");

    // Simulate loading state
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("✅ Login simulation completed");
      console.log("🎉 Login successful!");
    } catch (error) {
      console.error("❌ Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background font-inter">
      {/* Left Side: Image and Decorative Elements */}
      <LeftSideImage />

      {/* Right Side: Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-10">
        <div className="w-full max-w-lg space-y-6 rounded-3xl p-10">
          {/* Welcome Text */}
          <WelcomeHeader />

          {/* Login Form */}
          <div className="space-y-6">
            {/* Email Input */}
            <InputField
              id="email"
              label="Email"
              type="email"
              register={register}
              error={errors.email}
              placeholder="Enter your email address"
            />

            {/* Password Input */}
            <InputField
              id="password"
              label="Password"
              type="password"
              register={register}
              error={errors.password}
              placeholder="Maybe try 'Open Sesame'?"
              showPassword={showPassword}
              onTogglePassword={togglePassword}
              isPassword={true}
            />

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-primary hover:underline text-sm font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

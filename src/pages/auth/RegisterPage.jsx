import React, { useState, useCallback, memo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import OTPModal from "@/components/auth/OTPModal";
import { useDispatch, useSelector } from "react-redux";
import {
  register as registerUser,
  verifyOTP,
  resendOTP,
  clearError,
} from "@/redux/features/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
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
    <img src="/registerpageimage.svg" alt="Login Visual" className="h-5/6" />
  </div>
));

const PageHeader = memo(() => (
  <div className="text-center mb-6">
    <h2 className="text-2xl font-bold">Create Your Account On Attendify</h2>
    <p>Attendify: Your smart attendance partner</p>
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
    className = "",
  }) => (
    <div className={className}>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <div className="relative">
        <input
          type={isPassword && showPassword ? "text" : type}
          {...register(id)}
          className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 ease-in-out"
          placeholder={placeholder}
        />
        {isPassword && (
          <span
            onClick={onTogglePassword}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
      className={`px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out ${className}`}
      {...props}
    >
      {children}
    </button>
  )
);

const LoginLink = memo(() => (
  <p className="text-center text-sm text-gray-600">
    Already have an account?{" "}
    <Link to="/login" className="text-primary hover:underline">
      Login
    </Link>
  </p>
));

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get state from Redux
  const { registering, verifying, error, registeredEmail } = useSelector(
    (state) => state.user
  );

  // Open OTP modal when registration is successful
  useEffect(() => {
    if (registeredEmail) {
      setIsModalOpen(true);
    }
  }, [registeredEmail]);

  // Close modal and clear any errors
  const closeModal = () => {
    setIsModalOpen(false);
    dispatch(clearError());
  };

  // React Hook Form setup with optimized mode
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onBlur", // Only validate on blur to reduce re-renders
    reValidateMode: "onChange", // Re-validate on change after first validation
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Memoized password toggle handler
  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Handle OTP input change
  const handleOtpChange = useCallback((otp) => {
    setOtpValue(otp);
  }, []);

  // Handle OTP verification
  const handleVerifyOtp = useCallback(() => {
    if (otpValue.length === 6 && registeredEmail) {
      dispatch(verifyOTP({ email: registeredEmail, otp: otpValue }))
        .unwrap()
        .then(() => {
          // THIS BLOCK IS LIKELY NOT RUNNING
          navigate("/");
        })
        .catch((err) => {
          // Error is handled by the reducer and displayed in the UI
        });
    } else {
      toast.error("Please enter a valid 6-digit OTP");
    }
  }, [otpValue, registeredEmail, dispatch, navigate]);

  // Handle resend OTP
  const handleResendOtp = useCallback(() => {
    if (registeredEmail) {
      dispatch(resendOTP(registeredEmail));
    }
  }, [registeredEmail, dispatch]);

  // Submit handler for registration
  const onSubmit = useCallback(
    async (data) => {
      // Remove confirmPassword as it's not needed for the API
      const { confirmPassword, ...registrationData } = data;

      dispatch(registerUser(registrationData));
    },
    [dispatch]
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side Image */}
      <LeftSideImage />

      {/* Right Side Form */}
      <div className="max-h-screen overflow-y-auto w-full md:w-1/2 flex flex-col justify-center items-center px-6 bg-gray-100">
        <PageHeader />

        <div className="w-full max-w-lg space-y-4 rounded-xl p-8">
          {/* Error Alert */}
          {/* {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center" role="alert">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error?.message || "An error occurred during registration"}</span>
            </div>
          )} */}

          {/* Name Field */}
          <InputField
            id="name"
            label="Full Name"
            type="text"
            register={register}
            error={errors.name}
            placeholder="Your name"
          />

          {/* Email Field */}
          <InputField
            id="email"
            label="Email"
            type="email"
            register={register}
            error={errors.email}
            placeholder="you@example.com"
          />

          {/* Phone Field */}
          <InputField
            id="phone"
            label="Phone"
            type="tel"
            register={register}
            error={errors.phone}
            placeholder="Your phone number"
          />

          {/* Password Fields Container */}
          <div className="flex items-center gap-5">
            <InputField
              id="password"
              label="Password"
              type="password"
              register={register}
              error={errors.password}
              placeholder="••••••••"
              showPassword={showPassword}
              onTogglePassword={togglePassword}
              isPassword={true}
            />

            <InputField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              register={register}
              error={errors.confirmPassword}
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={registering}
            className="w-full disabled:opacity-50"
          >
            {registering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </Button>

          {/* Login Link */}
          <LoginLink />
        </div>
      </div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={isModalOpen}
        onClose={closeModal}
        useCase="register"
        onOtpChange={handleOtpChange}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        isVerifying={verifying}
        email={registeredEmail}
      />
    </div>
  );
}

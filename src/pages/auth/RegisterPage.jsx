import React, {
  useState,
  useCallback,
  memo,
  useEffect,
  lazy,
  Suspense,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
// 1. Lazy Import the Modal
const OTPModal = lazy(() => import("@/components/auth/OTPModal"));

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

// --- Optimized Components ---

const LogoSection = memo(() => (
  <div className="absolute top-8 left-8 space-x-2 flex items-center justify-center">
    {/* Added dimensions to prevent CLS */}
    <img
      src="/logo.png"
      alt="Attendify"
      className="w-6 h-6"
      width="24"
      height="24"
    />
    <span className="text-xl font-semibold text-gray-100">Attendify</span>
  </div>
));

const LeftSideImage = memo(() => (
  <div className="max-h-screen overflow-hidden hidden md:flex md:w-1/2 items-center justify-center bg-primary">
    <LogoSection />
    {/* Added LCP optimization & dimensions */}
    <img
      src="/registerpageimage.svg"
      alt="Register Visual"
      className="h-5/6 w-auto object-contain"
      width="600"
      height="800"
      fetchPriority="high"
    />
  </div>
));

const PageHeader = memo(() => (
  <div className="text-center mb-6">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
      Create Your Account On Attendify
    </h2>
    <p className="text-gray-600 dark:text-gray-400">
      Attendify: Your smart attendance partner
    </p>
  </div>
));

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
      <label
        htmlFor={id} // Added htmlFor for accessibility
        className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id} // Ensure ID matches htmlFor
          type={isPassword && showPassword ? "text" : type}
          {...register(id)}
          className="w-full rounded-md px-4 py-2 outline-none transition duration-200 ease-in-out
            border border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder={placeholder}
        />
        {isPassword && (
          <span
            onClick={onTogglePassword}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  )
);

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
  <p className="text-center text-sm text-gray-600 dark:text-gray-400">
    Already have an account?{" "}
    <Link
      to="/login"
      className="text-primary hover:underline dark:text-primary/90"
    >
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

  const { registering, verifying, registeredEmail } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (registeredEmail) {
      setIsModalOpen(true);
    }
  }, [registeredEmail]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    dispatch(clearError());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleOtpChange = useCallback((otp) => {
    setOtpValue(otp);
  }, []);

  const handleVerifyOtp = useCallback(() => {
    if (otpValue.length === 6 && registeredEmail) {
      dispatch(verifyOTP({ email: registeredEmail, otp: otpValue }))
        .unwrap()
        .then(() => {
          navigate("/");
        })
        .catch((err) => {
          // Error handling
        });
    } else {
      toast.error("Please enter a valid 6-digit OTP");
    }
  }, [otpValue, registeredEmail, dispatch, navigate]);

  const handleResendOtp = useCallback(() => {
    if (registeredEmail) {
      dispatch(resendOTP(registeredEmail));
    }
  }, [registeredEmail, dispatch]);

  const onSubmit = useCallback(
    async (data) => {
      const { confirmPassword, ...registrationData } = data;
      dispatch(registerUser(registrationData));
    },
    [dispatch]
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LeftSideImage />

      <div className="max-h-screen overflow-y-auto w-full md:w-1/2 flex flex-col justify-center items-center px-6 bg-gray-100 dark:bg-gray-950 transition-colors duration-200">
        <PageHeader />

        <div className="w-full max-w-lg space-y-4 rounded-xl p-8">
          <InputField
            id="name"
            label="Full Name"
            type="text"
            register={register}
            error={errors.name}
            placeholder="Your name"
          />

          <InputField
            id="email"
            label="Email"
            type="email"
            register={register}
            error={errors.email}
            placeholder="you@example.com"
          />

          <InputField
            id="phone"
            label="Phone"
            type="tel"
            register={register}
            error={errors.phone}
            placeholder="Your phone number"
          />

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
              className="w-1/2"
            />

            <InputField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              register={register}
              error={errors.confirmPassword}
              placeholder="••••••••"
              className="w-1/2"
            />
          </div>

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

          <LoginLink />
        </div>
      </div>

      {/* 2. Wrap Modal in Suspense */}
      <Suspense fallback={null}>
        {isModalOpen && (
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
        )}
      </Suspense>
    </div>
  );
}

import React, {
  useEffect,
  useState,
  useCallback,
  memo,
  lazy,
  Suspense,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  verifyOTP,
  resendOTP,
  clearError,
} from "@/redux/features/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import OptimizedImage from "@/components/global/OptimisedImage";

// 1. Lazy Load Modals
const OTPModal = lazy(() => import("@/components/auth/OTPModal"));
const ForgotPasswordModal = lazy(() =>
  import("@/components/auth/ForgotPasswordModal")
);

// Zod schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// --- Optimized Image Components ---

const LogoSection = memo(() => (
  <div className="absolute top-8 left-8 space-x-2 flex items-center justify-center">
    {/* Wrapper ensures strict size (24px) */}
    <div className="w-6 h-6">
      <OptimizedImage
        src="/logo.png"
        alt="Attendify"
        width={24}
        height={24}
        // Logo is small but critical for layout stability
        priority={true}
      />
    </div>
    <span className="text-xl font-semibold text-gray-100">Attendify</span>
  </div>
));

const LeftSideImage = memo(() => (
  <div className="max-h-screen overflow-hidden hidden md:flex md:w-1/2 items-center justify-center bg-primary relative">
    <LogoSection />

    {/* Container to control the height of the illustration (5/6 of screen) */}
    <div className="h-5/6 w-full flex items-center justify-center p-8">
      <OptimizedImage
        src="/loginpageimage.svg"
        alt="Login Visual"
        width={600}
        height={800}
        priority={true}
        // CRITICAL: We use '!' to override the default 'object-cover' and 'w-full'
        // because illustrations should usually be 'contained' so they aren't cropped.
        className="!w-auto !h-full !object-contain"
      />
    </div>
  </div>
));

const WelcomeHeader = memo(() => (
  <div className="text-left mb-8">
    <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
      Welcome back.
    </h2>
    <p className="text-gray-600 dark:text-gray-400 text-lg">
      New to Attendify?{" "}
      <Link
        to="/register"
        className="text-primary hover:underline dark:text-primary/90"
      >
        Create an account
      </Link>
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
  }) => (
    <div>
      <label
        htmlFor={id}
        className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && showPassword ? "text" : type}
          {...register(id)}
          className="w-full rounded-md px-4 py-3 pr-12 outline-none transition duration-200 ease-in-out
            border border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder={placeholder}
        />
        {isPassword && (
          <span
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer
              text-gray-500 dark:text-gray-400
              hover:text-gray-700 dark:hover:text-gray-200
              transition duration-200 ease-in-out"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
      className={`px-4 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out ${className}`}
      {...props}
    >
      {children}
    </button>
  )
);

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loggingIn, verifying, unverifiedEmail } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (unverifiedEmail) {
      setIsModalOpen(true);
    }
  }, [unverifiedEmail]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    dispatch(clearError());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleForgotPassword = useCallback(() => {
    setIsForgotPasswordOpen(true);
  }, []);

  const handleOtpChange = useCallback((otp) => {
    setOtpValue(otp);
  }, []);

  const handleVerifyOtp = useCallback(() => {
    if (otpValue.length === 6 && unverifiedEmail) {
      dispatch(verifyOTP({ email: unverifiedEmail, otp: otpValue }))
        .unwrap()
        .then(() => {
          setIsModalOpen(false);
          navigate("/");
        })
        .catch((err) => {
          // handled by redux error state
        });
    } else {
      toast.error("Please enter a valid 6-digit OTP");
    }
  }, [otpValue, unverifiedEmail, dispatch, navigate]);

  const handleResendOtp = useCallback(() => {
    if (unverifiedEmail) {
      dispatch(resendOTP(unverifiedEmail));
    }
  }, [unverifiedEmail, dispatch]);

  const onSubmit = useCallback(
    (data) => {
      dispatch(login(data))
        .unwrap()
        .then(() => {
          navigate("/");
        })
        .catch((rejectedValue) => {
          console.error("Login rejected:", rejectedValue);
        });
    },
    [dispatch, navigate]
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background font-inter">
      <LeftSideImage />

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-6 max-h-screen overflow-auto bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
        <div className="w-full max-w-lg space-y-6 rounded-3xl p-10">
          <WelcomeHeader />

          <div className="space-y-6">
            <InputField
              id="email"
              label="Email"
              type="email"
              register={register}
              error={errors.email}
              placeholder="Enter your email address"
            />

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

            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-primary hover:underline text-sm font-medium dark:text-primary/90"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={loggingIn}
              className="w-full"
            >
              {loggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        {isModalOpen && (
          <OTPModal
            isOpen={isModalOpen}
            onClose={closeModal}
            useCase="login"
            onOtpChange={handleOtpChange}
            onVerify={handleVerifyOtp}
            onResend={handleResendOtp}
            isVerifying={verifying}
            email={unverifiedEmail}
          />
        )}

        {isForgotPasswordOpen && (
          <ForgotPasswordModal
            isOpen={isForgotPasswordOpen}
            onClose={() => setIsForgotPasswordOpen(false)}
          />
        )}
      </Suspense>
    </div>
  );
}

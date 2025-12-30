import {
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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  register as registerUser,
  verifyOTP,
  resendOTP,
  clearError,
  selectIsRegistering,
  selectIsVerifying,
  selectRegisteredEmail,
} from "@/redux/features/user/userSlice";
import OptimizedImage from "@/components/global/OptimisedImage";

// Lazy Import the Modal
const OTPModal = lazy(() => import("@/components/auth/OTPModal"));

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/\d/, "Password must include a number")
      .regex(/[@$!%*?&]/, "Password must include a special character (@$!%*?&)"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// --- Optimized Components ---

const LogoSection = memo(() => (
  <div className="absolute top-8 left-8 space-x-2 flex items-center justify-center">
    <div className="w-6 h-6">
      <OptimizedImage
        src="/logo.png"
        alt="Attendify"
        width={24}
        height={24}
        priority={true}
      />
    </div>
    <span className="text-xl font-semibold text-gray-100">Attendify</span>
  </div>
));
LogoSection.displayName = "LogoSection";

const LeftSideImage = memo(() => (
  <div className="max-h-screen overflow-hidden hidden md:flex md:w-1/2 items-center justify-center bg-primary relative">
    <LogoSection />
    <div className="h-5/6 w-full flex items-center justify-center p-8">
      <OptimizedImage
        src="/registerpageimage.svg"
        alt="Register Visual"
        width={600}
        height={800}
        priority={true}
        className="!w-auto !h-full !object-contain"
      />
    </div>
  </div>
));
LeftSideImage.displayName = "LeftSideImage";

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
PageHeader.displayName = "PageHeader";

interface InputFieldProps {
  id: keyof RegisterFormData;
  label: string;
  type: string;
  register: ReturnType<typeof useForm<RegisterFormData>>["register"];
  error?: { message?: string };
  placeholder: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  isPassword?: boolean;
  className?: string;
}

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
  }: InputFieldProps) => (
    <div className={className}>
      <label
        htmlFor={id}
        className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
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
InputField.displayName = "InputField";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = memo(
  ({ children, disabled, type = "button", className, ...props }: ButtonProps) => (
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
Button.displayName = "Button";

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
LoginLink.displayName = "LoginLink";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const registering = useAppSelector(selectIsRegistering);
  const verifying = useAppSelector(selectIsVerifying);
  const registeredEmail = useAppSelector(selectRegisteredEmail);

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
  } = useForm<RegisterFormData>({
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

  const handleOtpChange = useCallback((otp: string) => {
    setOtpValue(otp);
  }, []);

  const handleVerifyOtp = useCallback(() => {
    if (otpValue.length === 6 && registeredEmail) {
      dispatch(verifyOTP({ email: registeredEmail, otp: otpValue }))
        .unwrap()
        .then(() => {
          navigate("/");
        })
        .catch(() => {
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
    async (data: RegisterFormData) => {
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

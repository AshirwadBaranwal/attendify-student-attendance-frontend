import React, { useState, useCallback, memo, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, ArrowLeft, CheckCircle, Shield } from "lucide-react";

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "Please enter the complete 6-digit OTP")
    .max(6, "OTP must be exactly 6 digits"),
});

// Memoized components to prevent unnecessary re-renders
const LogoSection = memo(() => (
  <div className="absolute top-6 left-6 space-x-2 flex items-center justify-center">
    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
      <Shield className="w-4 h-4 text-white" />
    </div>
    <span className="text-lg font-semibold text-gray-100">Attendify</span>
  </div>
));

const LeftSideImage = memo(() => (
  <div className="max-h-screen overflow-hidden hidden md:flex md:w-1/2 items-center justify-center bg-primary">
    <LogoSection />
    <img src="/loginpageimage.svg" alt="Login Visual" className="h-5/6" />
  </div>
));

const PageHeader = memo(({ email }) => (
  <div className="text-left mb-6">
    <div className="flex items-center mb-3">
      <button
        onClick={() => console.log("Navigate back")}
        className="mr-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        aria-label="Go back"
      >
        <ArrowLeft className="w-4 h-4 text-gray-600" />
      </button>
      <h1 className="text-2xl font-bold text-gray-900">Verify your email</h1>
    </div>
    <div className="flex items-start space-x-3">
      <div className="mt-0.5 p-2 bg-blue-50 rounded-lg">
        <Mail className="w-4 h-4 text-blue-600" />
      </div>
      <div className="flex-1">
        <p className="text-gray-600 text-sm leading-relaxed">
          We've sent a 6-digit verification code to
        </p>
        <p className="text-gray-900 font-medium text-sm break-all">{email}</p>
        <p className="text-gray-500 text-xs mt-1">
          Enter the code below to verify your account.
        </p>
      </div>
    </div>
  </div>
));

// Individual OTP input component with enhanced styling
const OTPInput = memo(
  ({ index, value, onChange, onKeyDown, onPaste, inputRefs, hasError }) => (
    <input
      ref={(el) => (inputRefs.current[index] = el)}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={1}
      value={value}
      onChange={(e) => onChange(index, e.target.value)}
      onKeyDown={(e) => onKeyDown(index, e)}
      onPaste={onPaste}
      className={`
      w-11 h-11 text-center text-lg font-semibold
      border-2 rounded-xl transition-all duration-200 ease-in-out
      focus:outline-none focus:scale-105
      ${
        hasError
          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
          : value
          ? "border-green-400 bg-green-50 text-green-800 focus:border-green-500 focus:ring-2 focus:ring-green-200"
          : "border-gray-200 bg-gray-50 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      }
    `}
      aria-label={`Digit ${index + 1} of 6`}
    />
  )
);

// Resend code component with improved styling
const ResendSection = memo(({ countdown, onResend, canResend }) => (
  <div className="text-center space-y-2">
    <p className="text-gray-600 text-sm">Didn't receive the code?</p>
    {canResend ? (
      <button
        onClick={onResend}
        className="text-blue-600 hover:text-blue-700 font-medium text-sm underline decoration-2 underline-offset-2 transition-colors duration-200"
      >
        Resend verification code
      </button>
    ) : (
      <p className="text-gray-500 text-sm">
        Resend code in{" "}
        <span className="font-semibold text-blue-600">{countdown}s</span>
      </p>
    )}
  </div>
));

// Enhanced Button component
const Button = memo(
  ({ children, disabled, type = "button", className = "", ...props }) => (
    <button
      type={type}
      disabled={disabled}
      className={`
        w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 
        text-white rounded-xl font-semibold text-sm
        transition-all duration-200 ease-in-out
        transform hover:scale-[1.02] active:scale-[0.98]
        shadow-lg hover:shadow-xl
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
);

export default function OTPVerification() {
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const email = "user@example.com"; // This would come from props or context

  // React Hook Form setup
  const {
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
  });

  const hasError = Boolean(errors.otp);

  // Initialize input refs
  useEffect(() => {
    inputRefs.current = Array(6).fill(null);
    // Auto-focus first input on mount
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, []);

  // Countdown timer for resend functionality
  useEffect(() => {
    let timer;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  // Enhanced OTP change handler with better auto-navigation
  const handleOTPChange = useCallback(
    (index, value) => {
      // Only allow single digit
      if (value.length > 1) {
        value = value.slice(-1);
      }

      // Only allow digits
      if (!/^\d*$/.test(value)) return;

      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      // Update form value and clear errors
      const otpString = newOtpValues.join("");
      setValue("otp", otpString);
      if (hasError && otpString.length >= 1) {
        clearErrors("otp");
      }

      // Enhanced auto-navigation
      if (value) {
        // Find next empty input or move to next input
        const nextEmptyIndex = newOtpValues.findIndex(
          (val, i) => i > index && !val
        );
        const targetIndex =
          nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(index + 1, 5);

        if (targetIndex <= 5) {
          setTimeout(() => {
            inputRefs.current[targetIndex]?.focus();
          }, 10);
        }
      }
    },
    [otpValues, setValue, hasError, clearErrors]
  );

  // Enhanced keyboard navigation
  const handleKeyDown = useCallback(
    (index, e) => {
      if (e.key === "Backspace") {
        if (!otpValues[index] && index > 0) {
          // Move to previous input if current is empty
          const newOtpValues = [...otpValues];
          newOtpValues[index - 1] = "";
          setOtpValues(newOtpValues);
          setValue("otp", newOtpValues.join(""));
          inputRefs.current[index - 1]?.focus();
        } else if (otpValues[index]) {
          // Clear current input
          const newOtpValues = [...otpValues];
          newOtpValues[index] = "";
          setOtpValues(newOtpValues);
          setValue("otp", newOtpValues.join(""));
        }
      }

      // Arrow key navigation
      if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === "ArrowRight" && index < 5) {
        e.preventDefault();
        inputRefs.current[index + 1]?.focus();
      }

      // Enter key to submit if OTP is complete
      if (e.key === "Enter" && otpValues.join("").length === 6) {
        e.preventDefault();
        handleSubmit(onSubmit)();
      }
    },
    [otpValues, setValue, handleSubmit]
  );
  
  // Enhanced paste handler
  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);

      if (pastedData.length > 0) {
        const newOtpValues = [...otpValues];
        const digits = pastedData.split("");

        digits.forEach((digit, i) => {
          if (i < 6) {
            newOtpValues[i] = digit;
          }
        });

        setOtpValues(newOtpValues);
        setValue("otp", newOtpValues.join(""));
        clearErrors("otp");

        // Focus last filled input or next empty input
        const lastIndex = Math.min(digits.length - 1, 5);
        setTimeout(() => {
          inputRefs.current[lastIndex]?.focus();
        }, 10);
      }
    },
    [otpValues, setValue, clearErrors]
  );

  // Handle resend OTP
  const handleResend = useCallback(() => {
    console.log("🔄 Resending OTP to:", email);
    setCanResend(false);
    setCountdown(90);
    setOtpValues(["", "", "", "", "", ""]);
    setValue("otp", "");
    clearErrors("otp");
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, [email, setValue, clearErrors]);

  // Enhanced submit function
  const onSubmit = useCallback(
    async (data) => {
      console.log("=== OTP VERIFICATION SUBMISSION ===");
      console.log("📧 Email:", email);
      console.log("🔐 Entered OTP:", data.otp);
      console.log("📊 OTP Array:", otpValues);
      console.log("⏰ Timestamp:", new Date().toISOString());
      console.log("====================================");

      setLoading(true);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("✅ OTP verification successful!");
      } catch (error) {
        console.error("❌ OTP verification error:", error);
      } finally {
        setLoading(false);
      }
    },
    [email, otpValues]
  );

  const isFormValid = otpValues.join("").length === 6;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left Side Image */}
      <LeftSideImage />

      {/* Right Side Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-8">
        <div className="w-full max-w-md space-y-6 bg-white rounded-2xl p-8  ">
          {/* Header */}
          <PageHeader email={email} />

          {/* OTP Input Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* OTP Input Grid */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-3">
                Verification Code
              </label>
              <div className="flex justify-center space-x-2 mb-2">
                {otpValues.map((value, index) => (
                  <OTPInput
                    key={index}
                    index={index}
                    value={value}
                    onChange={handleOTPChange}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    inputRefs={inputRefs}
                    hasError={hasError}
                  />
                ))}
              </div>
              {hasError && (
                <p className="text-xs text-red-500 text-center mt-2 animate-pulse">
                  {errors.otp.message}
                </p>
              )}
            </div>

            {/* Verify Button */}
            <Button type="submit" disabled={loading || !isFormValid}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify Account
                </>
              )}
            </Button>

            {/* Resend Section */}
            <ResendSection
              countdown={countdown}
              onResend={handleResend}
              canResend={canResend}
            />

            {/* Help Text */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Having trouble? Check your spam folder or{" "}
                <button
                  type="button"
                  onClick={() => console.log("Contact support")}
                  className="text-blue-600 hover:text-blue-700 underline transition-colors duration-200"
                >
                  contact support
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

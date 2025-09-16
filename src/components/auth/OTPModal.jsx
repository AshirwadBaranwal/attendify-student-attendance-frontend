// OtpModal.js
import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

// Content is defined outside the component to prevent re-creation on each render
const contentMap = {
  register: {
    title: "✅ Verify Your Account",
    description:
      "A 6-digit code has been sent to your email. Please enter it to complete registration.",
  },
  login: {
    title: "🔐 Verification Required",
    description:
      "Your account is not verified. Please enter the OTP sent to your email to log in.",
  },
  forgotPassword: {
    title: "🔑 Reset Your Password",
    description:
      "Enter the 6-digit code sent to your email to proceed with resetting your password.",
  },
};

const OTP_LENGTH = 6;

const OtpModal = ({
  isOpen,
  onClose,
  useCase = "register",
  onOtpChange,
  onVerify,
  onResend,
  isVerifying = false,
  email,
}) => {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef([]);

  const currentContent = contentMap[useCase] || contentMap.register;

  // Reset OTP and focus on the first input when the modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp(new Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  // Call onOtpChange when OTP changes
  useEffect(() => {
    if (onOtpChange) {
      onOtpChange(otp.join(""));
    }
  }, [otp, onOtpChange]);

  const handleChange = useCallback(
    (element, index) => {
      // Ensure only numbers are entered
      if (isNaN(element.value)) return;

      const newOtp = [...otp];
      newOtp[index] = element.value;
      setOtp(newOtp);

      // Move to the next input field if a digit is entered
      if (element.value && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp]
  );

  const handleKeyDown = useCallback(
    (e, index) => {
      // Move focus to the previous input on backspace if current is empty
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (pastedData.length === OTP_LENGTH && !isNaN(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      inputRefs.current[OTP_LENGTH - 1]?.focus(); // Focus the last input
    }
  }, []);

  const handleSubmit = useCallback(() => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length === OTP_LENGTH) {
      if (onVerify) {
        onVerify();
      }
    } else {
      alert("❌ Please enter a complete 6-digit OTP.");
    }
  }, [otp, onVerify]);

  // Don't render the modal if it's not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-60">
      <div className="relative w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold">{currentContent.title}</h2>
        <p className="mb-6 mt-2 text-gray-600">{currentContent.description}</p>

        {email && (
          <p className="mb-4 text-sm text-gray-500">
            Code sent to: <span className="font-medium">{email}</span>
          </p>
        )}

        <div
          className="mb-8 flex justify-center gap-2 sm:gap-4"
          onPaste={handlePaste}
        >
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="h-10 w-10 rounded-sm border border-gray-300 text-center text-xl font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              disabled={isVerifying}
            />
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full py-5 mb-3"
          disabled={isVerifying}
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </Button>

        {onResend && (
          <button
            type="button"
            onClick={onResend}
            className="text-sm text-primary hover:underline"
            disabled={isVerifying}
          >
            Didn't receive the code? Resend
          </button>
        )}
      </div>
    </div>
  );
};

// Export the memoized component
export default memo(OtpModal);

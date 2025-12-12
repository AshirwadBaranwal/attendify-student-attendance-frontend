import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";

import { toast } from "sonner"; // Assuming sonner is used for toasts
// FIX: Changed aliased path to a relative path assuming a common file structure

import { useSelector, useDispatch } from "react-redux";
import { changePassword } from "@/redux/features/user/userSlice";

const PasswordInputWithToggle = ({ id, label, value, onChange, isPending }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Determine if the input should be 'text' (visible) or 'password' (hidden)
  const inputType = showPassword ? "text" : "password";

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <div className="col-span-3 relative">
        <Input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          className="pr-10" // Add padding to make space for the toggle button
          required
          disabled={isPending}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-1/2 -translate-y-1/2 h-full px-3 hover:bg-transparent text-gray-500"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          disabled={isPending}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </Button>
      </div>
    </div>
  );
};

const ChangePasswordModal = ({ children }) => {
  // Initialize dispatch function
  const dispatch = useDispatch();

  const { changingPassword: isPending, changePasswordError } = useSelector(
    (state) => state.user
  );

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.id]: e.target.value,
    });
  };

  // Make the function async and dispatch the thunk correctly
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmNewPassword } = passwords;

    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirm new password must match.");
      return;
    }

    // Simple length validation
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    // Dispatch the thunk and await the result
    const resultAction = await dispatch(
      changePassword({ currentPassword, newPassword })
    );

    // Only close and reset form if the dispatch was successful
    if (changePassword.fulfilled.match(resultAction)) {
      setIsOpen(false);
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger button provided by the parent component */}
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock size={20} /> Change Password
          </DialogTitle>
          <DialogDescription>
            Update your account password. You will need your current password to
            proceed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Current Password Field */}
            <PasswordInputWithToggle
              id="currentPassword"
              label="Current Password"
              value={passwords.currentPassword}
              onChange={handleChange}
              isPending={isPending}
            />

            {/* New Password Field */}
            <PasswordInputWithToggle
              id="newPassword"
              label="New Password"
              value={passwords.newPassword}
              onChange={handleChange}
              isPending={isPending}
            />

            {/* Confirm New Password Field */}
            <PasswordInputWithToggle
              id="confirmNewPassword"
              label="Confirm New"
              value={passwords.confirmNewPassword}
              onChange={handleChange}
              isPending={isPending}
            />
            {changePasswordError && (
              <p className="text-sm text-red-600 mt-2">
                {changePasswordError?.message || "An unknown error occurred."}
              </p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Changing..." : "Change Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;

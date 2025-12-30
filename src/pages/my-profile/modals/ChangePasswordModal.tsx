import { useState, type ChangeEvent, type FormEvent } from "react";
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
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  changePassword,
  selectIsChangingPassword,
} from "@/redux/features/user/userSlice";

interface PasswordInputWithToggleProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isPending: boolean;
}

const PasswordInputWithToggle = ({
  id,
  label,
  value,
  onChange,
  isPending,
}: PasswordInputWithToggleProps) => {
  const [showPassword, setShowPassword] = useState(false);
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
          className="pr-10"
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

interface ChangePasswordModalProps {
  children: React.ReactNode;
}

const ChangePasswordModal = ({ children }: ChangePasswordModalProps) => {
  const dispatch = useAppDispatch();
  const isPending = useAppSelector(selectIsChangingPassword);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswords({
      ...passwords,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmNewPassword } = passwords;

    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirm new password must match.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    const resultAction = await dispatch(
      changePassword({ currentPassword, newPassword })
    );

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
            <PasswordInputWithToggle
              id="currentPassword"
              label="Current Password"
              value={passwords.currentPassword}
              onChange={handleChange}
              isPending={isPending}
            />

            <PasswordInputWithToggle
              id="newPassword"
              label="New Password"
              value={passwords.newPassword}
              onChange={handleChange}
              isPending={isPending}
            />

            <PasswordInputWithToggle
              id="confirmNewPassword"
              label="Confirm New"
              value={passwords.confirmNewPassword}
              onChange={handleChange}
              isPending={isPending}
            />
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

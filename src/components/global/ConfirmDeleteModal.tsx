import { useEffect, useState, ClipboardEvent } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Props for the ConfirmDeleteModal component
 */
interface ConfirmDeleteModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal open state changes */
  onClose: (open: boolean) => void;
  /** Callback when delete is confirmed */
  onConfirm: () => void;
  /** Modal title */
  title?: string;
  /** Modal description */
  description?: string;
  /** The string the user must type to confirm */
  validationString?: string;
  /** Loading state for the confirm button */
  isLoading?: boolean;
}

export const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone.",
  validationString = "",
  isLoading = false,
}: ConfirmDeleteModalProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Reset input when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setInputValue("");
      setIsCopied(false);
    }
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(validationString);
    setIsCopied(true);
    toast.success("Copied to clipboard");

    // Reset copy icon after 2 seconds
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    setInputValue(pastedText);
  };

  const isMatch = inputValue === validationString;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <AlertDialogTitle className="text-destructive">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Type the following to confirm:
            </Label>

            {/* Copyable Badge Area */}
            <div
              className="relative flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2 font-mono text-sm font-bold tracking-wide text-foreground cursor-pointer hover:bg-muted transition-colors group"
              onClick={handleCopy}
              title="Click to copy"
            >
              <span>{validationString}</span>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                )}
              </button>
            </div>
          </div>

          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Type "${validationString}"`}
            className="focus-visible:ring-destructive"
            onPaste={handlePaste}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} onClick={() => onClose(false)}>
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={!isMatch || isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

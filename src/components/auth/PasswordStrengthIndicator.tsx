import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Lowercase letter (a-z)", test: (p) => /[a-z]/.test(p) },
  { label: "Uppercase letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
  { label: "Number (0-9)", test: (p) => /\d/.test(p) },
  { label: "Special character (@$!%*?&)", test: (p) => /[@$!%*?&]/.test(p) },
];

type StrengthLevel = "empty" | "weak" | "fair" | "good" | "strong";

const STRENGTH_CONFIG: Record<StrengthLevel, { label: string; color: string; bgColor: string }> = {
  empty: { label: "", color: "bg-gray-200", bgColor: "bg-gray-100" },
  weak: { label: "Weak", color: "bg-red-500", bgColor: "bg-red-50" },
  fair: { label: "Fair", color: "bg-orange-500", bgColor: "bg-orange-50" },
  good: { label: "Good", color: "bg-yellow-500", bgColor: "bg-yellow-50" },
  strong: { label: "Strong", color: "bg-green-500", bgColor: "bg-green-50" },
};

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const { metRequirements, strength, strengthLevel } = useMemo(() => {
    const results = PASSWORD_REQUIREMENTS.map((req) => ({
      ...req,
      met: req.test(password),
    }));

    const metCount = results.filter((r) => r.met).length;
    const total = PASSWORD_REQUIREMENTS.length;

    let level: StrengthLevel = "empty";
    if (password.length === 0) level = "empty";
    else if (metCount <= 1) level = "weak";
    else if (metCount <= 2) level = "fair";
    else if (metCount <= 4) level = "good";
    else level = "strong";

    return {
      metRequirements: results,
      strength: metCount / total,
      strengthLevel: level,
    };
  }, [password]);

  const config = STRENGTH_CONFIG[strengthLevel];

  if (password.length === 0) {
    return (
      <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
        <p className="text-xs font-medium text-gray-500 mb-2">Password must have:</p>
        <ul className="space-y-1">
          {PASSWORD_REQUIREMENTS.map((req, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                <span className="text-[10px]">{i + 1}</span>
              </div>
              {req.label}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={cn("mt-3 p-3 rounded-lg border transition-colors", config.bgColor, "border-gray-200")}>
      {/* Strength Bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-300", config.color)}
            style={{ width: `${strength * 100}%` }}
          />
        </div>
        <span className={cn(
          "text-xs font-semibold min-w-[50px] text-right",
          strengthLevel === "weak" && "text-red-600",
          strengthLevel === "fair" && "text-orange-600",
          strengthLevel === "good" && "text-yellow-600",
          strengthLevel === "strong" && "text-green-600"
        )}>
          {config.label}
        </span>
      </div>

      {/* Requirements Checklist */}
      <ul className="space-y-1.5">
        {metRequirements.map((req, i) => (
          <li
            key={i}
            className={cn(
              "flex items-center gap-2 text-xs transition-colors",
              req.met ? "text-green-600" : "text-gray-500"
            )}
          >
            <div
              className={cn(
                "w-4 h-4 rounded-full flex items-center justify-center transition-colors",
                req.met ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"
              )}
            >
              {req.met ? <Check size={10} strokeWidth={3} /> : <X size={10} strokeWidth={2} />}
            </div>
            <span className={req.met ? "line-through opacity-70" : ""}>{req.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Hook to check if password meets all requirements
 */
export function usePasswordValid(password: string): boolean {
  return useMemo(
    () => PASSWORD_REQUIREMENTS.every((req) => req.test(password)),
    [password]
  );
}

export default PasswordStrengthIndicator;

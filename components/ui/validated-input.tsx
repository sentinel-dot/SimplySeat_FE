"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, AlertCircle, AlertTriangle } from "lucide-react";

export type ValidationState = "idle" | "valid" | "error" | "warning";

export interface ValidatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  validationState?: ValidationState;
  errorMessage?: string;
  warningMessage?: string;
  successMessage?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  (
    {
      validationState = "idle",
      errorMessage,
      warningMessage,
      successMessage,
      icon,
      rightElement,
      className = "",
      ...props
    },
    ref
  ) => {
    const showError = validationState === "error" && errorMessage;
    const showWarning = validationState === "warning" && warningMessage;
    const showSuccess = validationState === "valid" && successMessage;
    const showMessage = showError || showWarning || showSuccess;

    const borderColorClass =
      validationState === "error"
        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
        : validationState === "warning"
        ? "border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500/20"
        : validationState === "valid"
        ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
        : "border-border focus:border-primary";

    return (
      <div className="relative w-full">
        <div className="relative flex items-center">
          {icon && (
            <div className="pointer-events-none absolute left-3 flex items-center">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "flex h-11 w-full rounded-md border bg-transparent px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-10",
              rightElement && "pr-12",
              borderColorClass,
              className
            )}
            aria-invalid={validationState === "error" ? true : undefined}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center gap-2">
              {rightElement}
            </div>
          )}
          {!rightElement && validationState === "valid" && (
            <div className="absolute right-3 flex items-center">
              <Check className="h-5 w-5 text-green-500" aria-hidden="true" />
            </div>
          )}
        </div>
        {showMessage && (
          <div
            className="mt-1.5 flex items-start gap-1.5 text-sm"
            role="alert"
            aria-live="polite"
          >
            {showError && (
              <>
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
                <span className="text-destructive">{errorMessage}</span>
              </>
            )}
            {showWarning && (
              <>
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-500" aria-hidden="true" />
                <span className="text-yellow-600 dark:text-yellow-500">{warningMessage}</span>
              </>
            )}
            {showSuccess && (
              <>
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-500" aria-hidden="true" />
                <span className="text-green-600 dark:text-green-500">{successMessage}</span>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

ValidatedInput.displayName = "ValidatedInput";

export { ValidatedInput };

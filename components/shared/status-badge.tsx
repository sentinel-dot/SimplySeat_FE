"use client";

import { getStatusLabel, getStatusStyles } from "@/lib/utils/bookingStatus";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: string;
  className?: string;
  /** "badge" = pill style (default), "block" = solid for calendar blocks */
  variant?: "badge" | "block";
};

export function StatusBadge({ status, className, variant = "badge" }: StatusBadgeProps) {
  const styles = getStatusStyles(status, variant);
  const label = getStatusLabel(status);

  if (variant === "block") {
    return (
      <span className={cn("block w-full rounded px-1.5 py-0.5 text-left text-xs truncate text-white", styles, className)}>
        {label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        styles,
        className
      )}
    >
      {label}
    </span>
  );
}

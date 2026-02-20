/** Internal: status → badge (light) and block (solid) Tailwind classes */
const STATUS_STYLES: Record<string, { badge: string; block: string }> = {
  confirmed: { badge: "bg-green-100 text-green-800", block: "bg-green-500" },
  pending: { badge: "bg-yellow-100 text-yellow-800", block: "bg-yellow-500" },
  cancelled: { badge: "bg-red-100 text-red-800", block: "bg-red-500" },
  completed: { badge: "bg-blue-100 text-blue-800", block: "bg-blue-500" },
  no_show: { badge: "bg-gray-100 text-gray-800", block: "bg-gray-500" },
};

const DEFAULT_STYLES = { badge: "bg-gray-100 text-gray-800", block: "bg-gray-400" };

/** Single source for status styles. variant: 'badge' = pill, 'block' = solid (e.g. calendar). */
export function getStatusStyles(status: string, variant: "badge" | "block"): string {
  const s = STATUS_STYLES[status] ?? DEFAULT_STYLES;
  return variant === "block" ? s.block : s.badge;
}

/** Light badge style (e.g. bg-green-100 text-green-800) */
export function getStatusColor(status: string): string {
  return getStatusStyles(status, "badge");
}

/** Solid background for calendar blocks (e.g. bg-green-500) */
export function getStatusColorBlock(status: string): string {
  return getStatusStyles(status, "block");
}

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Bestätigt",
  pending: "Ausstehend",
  cancelled: "Storniert",
  completed: "Abgeschlossen",
  no_show: "Nicht erschienen",
};

export function getStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

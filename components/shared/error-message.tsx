import { Button } from "@/components/ui/button";

export function ErrorMessage({
  title = "Etwas ist schiefgelaufen",
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center shadow-sm"
      role="alert"
    >
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-4">
          Erneut versuchen
        </Button>
      )}
    </div>
  );
}

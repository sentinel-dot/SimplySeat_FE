"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cancelBooking } from "@/lib/api/bookings";
import { Button } from "@/components/ui/button";
import { ManageCard } from "@/components/shared/manage-card";
import { AlertTriangle } from "lucide-react";

type Props = {
  token: string;
  status: string;
  cancellationHours?: number;
};

export function ManageBookingActions({
  token,
  status,
  cancellationHours,
}: Props) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const canCancel = status === "pending" || status === "confirmed";

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await cancelBooking(token, cancelReason || undefined);
      if (res.success) {
        toast.success("Buchung wurde storniert.");
        router.refresh();
        setShowCancelConfirm(false);
        setCancelReason("");
      } else {
        toast.error(res.message ?? "Stornierung fehlgeschlagen.");
      }
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setCancelling(false);
    }
  };

  if (!canCancel) return null;

  return (
    <ManageCard title="Stornierung">
        {!showCancelConfirm ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Sie können diese Buchung kostenfrei stornieren.
              {cancellationHours != null && cancellationHours > 0 && (
                <span className="mt-1 block font-medium text-foreground">
                  Bitte mindestens {cancellationHours} Stunden vor dem Termin.
                </span>
              )}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setShowCancelConfirm(true)}
            >
              Buchung stornieren
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="size-5 shrink-0 text-destructive" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">
                  Buchung wirklich stornieren?
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Diese Aktion kann nicht rückgängig gemacht werden.
                  {cancellationHours != null && cancellationHours > 0 && (
                    <> Stornieren Sie mindestens {cancellationHours} Stunden vor dem Termin.</>
                  )}
                </p>
                <label className="mt-3 block text-sm font-medium text-foreground">
                  Grund (optional)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="z. B. Termin passt nicht mehr"
                  rows={2}
                  className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowCancelConfirm(false);
                      setCancelReason("");
                    }}
                    disabled={cancelling}
                  >
                    Behalten
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleCancel}
                    isLoading={cancelling}
                  >
                    Ja, stornieren
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
    </ManageCard>
  );
}

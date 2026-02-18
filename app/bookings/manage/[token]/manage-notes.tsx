"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateBooking } from "@/lib/api/bookings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, StickyNote } from "lucide-react";

type Props = {
  token: string;
  specialRequests: string;
  status: string;
};

export function ManageBookingNotes({
  token,
  specialRequests,
  status,
}: Props) {
  const router = useRouter();
  const [notes, setNotes] = useState(specialRequests);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const canEdit = status === "pending" || status === "confirmed";
  const hasChanges = notes !== specialRequests;

  const handleSave = async () => {
    if (!hasChanges) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      const res = await updateBooking(token, {
        special_requests: notes.trim() || "",
      });
      if (res.success) {
        toast.success("Notizen gespeichert.");
        router.refresh();
        setEditing(false);
      } else {
        toast.error(res.message ?? "Speichern fehlgeschlagen.");
      }
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (!canEdit && !specialRequests) return null;

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-border bg-muted/30 px-6 py-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <StickyNote className="size-4" />
          Notizen & Wünsche
        </h2>
      </div>
      <div className="p-6">
        {editing && canEdit ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Teilen Sie dem Betrieb Wünsche oder Hinweise mit (z. B. Allergien, besondere Wünsche).
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="z. B. Wünsche, Hinweise für Ihren Termin"
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNotes(specialRequests);
                  setEditing(false);
                }}
                disabled={saving}
              >
                Abbrechen
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                isLoading={saving}
                disabled={!hasChanges || saving}
              >
                Speichern
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <p className="text-sm text-foreground">
              {specialRequests || "Keine Notizen hinterlegt."}
            </p>
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 gap-2"
                onClick={() => setEditing(true)}
              >
                <Pencil className="size-4" />
                Bearbeiten
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

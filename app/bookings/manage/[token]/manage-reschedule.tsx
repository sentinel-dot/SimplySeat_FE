"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateBooking } from "@/lib/api/bookings";
import { getAvailableSlots } from "@/lib/api/availability";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  today,
  addDays,
  formatDateForApi,
  formatDateDisplay,
  formatTimeDisplay,
} from "@/lib/utils/date";
import type { TimeSlot } from "@/lib/types";
import { CalendarClock, Loader2 } from "lucide-react";

type Props = {
  token: string;
  bookingId: number;
  venueId: number;
  serviceId: number;
  currentDate: string;
  currentStartTime: string;
  currentEndTime: string;
  partySize: number;
  status: string;
  bookingAdvanceDays?: number;
  venueName?: string;
  serviceName?: string;
};

export function ManageRescheduleModal({
  token,
  bookingId,
  venueId,
  serviceId,
  currentDate,
  currentStartTime,
  currentEndTime,
  partySize,
  status,
  bookingAdvanceDays = 30,
  venueName,
  serviceName,
}: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(currentDate);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canReschedule = status === "pending" || status === "confirmed";
  const minDate = formatDateForApi(today());
  const maxDate = formatDateForApi(addDays(today(), bookingAdvanceDays));

  useEffect(() => {
    if (!isOpen || !date) return;
    loadSlotsForDate(date);
  }, [date, isOpen]);

  const loadSlotsForDate = async (dateValue: string) => {
    setLoadingSlots(true);
    setSlots([]);
    setSelectedSlot(null);
    try {
      const data = await getAvailableSlots(venueId, serviceId, dateValue, {
        partySize,
        excludeBookingId: bookingId,
      });
      const available = (data.time_slots ?? []).filter((s) => s.available);
      setSlots(available);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedSlot) return;

    if (
      date === currentDate &&
      selectedSlot.start_time === currentStartTime &&
      selectedSlot.end_time === currentEndTime
    ) {
      toast.info("Keine Änderung vorgenommen.");
      setIsOpen(false);
      return;
    }

    setSubmitting(true);
    try {
      const payload: Parameters<typeof updateBooking>[1] = {
        booking_date: date,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
      };
      if (selectedSlot.staff_member_id != null) {
        payload.staff_member_id = selectedSlot.staff_member_id;
      }
      const res = await updateBooking(token, payload);
      if (res.success) {
        toast.success("Termin wurde verschoben.");
        router.refresh();
        setIsOpen(false);
      } else {
        toast.error(res.message ?? "Verschieben fehlgeschlagen.");
      }
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpen = () => {
    setDate(currentDate);
    setSlots([]);
    setSelectedSlot(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (submitting) return;
    setIsOpen(false);
  };

  if (!canReschedule) return null;

  return (
    <>
      <Card className="overflow-hidden">
        <div className="border-b border-border bg-muted/30 px-6 py-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <CalendarClock className="size-4" />
            Termin ändern
          </h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-muted-foreground">
            Möchten Sie einen anderen Tag oder eine andere Uhrzeit? Hier können Sie Ihren Termin verschieben.
          </p>
          <Button
            variant="outline"
            onClick={handleOpen}
            className="mt-4 gap-2"
          >
            <CalendarClock className="size-4" />
            Termin verschieben
          </Button>
        </div>
      </Card>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reschedule-title"
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-border px-6 py-4">
              <h2 id="reschedule-title" className="text-lg font-semibold text-foreground">
                Termin verschieben
              </h2>
              {venueName && serviceName && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {serviceName} · {venueName}
                </p>
              )}
            </div>

            <div className="space-y-4 px-6 py-5">
              <div className="rounded-lg bg-muted/50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Aktueller Termin
                </p>
                <p className="mt-1 font-medium text-foreground">
                  {formatDateDisplay(currentDate)} · {formatTimeDisplay(currentStartTime)}
                </p>
              </div>

              <div className="min-w-0 overflow-hidden">
                <label
                  htmlFor="reschedule-date"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Neues Datum
                </label>
                <input
                  id="reschedule-date"
                  type="date"
                  min={minDate}
                  max={maxDate}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {date && (
                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">
                    Verfügbare Zeiten am {formatDateDisplay(date)}
                  </p>
                  {loadingSlots ? (
                    <div className="flex items-center justify-center rounded-lg border border-border py-10">
                      <Loader2 className="size-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="rounded-lg border border-border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
                      Keine freien Zeiten an diesem Tag. Bitte wählen Sie ein anderes Datum.
                    </div>
                  ) : (
                    <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto rounded-lg border border-border bg-muted/20 p-3 sm:grid-cols-4">
                      {slots.map((slot) => {
                        const isSelected =
                          selectedSlot?.start_time === slot.start_time &&
                          selectedSlot?.staff_member_id === slot.staff_member_id;
                        return (
                          <button
                            key={`${slot.start_time}-${slot.staff_member_id ?? ""}`}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-foreground hover:border-primary hover:bg-primary/10"
                            }`}
                          >
                            {formatTimeDisplay(slot.start_time)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 border-t border-border px-6 py-4">
              <Button
                variant="ghost"
                onClick={handleClose}
                disabled={submitting}
                className="flex-1"
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!selectedSlot || submitting}
                isLoading={submitting}
                className="flex-1"
              >
                Termin verschieben
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

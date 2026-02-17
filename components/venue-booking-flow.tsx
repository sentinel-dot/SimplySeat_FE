"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VenueWithStaff, Service, TimeSlot } from "@/lib/types";
import { getAvailableSlots } from "@/lib/api/availability";
import { createBooking } from "@/lib/api/bookings";
import { useCustomerAuthOptional } from "@/contexts/CustomerAuthContext";
import {
  today,
  addDays,
  formatDateForApi,
  formatDateDisplay,
  formatTimeDisplay,
} from "@/lib/utils/date";

const DEFAULT_PARTY_SIZE = 2;

function getNextDays(count: number, minDate: Date) {
  const days: { date: Date; label: string; dayName: string; dateStr: string }[] = [];
  for (let i = 0; i < count; i++) {
    const d = addDays(minDate, i);
    days.push({
      date: d,
      label: d.toLocaleDateString("de-DE", { month: "short", day: "numeric" }),
      dayName: d.toLocaleDateString("de-DE", { weekday: "short" }),
      dateStr: formatDateForApi(d),
    });
  }
  return days;
}

type Props = {
  venue: VenueWithStaff;
  preselectedServiceId?: string;
  initialDate?: string;
  initialTime?: string;
  initialPartySize?: number;
};

export function VenueBookingFlow({
  venue,
  preselectedServiceId,
  initialDate,
  initialTime,
  initialPartySize,
}: Props) {
  const router = useRouter();
  const auth = useCustomerAuthOptional();
  const { customer, isAuthenticated } = auth ?? { customer: null, isAuthenticated: false };

  const services = (venue.services ?? []).filter((s) => s.is_active !== false);
  const showPartySize = venue.type === "restaurant";
  const minDate = today();
  const maxDate = addDays(today(), venue.booking_advance_days ?? 30);
  const upcomingDays = getNextDays(
    Math.min(14, Math.max(1, Math.floor((maxDate.getTime() - minDate.getTime()) / (24 * 60 * 60 * 1000)))),
    minDate
  );

  const [step, setStep] = useState<1 | 2 | 3 | 4>(
    preselectedServiceId ? 2 : 1
  );
  const [selectedService, setSelectedService] = useState<Service | null>(
    preselectedServiceId
      ? services.find((s) => String(s.id) === preselectedServiceId) || null
      : null
  );
  const [selectedDate, setSelectedDate] = useState<typeof upcomingDays[0] | null>(
    initialDate ? upcomingDays.find((d) => d.dateStr === initialDate) ?? null : null
  );
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState(
    initialPartySize != null ? Math.min(8, Math.max(1, initialPartySize)) : DEFAULT_PARTY_SIZE
  );
  const [specialRequests, setSpecialRequests] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (customer) {
      setName(customer.name ?? "");
      setEmail(customer.email ?? "");
      setPhone(customer.phone ?? "");
    }
  }, [customer]);

  useEffect(() => {
    if (!selectedService || !selectedDate) {
      setSlots([]);
      setSelectedTime(null);
      return;
    }
    setLoadingSlots(true);
    setSelectedTime(null);
    const opts: { partySize?: number } = {};
    if (showPartySize) opts.partySize = partySize;
    else opts.partySize = 1;
    getAvailableSlots(venue.id, selectedService.id, selectedDate.dateStr, opts)
      .then((data) => {
        const available = (data.time_slots ?? []).filter((s) => s.available);
        setSlots(available);
        if (initialTime && available.length > 0) {
          const target = initialTime.length === 5 ? initialTime : `${initialTime.slice(0, 2)}:${initialTime.slice(2, 4)}`;
          const match = available.find((s) => s.start_time === target);
          if (match) setSelectedTime(match);
        }
      })
      .catch((e) => {
        toast.error((e as Error).message);
        setSlots([]);
      })
      .finally(() => setLoadingSlots(false));
  }, [selectedService, selectedDate, partySize, showPartySize, venue.id]);

  const canProceedStep2 = selectedService !== null;
  const canProceedStep3 = selectedDate !== null && selectedTime !== null;
  const canProceedStep4 =
    (isAuthenticated || (name.trim() !== "" && email.trim() !== "")) &&
    (!venue.require_phone || phone.trim() !== "") &&
    (!showPartySize || (partySize >= 1 && partySize <= 8));

  const addressLine = [venue.address, venue.postal_code, venue.city].filter(Boolean).join(", ");

  async function handleConfirm() {
    if (!selectedService || !selectedTime || !selectedDate) return;
    if (!canProceedStep4) return;

    setSubmitting(true);
    try {
      const res = await createBooking({
        venue_id: venue.id,
        service_id: selectedService.id,
        staff_member_id: selectedTime.staff_member_id ?? undefined,
        customer_name: name.trim(),
        customer_email: email.trim(),
        customer_phone: venue.require_phone ? phone.trim() : undefined,
        booking_date: selectedDate.dateStr,
        start_time: selectedTime.start_time,
        end_time: selectedTime.end_time,
        party_size: showPartySize ? partySize : 1,
        special_requests: specialRequests.trim() || undefined,
      });

      if (res.success && res.data?.booking_token) {
        const params = new URLSearchParams({ token: res.data.booking_token });
        if (email.trim()) params.set("email", email.trim());
        router.push(`/bookings/confirmation?${params.toString()}`);
        return;
      }
      toast.error(res.message ?? "Buchung fehlgeschlagen.");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (services.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Derzeit sind keine buchbaren Leistungen hinterlegt.
        </p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href={`/venues/${venue.id}`}>Zurück zu {venue.name}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href={`/venues/${venue.id}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Zurück zu {venue.name}
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
          Termin buchen
        </h1>
        <p className="mt-1 text-muted-foreground">{venue.name}</p>

        {/* Progress Steps */}
        <div className="mt-8 flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 4 && (
                <div
                  className={`h-0.5 flex-1 rounded-full ${step > s ? "bg-primary" : "bg-muted"}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>Dienstleistung</span>
          <span>Datum & Uhrzeit</span>
          <span>Angaben</span>
          <span>Bestätigen</span>
        </div>

        {/* Step 1: Select Service */}
        {step === 1 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-foreground">
              Dienstleistung wählen
            </h2>
            <div className="mt-4 flex flex-col gap-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service);
                    setSelectedDate(null);
                    setSlots([]);
                    setSelectedTime(null);
                    setStep(2);
                  }}
                  className={`flex items-center justify-between rounded-xl border p-5 text-left transition-colors ${
                    selectedService?.id === service.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div>
                    <h3 className="font-semibold text-foreground">{service.name}</h3>
                    {service.description && (
                      <p className="mt-0.5 text-sm text-muted-foreground">{service.description}</p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      <Clock className="mr-1 inline h-3.5 w-3.5" />
                      {service.duration_minutes} Min.
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    {service.price != null && Number(service.price) > 0 ? (
                      <p className="text-lg font-bold text-foreground">
                        {Number(service.price).toFixed(2)} EUR
                      </p>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && selectedService && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-foreground">
              Datum & Uhrzeit wählen
            </h2>

            <div className="mt-4">
              <p className="mb-3 text-sm font-medium text-muted-foreground">
                Datum wählen
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {upcomingDays.map((day) => (
                  <button
                    key={day.dateStr}
                    onClick={() => setSelectedDate(day)}
                    className={`flex shrink-0 flex-col items-center rounded-xl border px-4 py-3 transition-colors ${
                      selectedDate?.dateStr === day.dateStr
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/30"
                    }`}
                  >
                    <span className="text-xs font-medium opacity-70">{day.dayName}</span>
                    <span className="mt-0.5 text-sm font-semibold">{day.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedDate && (
              <div className="mt-6">
                <p className="mb-3 text-sm font-medium text-muted-foreground">
                  Uhrzeit wählen
                </p>
                {loadingSlots ? (
                  <div className="flex items-center justify-center rounded-xl border border-border bg-card py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
                  </div>
                ) : slots.length === 0 ? (
                  <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                    Keine freien Zeiten an diesem Tag. Bitte anderes Datum wählen.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {slots.map((slot) => (
                      <button
                        key={`${slot.start_time}-${slot.staff_member_id ?? ""}`}
                        onClick={() => setSelectedTime(slot)}
                        className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                          selectedTime?.start_time === slot.start_time &&
                          selectedTime?.staff_member_id === slot.staff_member_id
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-foreground hover:border-primary/30"
                        }`}
                      >
                        {slot.start_time.slice(0, 5)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück
              </Button>
              <Button
                disabled={!canProceedStep3}
                onClick={() => setStep(3)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Weiter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Personal Details */}
        {step === 3 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-foreground">Deine Angaben</h2>
            <div className="mt-4 flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Vollständiger Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dein vollständiger Name"
                    disabled={isAuthenticated}
                    className="h-11 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-70"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  E-Mail *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="deine@email.de"
                  disabled={isAuthenticated}
                  className="h-11 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-70"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Telefon {venue.require_phone ? "*" : "(optional)"}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+49 123 456789"
                  className="h-11 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              {showPartySize && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Anzahl Gäste *
                  </label>
                  <select
                    value={partySize}
                    onChange={(e) => setPartySize(Number(e.target.value))}
                    className="h-11 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Gast" : "Gäste"}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Anmerkungen (optional)
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="z. B. Allergien, Wünsche …"
                  rows={2}
                  className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück
              </Button>
              <Button
                disabled={!canProceedStep4}
                onClick={() => setStep(4)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Buchung prüfen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && selectedService && selectedTime && selectedDate && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-foreground">
              Prüfen & Bestätigen
            </h2>
            <div className="mt-4 rounded-xl border border-border bg-card p-6">
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Anbieter
                  </p>
                  <p className="mt-1 font-semibold text-foreground">{venue.name}</p>
                  {addressLine && (
                    <p className="text-sm text-muted-foreground">{addressLine}</p>
                  )}
                </div>
                <div className="h-px bg-border" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Dienstleistung
                  </p>
                  <p className="mt-1 font-semibold text-foreground">{selectedService.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedService.duration_minutes} Min.
                  </p>
                </div>
                <div className="h-px bg-border" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Datum & Uhrzeit
                  </p>
                  <p className="mt-1 font-semibold text-foreground">
                    {selectedDate.dayName}, {selectedDate.label} um {selectedTime.start_time.slice(0, 5)}
                  </p>
                </div>
                <div className="h-px bg-border" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Deine Angaben
                  </p>
                  <p className="mt-1 font-semibold text-foreground">{name}</p>
                  <p className="text-sm text-muted-foreground">{email}</p>
                  {phone && (
                    <p className="text-sm text-muted-foreground">{phone}</p>
                  )}
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Gesamt</p>
                  <p className="text-2xl font-bold text-foreground">
                    {selectedService.price != null && Number(selectedService.price) > 0
                      ? `${Number(selectedService.price).toFixed(2)}`
                      : "–"}
                    <span className="text-sm font-normal text-muted-foreground"> EUR</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={submitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submitting ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Buchung bestätigen
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookingByToken } from "@/lib/api/bookings";
import { getVenueById } from "@/lib/api/venues";
import { SiteLayout } from "@/components/layout/site-layout";
import { ManageBookingActions } from "./manage-actions";
import { ManageBookingNotes } from "./manage-notes";
import { ManageBookingReview } from "./manage-review";
import { ManageRescheduleModal } from "./manage-reschedule";
import {
  ManageQuickActions,
  ManageQuickLinks,
} from "./manage-quick-actions";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Calendar as CalendarIcon,
  User,
  Clock,
  MapPin,
} from "lucide-react";

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props) {
  const { token } = await params;
  const res = await getBookingByToken(token);
  if (!res.success || !res.data)
    return { title: "Buchung verwalten – SimplySeat" };
  return {
    title: `Buchung ${res.data.venue_name ?? ""} – SimplySeat`,
  };
}

function daysUntil(dateStr: string): number | null {
  const d = new Date(dateStr + "T12:00:00");
  const t = new Date();
  d.setHours(0, 0, 0, 0);
  t.setHours(0, 0, 0, 0);
  const diff = Math.ceil((d.getTime() - t.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export default async function ManageBookingPage({ params }: Props) {
  const { token } = await params;
  const res = await getBookingByToken(token);

  if (!res.success || !res.data) notFound();
  const b = res.data;

  const venueRes = await getVenueById(b.venue_id);
  const venue = venueRes.success ? venueRes.data : null;

  const dateDisplay = b.booking_date
    ? new Date(b.booking_date + "T12:00:00").toLocaleDateString("de-DE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  const timeDisplay =
    b.start_time && b.end_time ? `${b.start_time} – ${b.end_time} Uhr` : "";

  const isUpcoming =
    (b.status === "pending" || b.status === "confirmed") &&
    b.booking_date &&
    new Date(b.booking_date + "T23:59:59") >= new Date();
  const daysLeft = b.booking_date ? daysUntil(b.booking_date) : null;

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
          {/* Header */}
          <header className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Buchungsverwaltung
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ihre Buchung
            </h1>
            <p className="mt-2 text-muted-foreground">
              Hier sehen und verwalten Sie Ihre Reservierung.
            </p>
          </header>

          {/* Main booking card */}
          <Card className="mt-8 overflow-hidden border-2 shadow-md">
            <div className="border-b border-border bg-muted/30 px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <StatusBadge status={b.status} className="px-3 py-1" />
                {isUpcoming && daysLeft !== null && daysLeft >= 0 && (
                  <span className="text-sm text-muted-foreground">
                    {daysLeft === 0
                      ? "Heute"
                      : daysLeft === 1
                        ? "Morgen"
                        : `Noch ${daysLeft} Tage`}
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {b.venue_name && (
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-xl">{b.venue_name}</CardTitle>
                    {b.service_name && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {b.service_name}
                        {b.staff_member_name && ` · ${b.staff_member_name}`}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <dl className="mt-6 grid gap-4 sm:grid-cols-1">
                <div className="flex items-center gap-3 rounded-lg bg-muted/40 px-4 py-3">
                  <CalendarIcon className="size-5 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Datum
                    </dt>
                    <dd className="mt-0.5 font-medium text-foreground">
                      {dateDisplay}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted/40 px-4 py-3">
                  <Clock className="size-5 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Uhrzeit
                    </dt>
                    <dd className="mt-0.5 font-medium text-foreground">
                      {timeDisplay}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted/40 px-4 py-3">
                  <User className="size-5 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Gäste
                    </dt>
                    <dd className="mt-0.5 font-medium text-foreground">
                      {b.customer_name}
                      <span className="block text-sm font-normal text-muted-foreground">
                        {b.customer_email}
                      </span>
                    </dd>
                  </div>
                </div>
              </dl>

              {(b.status === "pending" || b.status === "confirmed") && (
                <div className="mt-6 rounded-lg border border-border bg-background/50 p-4">
                  <p className="text-sm font-medium text-foreground">
                    Nützliche Aktionen
                  </p>
                  <div className="mt-3">
                    <ManageQuickActions
                      manageUrl={`/bookings/manage/${token}`}
                      venueId={b.venue_id}
                      venueName={b.venue_name ?? undefined}
                      bookingDate={b.booking_date}
                      startTime={b.start_time}
                      endTime={b.end_time}
                      serviceName={b.service_name ?? undefined}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Notes */}
          <div className="mt-6">
            <ManageBookingNotes
              token={token}
              specialRequests={b.special_requests ?? ""}
              status={b.status}
            />
          </div>

          {/* Reschedule – nur bei pending/confirmed */}
          {venue && (b.status === "pending" || b.status === "confirmed") && (
            <div className="mt-6">
              <ManageRescheduleModal
                token={token}
                bookingId={b.id}
                venueId={b.venue_id}
                serviceId={b.service_id}
                currentDate={b.booking_date}
                currentStartTime={b.start_time}
                currentEndTime={b.end_time}
                partySize={b.party_size}
                status={b.status}
                bookingAdvanceDays={venue.booking_advance_days}
                venueName={b.venue_name ?? undefined}
                serviceName={b.service_name ?? undefined}
              />
            </div>
          )}

          {/* Cancel */}
          <div className="mt-6">
            <ManageBookingActions
              token={token}
              status={b.status}
              cancellationHours={b.cancellation_hours ?? undefined}
            />
          </div>

          {/* Review */}
          <div className="mt-6">
            <ManageBookingReview
              venueId={b.venue_id}
              venueName={b.venue_name ?? undefined}
              status={b.status}
            />
          </div>

          {/* Footer links */}
          <div className="mt-10 border-t border-border pt-8">
            <ManageQuickLinks manageUrl={`/bookings/manage/${token}`} venueId={b.venue_id} />
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

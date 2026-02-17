"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStats } from "@/lib/api/owner";
import type { AdminStats } from "@/lib/types";
import { Card, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";
import { Button } from "@/components/ui/button";

export default function OwnerDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getStats()
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data) setStats(res.data);
        else setError(res.message ?? "Fehler beim Laden.");
      })
      .catch((e) => {
        if (!cancelled) setError((e as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <PageLoader />;
  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }
  if (!stats) return null;

  const s = stats;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Übersicht
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Buchungen, Umsatz und Status Ihres Unternehmens auf einen Blick.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/owner/bookings?status=pending">
          <Button variant="default" size="sm">
            Ausstehende Buchungen
            {s.bookings.pending > 0 && (
              <span className="ml-2 rounded-full bg-white/25 px-2 py-0.5 text-xs">
                {s.bookings.pending}
              </span>
            )}
          </Button>
        </Link>
        <Link href="/owner/bookings">
          <Button variant="outline" size="sm">
            Alle Buchungen
          </Button>
        </Link>
        <Link href="/owner/calendar">
          <Button variant="outline" size="sm">
            Kalender
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardTitle className="text-base font-medium text-muted-foreground">
            Heute
          </CardTitle>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {s.bookings.today} Buchungen
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {s.revenue.today.toFixed(2)} € Umsatz
          </p>
        </Card>
        <Card>
          <CardTitle className="text-base font-medium text-muted-foreground">
            Diese Woche
          </CardTitle>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {s.bookings.thisWeek} Buchungen
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {s.revenue.thisWeek.toFixed(2)} € Umsatz
          </p>
        </Card>
        <Card>
          <CardTitle className="text-base font-medium text-muted-foreground">
            Dieser Monat
          </CardTitle>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {s.bookings.thisMonth} Buchungen
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {s.revenue.thisMonth.toFixed(2)} € Umsatz
          </p>
        </Card>
        <Card>
          <CardTitle className="text-base font-medium text-muted-foreground">
            Statusverteilung
          </CardTitle>
          <div className="mt-2 space-y-1 text-sm">
            <p className="flex justify-between">
              <span className="text-muted-foreground">Ausstehend</span>
              <span className="font-medium text-foreground">{s.bookings.pending}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Bestätigt</span>
              <span className="font-medium text-foreground">{s.bookings.confirmed}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Abgeschlossen</span>
              <span className="font-medium text-foreground">{s.bookings.completed}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Storniert</span>
              <span className="font-medium text-foreground">{s.bookings.cancelled}</span>
            </p>
          </div>
        </Card>
      </div>

      {s.bookings.pending > 0 && (
        <div className="rounded-xl border border-border border-l-4 border-l-orange-500 bg-card p-6 text-foreground shadow-sm">
          <p className="font-medium">
            Sie haben {s.bookings.pending} ausstehende Buchungsanfrage{s.bookings.pending !== 1 ? "n" : ""}.
          </p>
          <Link
            href="/owner/bookings?status=pending"
            className="mt-2 inline-flex items-center text-sm font-medium text-orange-600 underline hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400"
          >
            Jetzt bestätigen oder ablehnen
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}

      {s.popularServices.length > 0 && (
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Beliebte Leistungen</CardTitle>
            <Link
              href="/owner/services"
              className="text-sm font-medium text-primary hover:underline"
            >
              Alle Leistungen
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {s.popularServices.slice(0, 5).map((ps) => (
              <li
                key={ps.service_id}
                className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2"
              >
                <span className="font-medium text-foreground">{ps.service_name}</span>
                <span className="text-sm text-muted-foreground">
                  {ps.booking_count} Buchungen · {ps.total_revenue.toFixed(2)} €
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="bg-secondary/50 border-primary/20">
        <CardTitle className="text-base text-primary">
          Gesamtumsatz (alle Zeiten)
        </CardTitle>
        <p className="mt-2 text-3xl font-bold text-primary">
          {s.revenue.total.toFixed(2)} €
        </p>
      </Card>
    </div>
  );
}

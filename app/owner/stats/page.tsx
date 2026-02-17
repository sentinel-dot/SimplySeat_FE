"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStats } from "@/lib/api/owner";
import type { AdminStats } from "@/lib/types";
import { Card, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";

export default function OwnerStatsPage() {
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
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    );
  }
  if (!stats) return null;

  const s = stats;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Statistik
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Detaillierte Auswertungen zu Buchungen und Umsatz.
          </p>
        </div>
        <Link href="/owner">
          <span className="text-sm font-medium text-primary hover:underline">
            ← Zur Übersicht
          </span>
        </Link>
      </div>

      <Card>
        <CardTitle className="text-lg">Buchungsstatus (Gesamt)</CardTitle>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">Ausstehend</p>
            <p className="text-2xl font-semibold text-foreground">{s.bookings.pending}</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">Bestätigt</p>
            <p className="text-2xl font-semibold text-foreground">{s.bookings.confirmed}</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">Abgeschlossen</p>
            <p className="text-2xl font-semibold text-foreground">{s.bookings.completed}</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">Storniert</p>
            <p className="text-2xl font-semibold text-foreground">{s.bookings.cancelled}</p>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle className="text-lg">Umsatz (abgeschlossene Buchungen)</CardTitle>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">Heute</p>
            <p className="text-2xl font-semibold text-foreground">{s.revenue.today.toFixed(2)} €</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">Diese Woche</p>
            <p className="text-2xl font-semibold text-foreground">{s.revenue.thisWeek.toFixed(2)} €</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">Dieser Monat</p>
            <p className="text-2xl font-semibold text-foreground">{s.revenue.thisMonth.toFixed(2)} €</p>
          </div>
          <div className="rounded-lg border border-primary/30 bg-secondary/50 p-4">
            <p className="text-sm text-primary">Gesamt</p>
            <p className="text-2xl font-bold text-primary">{s.revenue.total.toFixed(2)} €</p>
          </div>
        </div>
      </Card>

      {s.popularServices.length > 0 && (
        <Card>
          <CardTitle className="text-lg">Beliebte Leistungen (abgeschlossene Buchungen)</CardTitle>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Leistung</th>
                  <th className="pb-2 pr-4 font-medium text-right">Buchungen</th>
                  <th className="pb-2 font-medium text-right">Umsatz</th>
                </tr>
              </thead>
              <tbody>
                {s.popularServices.map((ps) => (
                  <tr key={ps.service_id} className="border-b border-border/50">
                    <td className="py-3 pr-4 font-medium text-foreground">{ps.service_name}</td>
                    <td className="py-3 pr-4 text-right text-muted-foreground">{ps.booking_count}</td>
                    <td className="py-3 text-right font-medium text-foreground">
                      {ps.total_revenue.toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {s.popularTimeSlots.length > 0 && (
        <Card>
          <CardTitle className="text-lg">Beliebteste Uhrzeiten (Stunde)</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Nach Anzahl abgeschlossener Buchungen.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            {s.popularTimeSlots.map((slot) => (
              <div
                key={slot.hour}
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2"
              >
                <span className="font-medium text-foreground">
                  {String(slot.hour).padStart(2, "0")}:00
                </span>
                <span className="text-sm text-muted-foreground">
                  {slot.booking_count} Buchungen
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

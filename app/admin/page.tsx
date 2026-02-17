"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminStats } from "@/lib/api/admin";
import type { GlobalStats } from "@/lib/api/admin";
import { Card, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAdminStats()
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Systemübersicht
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Venues, User und Buchungen systemweit verwalten.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/venues">
          <Button variant="default" size="sm">
            Venues verwalten
          </Button>
        </Link>
        <Link href="/admin/users">
          <Button variant="outline" size="sm">
            User verwalten
          </Button>
        </Link>
        <Link href="/admin/customers">
          <Button variant="outline" size="sm">
            Kunden verwalten
          </Button>
        </Link>
        <Link href="/admin/settings">
          <Button variant="outline" size="sm">
            Einstellungen
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link href="/admin/venues" className="block transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded-xl">
          <Card className="h-full border-l-4 border-l-primary cursor-pointer">
            <CardTitle className="text-base font-medium text-muted-foreground">
              Venues
            </CardTitle>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {stats.venues.active} / {stats.venues.total} aktiv
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Anklicken zum Verwalten</p>
          </Card>
        </Link>
        <Link href="/admin/users" className="block transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded-xl">
          <Card className="h-full cursor-pointer">
            <CardTitle className="text-base font-medium text-muted-foreground">
              User
            </CardTitle>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {stats.admins.active} / {stats.admins.total} aktiv
            </p>
            {stats.usersByRole && (
              <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
                <p className="flex justify-between">
                  <span className="text-muted-foreground">System-Admin</span>
                  <span className="font-medium">{stats.usersByRole.admin}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Owner</span>
                  <span className="font-medium">{stats.usersByRole.owner}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Staff</span>
                  <span className="font-medium">{stats.usersByRole.staff}</span>
                </p>
              </div>
            )}
            <p className="mt-3 text-xs text-muted-foreground">Anklicken zum Verwalten</p>
          </Card>
        </Link>
        <Link href="/admin/customers" className="block transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded-xl">
          <Card className="h-full cursor-pointer">
            <CardTitle className="text-base font-medium text-muted-foreground">
              Kunden
            </CardTitle>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {stats.customers?.active || 0} / {stats.customers?.total || 0} aktiv
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Anklicken zum Verwalten</p>
          </Card>
        </Link>
        <Card>
          <CardTitle className="text-base font-medium text-muted-foreground">
            Buchungen
          </CardTitle>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {stats.bookings.total} gesamt
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Diesen Monat: {stats.bookings.thisMonth}
          </p>
          <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
            <p className="flex justify-between">
              <span className="text-muted-foreground">Ausstehend</span>
              <span className="font-medium">{stats.bookings.pending}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Bestätigt</span>
              <span className="font-medium">{stats.bookings.confirmed}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Abgeschlossen</span>
              <span className="font-medium">{stats.bookings.completed}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Storniert</span>
              <span className="font-medium">{stats.bookings.cancelled}</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

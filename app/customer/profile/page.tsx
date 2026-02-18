"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { getProfile, updateProfile, getPreferences, updatePreferences } from "@/lib/api/customers";
import { changePassword } from "@/lib/api/customer-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { VerifiedBadge } from "@/components/customer/VerifiedBadge";
import type { CustomerPreferences } from "@/lib/api/customers";

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex items-center justify-between gap-4">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-muted/50" />
        <div className="h-8 w-24 animate-pulse rounded-full bg-muted/50" />
      </div>
      <p className="mt-2 h-5 w-72 animate-pulse rounded bg-muted/40" />
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-xl bg-muted/40" />
        <div className="h-64 animate-pulse rounded-xl bg-muted/40" />
      </div>
      <div className="mt-6 h-52 animate-pulse rounded-xl bg-muted/40" />
    </div>
  );
}

export default function CustomerProfilePage() {
  const { customer, refreshCustomer } = useCustomerAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [prefs, setPrefs] = useState<CustomerPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setPhone(customer.phone ?? "");
    }
  }, [customer]);

  useEffect(() => {
    Promise.all([getProfile(), getPreferences()])
      .then(([profileRes, prefsRes]) => {
        if (profileRes.success && profileRes.data) {
          setName(profileRes.data.name);
          setPhone(profileRes.data.phone ?? "");
        }
        if (prefsRes.success && prefsRes.data) setPrefs(prefsRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfile({ name, phone });
      if (res.success) {
        toast.success("Profil gespeichert.");
        refreshCustomer();
      } else {
        toast.error(res.message ?? "Speichern fehlgeschlagen.");
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      toast.error("Aktuelles Passwort und neues Passwort (min. 8 Zeichen) eingeben.");
      return;
    }
    setPasswordSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Passwort geändert.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleSavePrefs = async (updates: Partial<CustomerPreferences>) => {
    if (!prefs) return;
    setSaving(true);
    try {
      const res = await updatePreferences(updates);
      if (res.success && res.data) {
        setPrefs(res.data);
        toast.success("Einstellungen gespeichert.");
      } else {
        toast.error(res.message ?? "Speichern fehlgeschlagen.");
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  const initial = (customer?.name ?? "?").charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Page header – aligned with dashboard/bookings */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Profil
          </h1>
          <p className="mt-1 text-muted-foreground">
            Kontodaten und Einstellungen verwalten.
          </p>
        </div>
        {customer?.email_verified === true && <VerifiedBadge verified={true} />}
      </div>

      {/* Profile summary strip */}
      <div className="mt-8 flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-sm">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xl font-semibold text-primary"
          aria-hidden
        >
          {initial}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{customer?.name ?? "—"}</p>
          <p className="truncate text-sm text-muted-foreground">{customer?.email ?? ""}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Persönliche Daten */}
        <Card className="lg:col-span-2">
          <CardTitle className="mb-6 text-lg">Persönliche Daten</CardTitle>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="E-Mail"
                type="email"
                value={customer?.email ?? ""}
                disabled
                className="bg-muted/50"
              />
              <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ihr Name"
              />
              <Input
                label="Telefon"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Optional"
                className="sm:col-span-2"
              />
            </div>
            <div className="pt-2">
              <Button type="submit" isLoading={saving} disabled={saving}>
                Änderungen speichern
              </Button>
            </div>
          </form>
        </Card>

        {/* Einstellungen */}
        {prefs && (
          <Card>
            <CardTitle className="mb-6 text-lg">Einstellungen</CardTitle>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="default-party-size"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Standard-Gästeanzahl
                </label>
                <select
                  id="default-party-size"
                  value={Math.min(8, Math.max(1, prefs.default_party_size))}
                  onChange={(e) =>
                    handleSavePrefs({ default_party_size: Number(e.target.value) })
                  }
                  className="flex h-11 w-full max-w-[8rem] rounded-md border border-border bg-card px-3.5 py-2 text-sm text-foreground transition-shadow focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "Gast" : "Gäste"}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Für mehr als 8 Gäste bitte anrufen.
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/30 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    E-Mail-Benachrichtigungen
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Erinnerungen und Updates zu Buchungen
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={prefs.notification_email}
                  onClick={() =>
                    handleSavePrefs({ notification_email: !prefs.notification_email })
                  }
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 ${
                    prefs.notification_email ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                      prefs.notification_email ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Passwort ändern */}
        <Card>
          <CardTitle className="mb-6 text-lg">Passwort ändern</CardTitle>
          <form onSubmit={handleSavePassword} className="space-y-4">
            <Input
              type="password"
              label="Aktuelles Passwort"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <Input
              type="password"
              label="Neues Passwort (min. 8 Zeichen)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              autoComplete="new-password"
            />
            <div className="pt-2">
              <Button
                type="submit"
                variant="secondary"
                isLoading={passwordSaving}
                disabled={passwordSaving}
              >
                Passwort ändern
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

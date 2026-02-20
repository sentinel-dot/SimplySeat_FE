"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createVenueFull, type CreateVenueFullPayload } from "@/lib/api/admin";
import type { Venue } from "@/lib/types";
import { VENUE_TYPES_ORDER, getVenueTypeLabel } from "@/lib/utils/venueType";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** 0=Sonntag, 1=Mo, … 6=Sa (wie JavaScript Date.getDay() und Backend) */
const DAY_NAMES = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

const defaultVenue = {
  name: "",
  type: "restaurant" as Venue["type"],
  email: "",
  phone: "",
  address: "",
  city: "",
  postal_code: "",
  country: "DE",
  description: "",
  image_url: "",
  website_url: "",
  booking_advance_days: 30,
  booking_advance_hours: 48,
  cancellation_hours: 24,
  require_phone: false,
  require_deposit: false,
  deposit_amount: undefined as number | undefined,
  is_active: true,
};

const defaultOwner = { email: "", password: "", name: "" };

const defaultService = () => ({
  name: "",
  description: "",
  duration_minutes: 60,
  price: undefined as number | undefined,
  capacity: 1,
  requires_staff: false,
});

const defaultOpeningHour = (day: number) => ({
  day_of_week: day,
  start_time: "09:00",
  end_time: "18:00",
});

export default function AdminVenueCreatePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [venue, setVenue] = useState(defaultVenue);
  const [owner, setOwner] = useState(defaultOwner);
  const [services, setServices] = useState<ReturnType<typeof defaultService>[]>([defaultService()]);
  /** Pro Service-Index: soll der Owner diesen Service durchführen? (Default: ja) */
  const [ownerPerformsService, setOwnerPerformsService] = useState<boolean[]>([true]);
  const [openingHours, setOpeningHours] = useState(() =>
    [0, 1, 2, 3, 4, 5, 6].map((d) => defaultOpeningHour(d))
  );

  const addService = () => {
    setServices((s) => [...s, defaultService()]);
    setOwnerPerformsService((o) => [...o, true]);
  };
  const removeService = (i: number) => {
    setServices((s) => (s.length <= 1 ? s : s.filter((_, idx) => idx !== i)));
    setOwnerPerformsService((o) => (o.length <= 1 ? o : o.filter((_, idx) => idx !== i)));
  };
  const updateService = (i: number, field: string, value: string | number | boolean) =>
    setServices((s) => s.map((x, idx) => (idx === i ? { ...x, [field]: value } : x)));
  const setOwnerPerforms = (serviceIndex: number, value: boolean) =>
    setOwnerPerformsService((o) => o.map((v, idx) => (idx === serviceIndex ? value : v)));

  const updateOpeningHour = (dayIndex: number, field: "start_time" | "end_time", value: string) =>
    setOpeningHours((h) =>
      h.map((x) => (x.day_of_week === dayIndex ? { ...x, [field]: value } : x))
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venue.name.trim() || !venue.type || !venue.email.trim()) {
      toast.error("Venue: Name, Typ und E-Mail sind Pflicht.");
      return;
    }
    if (!owner.email.trim() || !owner.password || !owner.name.trim()) {
      toast.error("Owner: E-Mail, Passwort und Name sind Pflicht.");
      return;
    }
    if (owner.password.length < 8) {
      toast.error("Owner-Passwort muss mindestens 8 Zeichen haben.");
      return;
    }

    const validServiceIndices = new Set(
      services
        .map((s, i) => (s.name.trim() && s.duration_minutes >= 1 ? i : -1))
        .filter((i) => i >= 0)
    );
    if (validServiceIndices.size === 0) {
      toast.error("Mindestens ein Service mit Name und Dauer ist erforderlich.");
      return;
    }

    setSaving(true);
    try {
      const payload: CreateVenueFullPayload = {
        venue: {
          name: venue.name.trim(),
          type: venue.type,
          email: venue.email.trim(),
          phone: venue.phone?.trim() || undefined,
          address: venue.address?.trim() || undefined,
          city: venue.city?.trim() || undefined,
          postal_code: venue.postal_code?.trim() || undefined,
          country: venue.country?.trim() || "DE",
          description: venue.description?.trim() || undefined,
          image_url: venue.image_url?.trim() || undefined,
          website_url: venue.website_url?.trim() || undefined,
          booking_advance_days: venue.booking_advance_days ?? 30,
          booking_advance_hours: venue.booking_advance_hours ?? 48,
          cancellation_hours: venue.cancellation_hours ?? 24,
          require_phone: venue.require_phone ?? false,
          require_deposit: venue.require_deposit ?? false,
          deposit_amount: venue.deposit_amount,
          is_active: venue.is_active ?? true,
        },
        owner: {
          email: owner.email.trim(),
          password: owner.password,
          name: owner.name.trim(),
        },
        owner_service_indices: (() => {
          const validIndices = Array.from(validServiceIndices);
          const selected = validIndices.filter((i) => ownerPerformsService[i] !== false);
          return selected.length < validIndices.length ? selected : undefined;
        })(),
        services: services
          .filter((s) => s.name.trim() && s.duration_minutes >= 1)
          .map((s) => ({
            name: s.name.trim(),
            description: s.description?.trim() || undefined,
            duration_minutes: s.duration_minutes,
            price: s.price,
            capacity: s.capacity ?? 1,
            requires_staff: s.requires_staff ?? false,
          })),
        opening_hours: openingHours.filter(
          (oh) => oh.start_time && oh.end_time && oh.start_time < oh.end_time
        ),
      };

      const res = await createVenueFull(payload);
      if (res.success && res.data) {
        toast.success("Venue inkl. Owner, Services und Öffnungszeiten erstellt. Der Owner kann Mitarbeiter im eigenen Dashboard anlegen.");
        router.push("/admin/venues");
        router.refresh();
      } else {
        toast.error(res.message ?? "Fehler beim Erstellen.");
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/venues"
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
        >
          ← Zurück
        </Link>
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Venue anlegen
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Venue inkl. Owner, Services und Öffnungszeiten anlegen. Mitarbeiter legt der Owner in seinem Dashboard an.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Venue */}
        <Card className="p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            1. Venue
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Name *"
              value={venue.name}
              onChange={(e) => setVenue((v) => ({ ...v, name: e.target.value }))}
              required
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Typ *</label>
              <select
                value={venue.type}
                onChange={(e) => setVenue((v) => ({ ...v, type: e.target.value as Venue["type"] }))}
                className="w-full rounded-md border border-border bg-card px-3.5 py-2.5 text-foreground"
              >
                {VENUE_TYPES_ORDER.map((t) => (
                  <option key={t} value={t}>
                    {getVenueTypeLabel(t)}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="E-Mail *"
              type="email"
              value={venue.email}
              onChange={(e) => setVenue((v) => ({ ...v, email: e.target.value }))}
              required
            />
            <Input
              label="Telefon"
              value={venue.phone}
              onChange={(e) => setVenue((v) => ({ ...v, phone: e.target.value }))}
            />
            <Input
              label="Adresse"
              value={venue.address}
              onChange={(e) => setVenue((v) => ({ ...v, address: e.target.value }))}
              className="sm:col-span-2"
            />
            <Input
              label="PLZ"
              value={venue.postal_code}
              onChange={(e) => setVenue((v) => ({ ...v, postal_code: e.target.value }))}
            />
            <Input
              label="Stadt"
              value={venue.city}
              onChange={(e) => setVenue((v) => ({ ...v, city: e.target.value }))}
            />
            <Input
              label="Land"
              value={venue.country}
              onChange={(e) => setVenue((v) => ({ ...v, country: e.target.value }))}
            />
            <Input
              label="Bild-URL"
              type="url"
              value={venue.image_url}
              onChange={(e) => setVenue((v) => ({ ...v, image_url: e.target.value }))}
              placeholder="https://…"
            />
            <Input
              label="Website"
              value={venue.website_url}
              onChange={(e) => setVenue((v) => ({ ...v, website_url: e.target.value }))}
            />
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-foreground">Beschreibung</label>
              <textarea
                value={venue.description}
                onChange={(e) => setVenue((v) => ({ ...v, description: e.target.value }))}
                className="w-full rounded-md border border-border bg-card px-3.5 py-2.5 text-foreground min-h-[80px]"
                rows={3}
              />
            </div>
            <Input
              label="Termine in den nächsten … Tagen buchbar"
              type="number"
              min={1}
              value={venue.booking_advance_days}
              onChange={(e) =>
                setVenue((v) => ({ ...v, booking_advance_days: Number(e.target.value) || 30 }))
              }
            />
            <Input
              label="Buchung Vorlauf (Std)"
              type="number"
              min={0}
              value={venue.booking_advance_hours}
              onChange={(e) =>
                setVenue((v) => ({ ...v, booking_advance_hours: Number(e.target.value) || 48 }))
              }
            />
            <Input
              label="Storno (Std)"
              type="number"
              min={0}
              value={venue.cancellation_hours}
              onChange={(e) =>
                setVenue((v) => ({ ...v, cancellation_hours: Number(e.target.value) || 24 }))
              }
            />
            <label className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                checked={venue.require_phone}
                onChange={(e) => setVenue((v) => ({ ...v, require_phone: e.target.checked }))}
                className="rounded border-border"
              />
              <span className="text-sm text-foreground">Telefon erforderlich</span>
            </label>
            <label className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                checked={venue.require_deposit}
                onChange={(e) => setVenue((v) => ({ ...v, require_deposit: e.target.checked }))}
                className="rounded border-border"
              />
              <span className="text-sm text-foreground">Anzahlung erforderlich</span>
            </label>
            {venue.require_deposit && (
              <Input
                label="Anzahlung (€)"
                type="number"
                min={0}
                step={0.01}
                value={venue.deposit_amount ?? ""}
                onChange={(e) =>
                  setVenue((v) => ({
                    ...v,
                    deposit_amount: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              />
            )}
          </div>
        </Card>

        {/* 2. Owner */}
        <Card className="p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            2. Owner (Dashboard-Login)
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Name *"
              value={owner.name}
              onChange={(e) => setOwner((o) => ({ ...o, name: e.target.value }))}
              required
            />
            <Input
              label="E-Mail *"
              type="email"
              value={owner.email}
              onChange={(e) => setOwner((o) => ({ ...o, email: e.target.value }))}
              required
            />
            <Input
              label="Passwort *"
              type="password"
              value={owner.password}
              onChange={(e) => setOwner((o) => ({ ...o, password: e.target.value }))}
              required
              minLength={8}
              placeholder="Min. 8 Zeichen"
            />
          </div>
        </Card>

        {/* 3. Services */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">
              3. Services
            </h2>
            <Button type="button" variant="outline" size="sm" onClick={addService}>
              + Service
            </Button>
          </div>
          <div className="space-y-4">
            {services.map((s, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-card/50 p-4 space-y-3"
              >
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Service {i + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeService(i)}
                    disabled={services.length <= 1}
                  >
                    Entfernen
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Input
                    label="Name"
                    value={s.name}
                    onChange={(e) => updateService(i, "name", e.target.value)}
                    placeholder="z. B. Haarschnitt"
                  />
                  <Input
                    label="Dauer (Min)"
                    type="number"
                    min={1}
                    value={s.duration_minutes}
                    onChange={(e) =>
                      updateService(i, "duration_minutes", Number(e.target.value) || 60)
                    }
                  />
                  <Input
                    label="Preis (€)"
                    type="number"
                    min={0}
                    step={0.01}
                    value={s.price ?? ""}
                    onChange={(e) =>
                      updateService(i, "price", e.target.value ? Number(e.target.value) : 0)
                    }
                  />
                  <Input
                    label="Kapazität"
                    type="number"
                    min={1}
                    value={s.capacity}
                    onChange={(e) => updateService(i, "capacity", Number(e.target.value) || 1)}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Beschreibung
                    </label>
                    <input
                      value={s.description}
                      onChange={(e) => updateService(i, "description", e.target.value)}
                      className="w-full rounded-md border border-border bg-card px-3 py-2 text-foreground"
                      placeholder="Optional"
                    />
                  </div>
                  <label className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      checked={s.requires_staff}
                      onChange={(e) => updateService(i, "requires_staff", e.target.checked)}
                      className="rounded border-border"
                    />
                    <span className="text-sm text-foreground">Benötigt Mitarbeiter-Zuweisung</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 4. Owner als durchführende Person */}
        <Card className="p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            4. Owner als durchführende Person
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Der Owner wird automatisch als buchbare Person (Staff) angelegt. Wählen Sie, welche
            Services er selbst durchführt; den Rest können später weitere Mitarbeiter übernehmen.
            Der Owner kann das im eigenen Dashboard jederzeit anpassen.
          </p>
          <div className="space-y-2">
            {services.map(
              (s, i) =>
                s.name.trim() &&
                s.duration_minutes >= 1 && (
                  <label
                    key={i}
                    className="flex cursor-pointer items-center gap-2 rounded border border-border px-3 py-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={ownerPerformsService[i] !== false}
                      onChange={(e) => setOwnerPerforms(i, e.target.checked)}
                      className="rounded border-border"
                    />
                    <span className="text-foreground">
                      {s.name}
                      {s.duration_minutes ? ` (${s.duration_minutes} Min)` : ""}
                    </span>
                  </label>
                )
            )}
            {!services.some((s) => s.name.trim() && s.duration_minutes >= 1) && (
              <p className="text-sm text-muted-foreground">
                Bitte zuerst mindestens einen Service mit Name und Dauer anlegen.
              </p>
            )}
          </div>
        </Card>

        {/* 5. Öffnungszeiten */}
        <Card className="p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            5. Öffnungszeiten
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Öffnungszeiten pro Wochentag (Venue-weit). Der Owner erhält diese Zeiten als
            Verfügbarkeit für die von ihm ausgewählten Services. Nur Zeiten mit Start &lt; Ende werden übernommen.
          </p>
          <div className="space-y-3">
            {openingHours.map((oh) => (
              <div
                key={oh.day_of_week}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card/50 px-4 py-3"
              >
                <span className="w-8 font-medium text-foreground">
                  {DAY_NAMES[oh.day_of_week]}
                </span>
                <input
                  type="time"
                  value={oh.start_time}
                  onChange={(e) =>
                    updateOpeningHour(oh.day_of_week, "start_time", e.target.value)
                  }
                  className="rounded-md border border-border bg-card px-3 py-2 text-foreground"
                />
                <span className="text-muted-foreground">–</span>
                <input
                  type="time"
                  value={oh.end_time}
                  onChange={(e) =>
                    updateOpeningHour(oh.day_of_week, "end_time", e.target.value)
                  }
                  className="rounded-md border border-border bg-card px-3 py-2 text-foreground"
                />
              </div>
            ))}
          </div>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" variant="default" disabled={saving}>
            {saving ? "Wird erstellt…" : "Venue anlegen"}
          </Button>
          <Link href="/admin/venues">
            <Button type="button" variant="outline">Abbrechen</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

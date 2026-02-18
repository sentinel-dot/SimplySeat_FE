"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Calendar,
  Copy,
  MapPin,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  manageUrl: string;
  venueId: number;
  venueName?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  serviceName?: string;
};

/** Format for iCal DTSTART/DTEND (local floating: YYYYMMDDTHHMMSS) */
function formatIcsDateTime(dateStr: string, timeStr: string): string {
  const [h, m] = timeStr.split(":").map(Number);
  const y = dateStr.slice(0, 4);
  const mo = dateStr.slice(5, 7);
  const day = dateStr.slice(8, 10);
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${y}${mo}${day}T${hh}${mm}00`;
}

export function ManageQuickActions({
  manageUrl,
  venueId,
  venueName,
  bookingDate,
  startTime,
  endTime,
  serviceName,
}: Props) {
  const [copied, setCopied] = useState(false);

  const fullManageUrl =
    typeof window !== "undefined" ? `${window.location.origin}${manageUrl}` : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullManageUrl);
      setCopied(true);
      toast.success("Link in Zwischenablage kopiert");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Link konnte nicht kopiert werden");
    }
  };

  const handleAddToCalendar = () => {
    const title = [serviceName, venueName].filter(Boolean).join(" – ") || "Buchung SimplySeat";
    const start = formatIcsDateTime(bookingDate, startTime);
    const end = formatIcsDateTime(bookingDate, endTime);
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//SimplySeat//Buchung//DE",
      "BEGIN:VEVENT",
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${title.replace(/\n/g, " ")}`,
      `DESCRIPTION:Buchungsverwaltung: ${fullManageUrl || manageUrl}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SimplySeat-Buchung-${bookingDate}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Kalenderdatei heruntergeladen");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleAddToCalendar}
        className="gap-2"
      >
        <Calendar className="size-4" />
        In Kalender
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="gap-2"
      >
        <Copy className="size-4" />
        {copied ? "Kopiert!" : "Link teilen"}
      </Button>
      <Button variant="outline" size="sm" asChild className="gap-2">
        <Link href={`/venues/${venueId}`}>
          <MapPin className="size-4" />
          {venueName ?? "Ort"} ansehen
          <ExternalLink className="size-3.5 opacity-70" />
        </Link>
      </Button>
    </div>
  );
}

export function ManageQuickLinks({ manageUrl, venueId }: { manageUrl: string; venueId: number }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <Link
        href="/bookings/suchen"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronRight className="size-4 rotate-180" />
        Alle meine Buchungen
      </Link>
      <Link
        href={`/venues/${venueId}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/90"
      >
        Weitere Termine buchen
        <ChevronRight className="size-4" />
      </Link>
    </div>
  );
}

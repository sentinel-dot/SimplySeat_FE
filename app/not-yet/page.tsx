import { SiteLayout } from "@/components/layout/site-layout";
import Link from "next/link";
import { Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLANNED_ITEMS = [
  "Über uns",
  "Unternehmen eintragen",
  "Partnerprogramm",
  "Preise",
  "Cookies (Informationen)",
] as const;

export const metadata = {
  title: "Demnächst – SimplySeat",
  description: "Diese Seite oder Funktion ist noch in Arbeit.",
};

export default function NotYetPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full border border-border bg-muted/50 p-4">
            <Clock className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Noch nicht verfügbar
          </h1>
          <p className="mt-2 text-muted-foreground">
            Diese Seite oder Funktion arbeiten wir gerade aus. Schau später nochmal vorbei.
          </p>
          <div className="mt-10 w-full rounded-xl border border-border bg-muted/30 p-6 text-left">
            <h2 className="text-sm font-semibold text-foreground">
              Geplant / in Arbeit (zum später Abarbeiten)
            </h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {PLANNED_ITEMS.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </div>
          <Button variant="outline" className="mt-10" asChild>
            <Link href="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Zur Startseite
            </Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}

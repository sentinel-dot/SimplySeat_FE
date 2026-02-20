import { SiteLayout } from "@/components/layout/site-layout";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Kontakt – SimplySeat",
  description: "Kontakt aufnehmen mit SimplySeat.",
};

export default function KontaktPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
          Kontakt
        </h1>
        <p className="mt-2 text-muted-foreground">
          Du hast eine Frage oder Anregung? Schreib uns einfach.
        </p>

        <section className="mt-10 space-y-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">
              E-Mail
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Schreib uns unter der folgenden Adresse – wir antworten in der Regel innerhalb von 1–2 Werktagen.
            </p>
            <a
              href="mailto:info@simplyseat.de?subject=Anfrage%20SimplySeat"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Mail className="h-4 w-4" />
              info@simplyseat.de
            </a>
          </div>

          <p className="text-sm text-muted-foreground">
            Weitere Angaben (z.&nbsp;B. Name, Adresse, Telefon) findest du im{" "}
            <Link href="/impressum" className="font-medium text-primary hover:underline">
              Impressum
            </Link>
            .
          </p>
        </section>

        <Button variant="ghost" className="mt-10" asChild>
          <Link href="/" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Zur Startseite
          </Link>
        </Button>
      </div>
    </SiteLayout>
  );
}

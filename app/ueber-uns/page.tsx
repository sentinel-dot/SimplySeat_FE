import { SiteLayout } from "@/components/layout/site-layout";
import { Calendar, Users, Heart, Sparkles, Target, Clock } from "lucide-react";

export const metadata = {
  title: "Über uns – SimplySeat",
  description: "SimplySeat macht das Buchen von Terminen und Tischreservierungen so einfach wie nie zuvor.",
};

export default function UeberUnsPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display text-3xl font-semibold text-foreground sm:text-5xl">
            Über <span className="text-primary">SimplySeat</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Wir machen das Buchen von Terminen und Tischreservierungen so einfach wie nie zuvor.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mt-16">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-background p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Unsere Mission
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              SimplySeat wurde mit der Vision gegründet, die Buchung von lokalen Dienstleistungen
              zu revolutionieren. Ob Restaurant, Friseursalon, Spa oder Café – wir bringen Kunden
              und Anbieter auf einer zentralen, benutzerfreundlichen Plattform zusammen. Keine
              Telefonate mehr, keine umständlichen Buchungsprozesse. Nur wenige Klicks trennen
              Sie von Ihrem perfekten Termin.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-foreground text-center mb-10">
            Was uns auszeichnet
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/50">
              <div className="rounded-lg bg-primary/10 p-3 w-fit">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                Einfach & Intuitiv
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Unsere Plattform ist auf maximale Benutzerfreundlichkeit ausgelegt. In wenigen
                Schritten zum Wunschtermin – ohne Komplikationen.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/50">
              <div className="rounded-lg bg-primary/10 p-3 w-fit">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                Echtzeit-Verfügbarkeit
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Sehen Sie sofort, welche Termine verfügbar sind. Keine Wartezeit, keine
                Rückfragen – buchen Sie direkt Ihren Wunschtermin.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/50">
              <div className="rounded-lg bg-primary/10 p-3 w-fit">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                Für alle gemacht
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Ob Kunde oder Betreiber – SimplySeat unterstützt beide Seiten mit
                leistungsstarken Tools und einer nahtlosen Erfahrung.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/50">
              <div className="rounded-lg bg-primary/10 p-3 w-fit">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                Alles an einem Ort
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Alle Ihre Buchungen zentral verwalten. Behalten Sie den Überblick über
                vergangene und kommende Termine.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/50">
              <div className="rounded-lg bg-primary/10 p-3 w-fit">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                Lokale Betriebe stärken
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Wir unterstützen lokale Unternehmen dabei, mehr Kunden zu erreichen und ihr
                Geschäft effizienter zu führen.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/50">
              <div className="rounded-lg bg-primary/10 p-3 w-fit">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                Transparent & Fair
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Keine versteckten Kosten, keine komplizierten Verträge. Faire Konditionen für
                alle Beteiligten.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="mt-16">
          <div className="rounded-2xl border border-border bg-muted/30 p-8 sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
              Unsere Geschichte
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                SimplySeat entstand aus einer einfachen Idee: Warum ist es im Jahr 2026 immer
                noch so umständlich, einen Tisch im Restaurant oder einen Friseurtermin zu buchen?
              </p>
              <p>
                Wir haben gesehen, wie viele großartige lokale Betriebe Schwierigkeiten haben,
                ihre Terminverwaltung zu digitalisieren, während Kunden gleichzeitig nach einer
                einfachen, modernen Lösung suchen. SimplySeat schließt diese Lücke.
              </p>
              <p>
                Heute sind wir stolz darauf, eine wachsende Community von Betrieben und zufriedenen
                Kunden zu unterstützen. Und das ist erst der Anfang – wir arbeiten kontinuierlich
                daran, die Plattform noch besser zu machen.
              </p>
            </div>
          </div>
        </section>

        {/* Team/Contact Section */}
        <section className="mt-16 text-center">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-8 sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
              Haben Sie Fragen?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Wir freuen uns, von Ihnen zu hören! Egal ob Sie Kunde, Betreiber oder einfach nur
              neugierig sind – kontaktieren Sie uns gerne.
            </p>
            <a
              href="/kontakt"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Zum Kontaktformular
            </a>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

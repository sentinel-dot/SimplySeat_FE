import { SiteLayout } from "@/components/layout/site-layout";

export const metadata = {
  title: "Cookie-Richtlinien – SimplySeat",
  description: "Informationen über die Verwendung von Cookies auf SimplySeat.",
};

export default function CookiesPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
          Cookie-Richtlinien
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Stand: 20.02.2026
        </p>

        <section className="mt-8 space-y-8 text-foreground">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Was sind Cookies?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert
              werden, wenn Sie eine Website besuchen. Sie ermöglichen es der
              Website, sich bestimmte Informationen über Ihren Besuch zu merken
              und Ihre nächste Nutzung zu vereinfachen.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Welche Cookies verwendet SimplySeat?
            </h2>
            <p className="mt-2 text-muted-foreground">
              SimplySeat verwendet ausschließlich technisch notwendige Cookies,
              die für den Betrieb der Plattform erforderlich sind. Wir verwenden
              keine Marketing-, Tracking- oder Analyse-Cookies von Drittanbietern.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Technisch notwendige Cookies
            </h2>
            <p className="mt-2 text-muted-foreground">
              Diese Cookies sind für die Grundfunktionen der Website unerlässlich
              und können nicht deaktiviert werden. Sie werden nur als Reaktion auf
              Ihre Aktionen gesetzt, wie z.B. das Anmelden in Ihr Konto.
            </p>
            <div className="mt-4 space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h3 className="font-semibold text-foreground">
                  Authentifizierungs-Cookies
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium">Zweck:</span> Ermöglichen die sichere
                  Anmeldung und Session-Verwaltung für registrierte Nutzer. Diese
                  Cookies speichern verschlüsselte Authentifizierungsinformationen,
                  damit Sie angemeldet bleiben können.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-medium">Gültigkeit:</span> 7 Tage nach der
                  Anmeldung
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-medium">Typ:</span> HttpOnly (nicht über
                  JavaScript zugreifbar)
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h3 className="font-semibold text-foreground">
                  Präferenz-Cookies
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium">Zweck:</span> Speichert Ihre
                  Einstellungen, wie z.B. ob Sie den Cookie-Hinweis bereits gesehen
                  haben. Diese werden lokal in Ihrem Browser gespeichert und nicht
                  an unseren Server übermittelt.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-medium">Gültigkeit:</span> 1 Jahr
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-medium">Typ:</span> LocalStorage (lokale
                  Browser-Speicherung)
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Sicherheit
            </h2>
            <p className="mt-2 text-muted-foreground">
              Alle Authentifizierungs-Cookies werden als HttpOnly-Cookies gesetzt.
              Das bedeutet, sie sind nicht über JavaScript zugreifbar und bieten
              zusätzlichen Schutz gegen XSS-Angriffe (Cross-Site Scripting). Die
              Übertragung erfolgt ausschließlich über sichere HTTPS-Verbindungen.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Cookies verwalten
            </h2>
            <p className="mt-2 text-muted-foreground">
              Da SimplySeat nur technisch notwendige Cookies verwendet, ist keine
              Einwilligung erforderlich (gemäß Art. 6 Abs. 1 lit. b DSGVO). Sie
              können Cookies in Ihren Browser-Einstellungen jederzeit löschen oder
              blockieren. Bitte beachten Sie, dass die Website ohne diese Cookies
              möglicherweise nicht ordnungsgemäß funktioniert, insbesondere die
              Anmeldefunktion.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Keine Drittanbieter-Cookies
            </h2>
            <p className="mt-2 text-muted-foreground">
              SimplySeat setzt keine Cookies von Drittanbietern. Alle Cookies
              werden direkt von unserer Domain gesetzt und dienen ausschließlich
              der Funktionalität der Plattform. Wir verwenden keine
              Analyse-Tools wie Google Analytics, keine Social-Media-Plugins und
              keine Werbenetzwerke.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Kontakt
            </h2>
            <p className="mt-2 text-muted-foreground">
              Bei Fragen zu unseren Cookie-Richtlinien können Sie uns jederzeit
              kontaktieren:
              <br />
              <br />
              SimplySeat
              <br />
              Nikola Milinkovic
              <br />
              E-Mail:{" "}
              <a
                href="mailto:info@simplyseat.de"
                className="text-primary hover:underline"
              >
                info@simplyseat.de
              </a>
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Änderungen
            </h2>
            <p className="mt-2 text-muted-foreground">
              Wir behalten uns vor, diese Cookie-Richtlinien zu aktualisieren, um
              Änderungen an unseren Praktiken oder aus anderen betrieblichen,
              rechtlichen oder regulatorischen Gründen widerzuspiegeln. Die
              aktuelle Version finden Sie stets auf dieser Seite.
            </p>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

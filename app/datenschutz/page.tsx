import { SiteLayout } from "@/components/layout/site-layout";

export const metadata = {
  title: "Datenschutz – SimplySeat",
  description: "Datenschutzerklärung der SimplySeat-Plattform.",
};

export default function DatenschutzPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
          Datenschutzerklärung
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Stand: 20.02.2026
        </p>

        <section className="mt-8 space-y-8 text-foreground">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              1. Verantwortlicher
            </h2>
            <p className="mt-2 text-muted-foreground">
              Verantwortlich für die Datenverarbeitung auf dieser Website ist (als Privatperson):
              <br />
              Nikola Milinkovic, Frankfurter Straße 143, 63263 Neu-Isenburg
              <br />
              E-Mail: info@simplyseat.de
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              2. Erhebung und Speicherung personenbezogener Daten
            </h2>
            <p className="mt-2 text-muted-foreground">
              Beim Aufruf unserer Website werden durch den Browser auf Ihrem
              Endgerät automatisch Informationen an den Server gesendet. Diese
              Informationen werden temporär in einem sogenannten Logfile
              gespeichert. Erfasst werden u. a.: IP-Adresse, Datum und Uhrzeit
              des Zugriffs, angeforderte Datei/URL, übertragene Datenmenge,
              Browsertyp und -version, Betriebssystem, Referrer-URL. Die
              Verarbeitung erfolgt zur Gewährleistung eines reibungslosen
              Verbindungsaufbaus und zur Auswertung der Systemsicherheit und
              -stabilität. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Die
              Daten werden nach spätestens 7 Tagen gelöscht, sofern keine
              Aufbewahrung zu Beweiszwecken erforderlich ist.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              3. Buchungsanfragen
            </h2>
            <p className="mt-2 text-muted-foreground">
              Wenn Sie über die Plattform eine Buchungsanfrage stellen, werden
              die von Ihnen angegebenen Daten (Name, E-Mail, ggf. Telefon,
              Terminwunsch) verarbeitet. Diese Daten werden zum Zweck der
              Durchführung der Buchung, der Kommunikation mit Ihnen und der
              Weitergabe an das jeweilige Unternehmen (Restaurant, Salon etc.)
              genutzt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO
              (Vertragsanbahnung bzw. Vertragserfüllung). Die Speicherdauer
              richtet sich nach den gesetzlichen Aufbewahrungspflichten und den
              berechtigten Interessen des Anbieters.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              4. Standortdaten (Geolocation)
            </h2>
            <p className="mt-2 text-muted-foreground">
              Unsere Website bietet Ihnen die Möglichkeit, Ihren aktuellen
              Standort zu verwenden, um relevante Suchergebnisse in Ihrer Nähe
              zu finden. Diese Funktion ist vollständig freiwillig und erfolgt
              nur nach Ihrer ausdrücklichen Zustimmung über die
              Browser-Berechtigungsabfrage.
            </p>
            <p className="mt-2 text-muted-foreground">
              <span className="font-semibold">Wie wir Standortdaten verarbeiten:</span>
              <br />
              • Ihr Browser fragt Sie um Erlaubnis, bevor Standortdaten übermittelt werden
              <br />
              • Die GPS-Koordinaten (Längen- und Breitengrad) werden ausschließlich
              im Browser verarbeitet
              <br />
              • Wir verwenden den kostenlosen OpenStreetMap Nominatim-Dienst, um
              aus den Koordinaten einen Ortsnamen (Stadt) zu ermitteln
              <br />
              • Es werden keine Standortdaten auf unseren Servern gespeichert
              <br />
              • Die Daten werden nicht mit Ihrem Nutzerkonto verknüpft
              <br />
              • Sie können die Berechtigung jederzeit in Ihren
              Browser-Einstellungen widerrufen
            </p>
            <p className="mt-2 text-muted-foreground">
              <span className="font-semibold">Rechtsgrundlage:</span> Art. 6 Abs. 1
              lit. a DSGVO (Einwilligung). Die Einwilligung kann jederzeit durch
              Änderung der Browser-Einstellungen widerrufen werden.
            </p>
            <p className="mt-2 text-muted-foreground">
              <span className="font-semibold">Drittanbieter:</span> Für die
              Umwandlung von Koordinaten in Ortsnamen nutzen wir den
              OpenStreetMap Nominatim-Dienst. Dabei werden Ihre Koordinaten
              sowie Ihre IP-Adresse an OpenStreetMap übermittelt. Weitere
              Informationen finden Sie in der{" "}
              <a
                href="https://osmfoundation.org/wiki/Privacy_Policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Datenschutzerklärung der OpenStreetMap Foundation
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              5. Weitergabe von Daten
            </h2>
            <p className="mt-2 text-muted-foreground">
              Eine Weitergabe Ihrer personenbezogenen Daten an Dritte zu anderen
              als den im Folgenden genannten Zwecken erfolgt nicht. Wir geben
              Ihre Daten nur weiter, wenn Sie Ihre Einwilligung erteilt haben
              (Art. 6 Abs. 1 lit. a DSGVO), die Weitergabe zur Erfüllung eines
              Vertrags erforderlich ist (Art. 6 Abs. 1 lit. b DSGVO), eine
              gesetzliche Verpflichtung besteht (Art. 6 Abs. 1 lit. c DSGVO)
              oder die Weitergabe zur Wahrung berechtigter Interessen erforderlich
              ist (Art. 6 Abs. 1 lit. f DSGVO). Im Rahmen von Buchungen werden
              Ihre Daten an das jeweilige gebuchte Unternehmen weitergegeben.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              6. Ihre Rechte
            </h2>
            <p className="mt-2 text-muted-foreground">
              Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung
              (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der
              Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20
              DSGVO) und Widerspruch (Art. 21 DSGVO). Sie haben ferner das
              Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren
              (Art. 77 DSGVO).
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              7. Hosting
            </h2>
            <p className="mt-2 text-muted-foreground">
              Das Frontend (Website) wird bei Vercel Inc. (USA) gehostet, das Backend (API und Datenbank)
              bei Railway. Dabei können personenbezogene Daten (z. B. IP-Adresse, Zugriffszeiten)
              an die Hoster übermittelt werden. Auftragsverarbeitungsverträge wurden mit den Hostern geschlossen.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              8. Änderungen
            </h2>
            <p className="mt-2 text-muted-foreground">
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um
              sie an geänderte Rechtslage oder bei Änderungen des Angebots
              anzupassen. Die aktuelle Version finden Sie stets auf dieser
              Seite.
            </p>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

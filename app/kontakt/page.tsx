import { SiteLayout } from "@/components/layout/site-layout";
import { ContactForm } from "@/components/contact-form";
import { Mail, MessageCircle, Clock } from "lucide-react";

export const metadata = {
  title: "Kontakt – SimplySeat",
  description: "Kontaktieren Sie das SimplySeat-Team. Wir helfen Ihnen gerne weiter.",
};

export default function KontaktPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Kontakt
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Haben Sie Fragen, Anregungen oder benötigen Sie Unterstützung? Wir freuen uns auf Ihre Nachricht.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mb-12">
          <div className="rounded-xl border border-border bg-card p-6 text-center transition-all hover:shadow-lg hover:border-primary/50">
            <div className="mx-auto rounded-lg bg-primary/10 p-3 w-fit">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
              E-Mail
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Direkter Kontakt per E-Mail
            </p>
            <a
              href="mailto:info@simplyseat.de"
              className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            >
              info@simplyseat.de
            </a>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 text-center transition-all hover:shadow-lg hover:border-primary/50">
            <div className="mx-auto rounded-lg bg-primary/10 p-3 w-fit">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
              Antwortzeit
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Wir antworten in der Regel innerhalb von
            </p>
            <p className="mt-1 text-sm font-medium text-primary">
              1–2 Werktagen
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 text-center transition-all hover:shadow-lg hover:border-primary/50">
            <div className="mx-auto rounded-lg bg-primary/10 p-3 w-fit">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
              Support
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Fragen zu Buchungen, Account oder technischen Problemen
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 sm:p-10">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Kontaktformular
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen.
            </p>
          </div>
          <ContactForm />
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Weitere Informationen finden Sie in unserem{" "}
            <a href="/impressum" className="font-medium text-primary hover:underline">
              Impressum
            </a>
            {" "}und in der{" "}
            <a href="/datenschutz" className="font-medium text-primary hover:underline">
              Datenschutzerklärung
            </a>
            .
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}

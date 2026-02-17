import { Search, CalendarDays, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Suchen",
    description:
      "Finde den passenden Anbieter: nach Kategorie, Ort oder Name durchstöbern.",
    step: "01",
  },
  {
    icon: CalendarDays,
    title: "Buchen",
    description:
      "Wähle Datum und Uhrzeit aus der Echtzeit-Verfügbarkeit – ohne Anruf.",
    step: "02",
  },
  {
    icon: CheckCircle2,
    title: "Genießen",
    description:
      "Komm vorbei und entspann. Hilf anderen mit einer Bewertung, tolle Anbieter zu entdecken.",
    step: "03",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Einfacher Ablauf
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl text-balance">
            So funktioniert&apos;s
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Deinen nächsten Termin buchst du in wenigen Sekunden.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              {index < steps.length - 1 && (
                <div
                  className="absolute left-1/2 top-10 hidden h-px w-full bg-border md:block"
                  aria-hidden
                />
              )}

              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary">
                <step.icon className="h-8 w-8 text-primary" />
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {step.step}
                </span>
              </div>

              <h3 className="mt-6 text-lg font-bold text-foreground">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Search, CalendarCheck, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Suchen & Entdecken",
    description:
      "Durchstöbere lokale Betriebe. Filtere nach Kategorie, Ort und Verfügbarkeit.",
  },
  {
    icon: CalendarCheck,
    title: "Sofort buchen",
    description:
      "Wähle dein Wunschdatum und -uhrzeit. Bestätige deinen Termin mit wenigen Klicks – keine Anrufe nötig.",
  },
  {
    icon: Star,
    title: "Genießen & Bewerten",
    description:
      "Komm vorbei und genieße. Hinterlasse eine Bewertung und hilf anderen, die besten Anbieter zu finden.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-background py-12 sm:py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-balance text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
            So funktioniert&apos;s
          </h2>
          <p className="mt-2 sm:mt-3 text-pretty text-sm sm:text-base text-muted-foreground">
            Buche deinen nächsten Termin in drei einfachen Schritten
          </p>
        </div>

        <div className="mt-10 sm:mt-14 grid gap-10 sm:gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-3 animate-fill-both"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                <step.icon className="h-7 w-7" />
              </div>
              <span className="mt-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                {index + 1}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Stammkundin",
    content:
      "SimplySeat hat für mich komplett verändert, wie ich Termine buche. Ich habe innerhalb von Minuten einen tollen Friseur gefunden und die Buchung war reibungslos.",
    rating: 5,
  },
  {
    name: "Thomas K.",
    role: "Fitness-Fan",
    content:
      "Ich nutze SimplySeat für alle meine Termine. Die Möglichkeit, Anbieter zu vergleichen und direkt zu buchen, ist unbezahlbar.",
    rating: 5,
  },
  {
    name: "Lena W.",
    role: "Spa-Liebhaberin",
    content:
      "Das Beste an SimplySeat ist die sofortige Bestätigung. Kein Hin und Her mehr. Einfach auswählen, buchen und hingehen. So einfach ist das.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-background py-12 sm:py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-balance text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
            Von Tausenden geschätzt
          </h2>
          <p className="mt-2 sm:mt-3 text-pretty text-sm sm:text-base text-muted-foreground">
            Lies, was unsere Community über SimplySeat sagt
          </p>
        </div>

        <div className="mt-8 sm:mt-12 grid gap-6 sm:gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] animate-in fade-in slide-in-from-bottom-3 animate-fill-both"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-highlight text-highlight" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                &quot;{testimonial.content}&quot;
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-sm font-semibold text-primary">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

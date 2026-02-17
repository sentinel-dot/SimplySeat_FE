import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Stammkundin",
    content:
      "SimplySeat hat für mich komplett verändert, wie ich Termine buche. Ich habe innerhalb von Minuten einen tollen Friseur gefunden und die Buchung war reibungslos.",
    rating: 5,
    initials: "SM",
  },
  {
    name: "Thomas K.",
    role: "Fitness-Fan",
    content:
      "Ich nutze SimplySeat für alle meine Termine. Die Möglichkeit, Anbieter zu vergleichen und direkt zu buchen, ist unbezahlbar.",
    rating: 5,
    initials: "TK",
  },
  {
    name: "Lena W.",
    role: "Spa-Liebhaberin",
    content:
      "Das Beste an SimplySeat ist die sofortige Bestätigung. Kein Hin und Her mehr. Einfach auswählen, buchen und hingehen. So einfach ist das.",
    rating: 5,
    initials: "LW",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-background py-20 md:py-28 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Was Nutzer sagen
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl text-balance">
            Von Tausenden geschätzt
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <Quote className="h-8 w-8 text-primary/30" />

              <div className="mt-4 flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                &quot;{testimonial.content}&quot;
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {testimonial.initials}
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

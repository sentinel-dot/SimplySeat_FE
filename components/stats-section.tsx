type StatsSectionProps = {
  averageRating?: number | null;
  satisfiedCustomersCount?: number | null;
  venueCount?: number | null;
  bookingCountThisMonth?: number | null;
};

export function StatsSection({
  averageRating = null,
  satisfiedCustomersCount = null,
  venueCount = null,
  bookingCountThisMonth = null,
}: StatsSectionProps) {
  const stats = [
    {
      value: (averageRating ?? 0).toFixed(1).replace(".", ","),
      label: "Durchschnittsbewertung",
    },
    {
      value: `${(satisfiedCustomersCount ?? 0).toLocaleString("de-DE")}`,
      label: "Zufriedene Kunden",
    },
    {
      value: `${venueCount ?? 0}`,
      label: "Orte buchbar",
    },
    {
      value: `${bookingCountThisMonth ?? 0}`,
      label: "Buchungen diesen Monat",
    },
  ];

  return (
    <section id="stats" className="border-y border-border bg-muted/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center animate-in fade-in slide-in-from-bottom-2 animate-fill-both"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <p className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl lg:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

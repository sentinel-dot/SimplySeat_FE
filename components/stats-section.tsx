type StatsSectionProps = {
  averageRating?: number | null;
  satisfiedCustomersCount?: number | null;
  venueCount?: number | null;
  bookingCountThisMonth?: number | null;
};

const DUMMY_AVERAGE_RATING = "4,8";
const DUMMY_SATISFIED_CUSTOMERS = "12.000+";
const DUMMY_VENUE_COUNT = "50+";
const DUMMY_BOOKINGS_THIS_MONTH = "1.200+";

export function StatsSection({
  averageRating,
  satisfiedCustomersCount,
  venueCount,
  bookingCountThisMonth,
}: StatsSectionProps) {
  const hasRealData =
    venueCount != null ||
    (bookingCountThisMonth != null && bookingCountThisMonth > 0) ||
    averageRating != null ||
    satisfiedCustomersCount != null;

  const stats = [
    {
      value: averageRating != null ? averageRating.toFixed(1).replace(".", ",") : DUMMY_AVERAGE_RATING,
      label: "Durchschnittsbewertung",
      isDummy: averageRating == null,
    },
    {
      value:
        satisfiedCustomersCount != null && satisfiedCustomersCount > 0
          ? `${satisfiedCustomersCount.toLocaleString("de-DE")}+`
          : DUMMY_SATISFIED_CUSTOMERS,
      label: "Zufriedene Kunden",
      isDummy: satisfiedCustomersCount == null || satisfiedCustomersCount === 0,
    },
    {
      value: venueCount != null ? `${venueCount}+` : DUMMY_VENUE_COUNT,
      label: "Orte buchbar",
      isDummy: venueCount == null,
    },
    {
      value:
        bookingCountThisMonth != null && bookingCountThisMonth > 0
          ? `${bookingCountThisMonth}+`
          : DUMMY_BOOKINGS_THIS_MONTH,
      label: "Buchungen diesen Monat",
      isDummy: bookingCountThisMonth == null || bookingCountThisMonth === 0,
    },
  ];

  const showDummy = !hasRealData;
  const displayStats = showDummy
    ? [
        { value: DUMMY_AVERAGE_RATING, label: "Durchschnittsbewertung", isDummy: true },
        { value: DUMMY_SATISFIED_CUSTOMERS, label: "Zufriedene Kunden", isDummy: true },
        { value: DUMMY_VENUE_COUNT, label: "Orte buchbar", isDummy: true },
        { value: DUMMY_BOOKINGS_THIS_MONTH, label: "Buchungen diesen Monat", isDummy: true },
      ]
    : stats;

  if (displayStats.length === 0) return null;

  return (
    <section className="border-y border-border bg-muted/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14 lg:px-8">
        {showDummy && (
          <p className="mb-4 text-center">
            <span className="inline-flex items-center rounded-md border border-amber-500/50 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-200">
              Platzhalter – echte Werte folgen
            </span>
          </p>
        )}
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
          {displayStats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center animate-in fade-in slide-in-from-bottom-2 animate-fill-both"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <p className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl lg:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              {stat.isDummy && (
                <p className="mt-0.5 text-[10px] text-amber-600 dark:text-amber-400">Platzhalter</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

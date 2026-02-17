import Link from "next/link";

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Dienstleistungen: [
    { label: "Haar & Barbier", href: "/venues?type=hair_salon" },
    { label: "Spa & Wellness", href: "/venues?type=spa" },
    { label: "Kosmetik", href: "/venues?type=beauty_salon" },
    { label: "Restaurant", href: "/venues?type=restaurant" },
    { label: "Café", href: "/venues?type=cafe" },
    { label: "Bar", href: "/venues?type=bar" },
  ],
  Unternehmen: [
    { label: "Über uns", href: "#" },
    { label: "Karriere", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Presse", href: "#" },
  ],
  Support: [
    { label: "Hilfe-Center", href: "#" },
    { label: "Kontakt", href: "#" },
    { label: "Datenschutz", href: "/datenschutz" },
    { label: "AGB", href: "/agb" },
  ],
  "Für Unternehmen": [
    { label: "Unternehmen eintragen", href: "#" },
    { label: "Partnerprogramm", href: "#" },
    { label: "Preise", href: "#" },
    { label: "API", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-card overflow-hidden pb-[env(safe-area-inset-bottom)]">
      <div className="pattern-dots absolute inset-0 text-border" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-display text-xl font-semibold tracking-tight">
              <span className="text-foreground">Simply</span>
              <span className="text-primary">Seat</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Der einfachste Weg, lokale Dienstleister zu finden und zu buchen. Alle Termine an einem Ort.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <ul className="mt-2 flex flex-col gap-0.5 sm:gap-1">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-block py-1 text-sm text-muted-foreground transition-colors hover:text-foreground active:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            2026 SimplySeat. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/datenschutz" className="text-xs text-muted-foreground hover:text-foreground">
              Datenschutz
            </Link>
            <Link href="/agb" className="text-xs text-muted-foreground hover:text-foreground">
              AGB
            </Link>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

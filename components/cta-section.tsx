import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section id="cta" className="bg-primary py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center lg:px-8">
        <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-5xl text-balance">
          Bereit für deinen nächsten Termin?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-primary-foreground/70">
          Schließe dich tausenden zufriedenen Kunden an, die ihre Lieblingsangebote täglich über SimplySeat buchen.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="rounded-xl bg-primary-foreground px-8 text-sm font-semibold text-primary hover:bg-primary-foreground/90"
            asChild
          >
            <Link href="/venues" className="inline-flex items-center">
              Kostenlos starten
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-xl border-2 border-primary-foreground/50 bg-transparent px-8 text-sm font-semibold text-primary-foreground hover:border-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            asChild
          >
            <Link href="/login">Unternehmen eintragen</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative border-t border-border overflow-hidden py-16 sm:py-24 bg-gradient-to-br from-primary via-primary/98 to-primary/90">
      <div className="pattern-dots absolute inset-0 text-primary-foreground/10" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center lg:px-8">
        <h2 className="font-display text-balance text-2xl font-bold tracking-tight text-primary-foreground animate-in fade-in slide-in-from-bottom-2 duration-500 sm:text-4xl">
          Bereit für deinen nächsten Termin?
        </h2>
        <p className="mx-auto mt-3 sm:mt-4 max-w-xl text-pretty text-sm sm:text-base text-primary-foreground/85">
          Schließe dich zufriedenen Kunden an, die SimplySeat nutzen, um die besten lokalen Betriebe
          zu entdecken und zu buchen.
        </p>
        <div className="mt-8 sm:mt-10 flex flex-col items-stretch sm:items-center justify-center gap-3 sm:gap-4 sm:flex-row">
          <Button
            size="lg"
            className="min-h-[48px] w-full sm:w-auto rounded-xl sm:rounded-2xl bg-primary-foreground px-8 text-primary shadow-lg hover:bg-primary-foreground/95"
            asChild
          >
            <Link href="/venues" className="inline-flex items-center justify-center">
              Orte entdecken
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="min-h-[48px] w-full sm:w-auto rounded-xl sm:rounded-2xl border-2 border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/15"
            asChild
          >
            <Link href="/login">Betreiber werden</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

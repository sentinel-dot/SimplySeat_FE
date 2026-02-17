import Link from "next/link";
import { SiteLayout } from "@/components/layout/site-layout";

export default function NotFound() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <p className="text-6xl font-display font-semibold text-primary/30 sm:text-7xl">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-semibold text-foreground sm:text-3xl">
          Seite nicht gefunden
        </h1>
        <p className="mt-3 text-muted-foreground">
          Die angeforderte Seite existiert nicht oder wurde verschoben.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Zur Startseite
        </Link>
      </div>
    </SiteLayout>
  );
}

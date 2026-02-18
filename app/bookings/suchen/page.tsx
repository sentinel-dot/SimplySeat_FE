import { SiteLayout } from "@/components/layout/site-layout";
import { SuchenWrapper } from "./suchen-wrapper";

export const metadata = {
  title: "Buchungen suchen – SimplySeat",
  description: "Buchungen mit Ihrer E-Mail-Adresse finden.",
};

export default function BuchungenSuchenPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
        <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
          Buchungen suchen
        </h1>
        <p className="mt-2 text-muted-foreground">
          Geben Sie Ihre E-Mail-Adresse ein, um Ihre Buchungen zu finden. Oder melden Sie sich an, um Ihre Buchungen sicher in Ihrem Konto zu sehen.
        </p>
        <SuchenWrapper />
      </div>
    </SiteLayout>
  );
}

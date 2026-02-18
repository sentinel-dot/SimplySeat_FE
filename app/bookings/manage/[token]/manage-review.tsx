"use client";

import Link from "next/link";
import { useCustomerAuthOptional } from "@/contexts/CustomerAuthContext";
import { ReviewForm } from "@/components/customer/ReviewForm";
import { Card } from "@/components/ui/card";
import { Star, ExternalLink } from "lucide-react";

type Props = {
  venueId: number;
  venueName?: string;
  status: string;
};

export function ManageBookingReview({ venueId, venueName, status }: Props) {
  const auth = useCustomerAuthOptional();

  if (status !== "completed") return null;

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-border bg-muted/30 px-6 py-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <Star className="size-4" />
          Bewertung
        </h2>
      </div>
      <div className="p-6">
        {auth?.isAuthenticated ? (
          <div>
            <p className="text-sm text-muted-foreground">
              Wie hat Ihnen Ihr Besuch gefallen? Ihre Bewertung hilft anderen Gästen.
            </p>
            <div className="mt-4">
              <ReviewForm venueId={venueId} venueName={venueName} onSuccess={() => {}} />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Diese Buchung ist abgeschlossen. Melden Sie sich an, um eine Bewertung zu schreiben, oder besuchen Sie die Seite des Ortes.
            </p>
            <Link
              href={`/venues/${venueId}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/90"
            >
              {venueName ?? "Ort"} besuchen und bewerten
              <ExternalLink className="size-4" />
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}

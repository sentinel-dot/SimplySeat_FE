"use client";

import { useState } from "react";
import Link from "next/link";
import { useCustomerAuthOptional } from "@/contexts/CustomerAuthContext";
import { RegisterDialog } from "./RegisterDialog";

type Props = {
  /** Pre-filled email from the booking (for registration) */
  customerEmail?: string;
};

export function PostBookingRegisterPrompt({ customerEmail = "" }: Props) {
  const auth = useCustomerAuthOptional();
  const [registerOpen, setRegisterOpen] = useState(false);

  if (!auth) return null;
  if (auth.isLoading || auth.isAuthenticated) return null;

  return (
    <>
      <div className="mt-8 rounded-xl border border-primary/40 bg-secondary/30 p-4 text-center">
        <p className="text-sm font-medium text-foreground">
          Konto erstellen und Buchungen immer im Überblick haben
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Mit einem Konto sehen Sie alle Buchungen, speichern Favoriten und sammeln Treuepunkte.
        </p>
        <button
          type="button"
          onClick={() => setRegisterOpen(true)}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Kostenlos Konto erstellen
        </button>
      </div>
      <RegisterDialog
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        prefilledEmail={customerEmail}
      />
    </>
  );
}

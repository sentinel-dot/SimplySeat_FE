"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCustomerAuthOptional } from "@/contexts/CustomerAuthContext";
import { SuchenContent } from "./suchen-content";

export function SuchenWrapper() {
  const auth = useCustomerAuthOptional();
  const router = useRouter();

  useEffect(() => {
    if (!auth?.isLoading && auth?.isAuthenticated) {
      router.replace("/customer/bookings");
    }
  }, [auth?.isLoading, auth?.isAuthenticated, router]);

  if (auth?.isLoading) {
    return (
      <div className="mt-6 flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
      </div>
    );
  }

  if (auth?.isAuthenticated) {
    return (
      <div className="mt-6 flex justify-center py-12">
        <p className="text-muted-foreground">Weiterleitung zu Ihren Buchungen …</p>
      </div>
    );
  }

  return <SuchenContent />;
}

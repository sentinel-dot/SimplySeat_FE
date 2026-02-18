"use client";

import { useState, useEffect } from "react";
import { useCustomerAuthOptional } from "@/contexts/CustomerAuthContext";
import { isFavorite, addFavorite, removeFavorite } from "@/lib/api/favorites";
import { toast } from "sonner";
import { LoginDialog } from "./LoginDialog";
import { RegisterDialog } from "./RegisterDialog";

type Props = {
  venueId: number;
  className?: string;
  /** Wenn bekannt (z. B. auf der Favoriten-Seite): Herz sofort als „favorisiert“ anzeigen, API bestätigt im Hintergrund */
  initialFavorited?: boolean;
};

export function FavoriteButton({ venueId, className = "", initialFavorited }: Props) {
  const auth = useCustomerAuthOptional();
  const [favorited, setFavorited] = useState(initialFavorited ?? false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  useEffect(() => {
    if (!auth?.isAuthenticated) {
      setChecking(false);
      setFavorited(false);
      return;
    }
    isFavorite(venueId)
      .then((res) => {
        if (res.success && res.data) setFavorited(res.data.isFavorite);
      })
      .finally(() => setChecking(false));
  }, [auth?.isAuthenticated, venueId]);

  const handleClick = async () => {
    if (!auth?.isAuthenticated) {
      setLoginOpen(true);
      return;
    }
    setLoading(true);
    try {
      if (favorited) {
        const res = await removeFavorite(venueId);
        if (res.success) {
          setFavorited(false);
          toast.success("Aus Favoriten entfernt.");
        } else {
          toast.error(res.message ?? "Fehler.");
        }
      } else {
        const res = await addFavorite(venueId);
        if (res.success) {
          setFavorited(true);
          toast.success("Zu Favoriten hinzugefügt.");
        } else {
          toast.error(res.message ?? "Fehler.");
        }
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (checking && auth?.isAuthenticated && initialFavorited === undefined) {
    return (
      <span
        className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card ${className}`}
        aria-hidden
      >
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 ${
          favorited
            ? "border-primary bg-secondary text-primary"
            : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
        } ${className}`}
        aria-label={favorited ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
        title={favorited ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
      >
        <svg
          className="h-5 w-5"
          fill={favorited ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
      <LoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        switchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />
      <RegisterDialog
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        switchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const COOKIE_CONSENT_KEY = "simplyseat_cookie_notice_seen";

export function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const hasSeenNotice = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasSeenNotice) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    setIsClosing(true);
    setTimeout(() => {
      localStorage.setItem(COOKIE_CONSENT_KEY, "true");
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transform transition-all duration-300 ease-out ${
        isClosing ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie-Hinweis"
    >
      <div className="bg-card/95 backdrop-blur-lg border-t border-border shadow-2xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 pr-8">
              <p className="text-sm text-foreground leading-relaxed">
                Diese Website verwendet nur{" "}
                <span className="font-semibold">technisch notwendige Cookies</span>{" "}
                für die Anmeldung und Buchungsverwaltung. Wir verwenden keine
                Tracking- oder Marketing-Cookies.{" "}
                <Link
                  href="/cookies"
                  className="text-primary hover:underline font-medium"
                >
                  Mehr erfahren
                </Link>
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleAccept}
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95"
              >
                Verstanden
              </button>
              <button
                onClick={handleAccept}
                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Hinweis schließen"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

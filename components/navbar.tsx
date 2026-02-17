"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomerAuthOptional } from "@/contexts/CustomerAuthContext";
import { LoginDialog } from "@/components/customer/LoginDialog";
import { RegisterDialog } from "@/components/customer/RegisterDialog";

export function Navbar() {
  const pathname = usePathname();
  const auth = useCustomerAuthOptional();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const bookingsHref = auth?.isAuthenticated ? "/customer/bookings" : "/bookings/my-bookings";
  const linkClass = "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";
  const mobileLinkClass =
    "flex min-h-[44px] items-center rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground active:bg-secondary";

  return (
    <>
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border pt-[env(safe-area-inset-top)]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-display text-xl font-semibold tracking-tight">
              <span className="text-foreground">Simply</span>
              <span className="text-primary">Seat</span>
            </Link>
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-8">
            <Link href="/venues" className={linkClass}>
              Entdecken
            </Link>
            <Link href="/#categories" className={linkClass}>
              Kategorien
            </Link>
            <Link href="/#how-it-works" className={linkClass}>
              So funktioniert&apos;s
            </Link>
            <Link href={bookingsHref} className={linkClass}>
              Meine Buchungen
            </Link>
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-3">
            {auth?.isLoading ? (
              <span className="h-8 w-20 animate-pulse rounded-md bg-muted" aria-hidden />
            ) : auth?.isAuthenticated && auth.customer ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="max-w-[120px] truncate sm:max-w-[160px]">{auth.customer.name}</span>
                  <svg className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-48 rounded-lg border border-border bg-card py-1 shadow-lg" role="menu">
                    <Link href="/customer/dashboard" className="block px-4 py-2 text-sm text-foreground hover:bg-accent" role="menuitem" onClick={() => setDropdownOpen(false)}>Mein Konto</Link>
                    <Link href="/customer/bookings" className="block px-4 py-2 text-sm text-foreground hover:bg-accent" role="menuitem" onClick={() => setDropdownOpen(false)}>Meine Buchungen</Link>
                    <Link href="/customer/favorites" className="block px-4 py-2 text-sm text-foreground hover:bg-accent" role="menuitem" onClick={() => setDropdownOpen(false)}>Favoriten</Link>
                    <Link href="/customer/profile" className="block px-4 py-2 text-sm text-foreground hover:bg-accent" role="menuitem" onClick={() => setDropdownOpen(false)}>Profil</Link>
                    <button type="button" onClick={() => { setDropdownOpen(false); auth.logout(); }} className="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-accent" role="menuitem">Abmelden</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setLoginOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  Anmelden
                </Button>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setRegisterOpen(true)}>
                  Registrieren
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            className="touch-target lg:hidden flex items-center justify-center rounded-md p-2 -m-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">Menü umschalten</span>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
            <div className="flex flex-col gap-1 px-4 py-4 sm:px-6">
              <Link href="/venues" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>Entdecken</Link>
              <Link href="/#categories" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>Kategorien</Link>
              <Link href="/#how-it-works" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>So funktioniert&apos;s</Link>
              <Link href={bookingsHref} className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>Meine Buchungen</Link>
              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
                {auth?.isAuthenticated ? (
                  <Button variant="outline" size="sm" className="min-h-[44px] justify-start" asChild>
                    <Link href="/customer/dashboard">Mein Konto</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="min-h-[44px] justify-start text-muted-foreground" onClick={() => { setMobileMenuOpen(false); setLoginOpen(true); }}>
                      <User className="mr-2 h-4 w-4" /> Anmelden
                    </Button>
                    <Button size="sm" className="min-h-[44px] bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => { setMobileMenuOpen(false); setRegisterOpen(true); }}>
                      Registrieren
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} switchToRegister={() => { setLoginOpen(false); setRegisterOpen(true); }} />
      <RegisterDialog open={registerOpen} onClose={() => setRegisterOpen(false)} switchToLogin={() => { setRegisterOpen(false); setLoginOpen(true); }} />
    </>
  );
}

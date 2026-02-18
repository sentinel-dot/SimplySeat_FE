"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Heart,
  Gift,
  User,
  LogOut,
} from "lucide-react";
import { useCustomerAuthOptional } from "@/contexts/CustomerAuthContext";
import { SiteLayout } from "@/components/layout/site-layout";

const navItems = [
  { href: "/customer/dashboard", label: "Übersicht", icon: LayoutDashboard },
  { href: "/customer/bookings", label: "Meine Buchungen", icon: CalendarDays },
  { href: "/customer/favorites", label: "Favoriten", icon: Heart },
  { href: "/customer/loyalty", label: "Treuepunkte", icon: Gift },
  { href: "/customer/profile", label: "Profil", icon: User },
] as const;

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useCustomerAuthOptional();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!auth?.isLoading && !auth?.isAuthenticated) {
      router.replace("/");
    }
  }, [auth?.isLoading, auth?.isAuthenticated, router]);

  const isActive = (path: string) =>
    pathname === path || (path !== "/customer" && pathname.startsWith(path));

  if (auth?.isLoading) {
    return (
      <SiteLayout>
        <div className="flex min-h-[40vh] items-center justify-center">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
            aria-hidden
          />
        </div>
      </SiteLayout>
    );
  }

  if (!auth?.isAuthenticated) {
    return (
      <SiteLayout>
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-muted-foreground">Weiterleitung …</p>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="flex">
        {/* Sidebar: Desktop */}
        <aside
          className="hidden w-56 shrink-0 border-r border-border bg-card/50 md:block"
          aria-label="Kundenbereich"
        >
          <nav className="sticky top-0 py-6 pl-4 pr-3">
            <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Mein Bereich
            </p>
            <ul className="space-y-0.5">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      }`}
                    >
                      <Icon
                        className="h-5 w-5 shrink-0"
                        strokeWidth={active ? 2.25 : 2}
                        aria-hidden
                      />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => auth?.logout()}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive/90 transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-5 w-5 shrink-0" aria-hidden />
                Abmelden
              </button>
            </div>
          </nav>
        </aside>

        {/* Main content + mobile nav */}
        <div className="min-w-0 flex-1">
          {/* Mobile: horizontal pill nav (replaces tabs) */}
          <div className="border-b border-border bg-background/80 px-4 py-3 backdrop-blur-sm md:hidden">
            <nav
              className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
              aria-label="Kundenbereich"
            >
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    {label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex justify-center border-t border-border px-4 pt-3 pb-1">
              <button
                type="button"
                onClick={() => auth?.logout()}
                className="text-sm font-medium text-destructive/90 hover:text-destructive"
              >
                Abmelden
              </button>
            </div>
          </div>

          {children}
        </div>
      </div>
    </SiteLayout>
  );
}

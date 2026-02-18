"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const HOME_SECTION_IDS = [
  "hero",
  "categories",
  "stats",
  "how-it-works",
  "featured",
  "testimonials",
  "cta",
] as const;

const SCROLL_THRESHOLD = 120; // Bereich oberhalb des Viewports (px), ab dem eine Section als „aktiv“ zählt

/**
 * Aktualisiert die URL (Hash) beim Scrollen auf der Homepage,
 * sodass der sichtbare Abschnitt in der URL steht (z. B. /#categories).
 */
export function ScrollHashSync() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const elements = HOME_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el != null
    );
    if (elements.length === 0) return;

    function updateHash() {
      // Section finden, deren Oberkante den oberen Viewport-Bereich gerade passiert hat
      let activeId: string | null = null;
      for (const el of elements) {
        const top = el.getBoundingClientRect().top;
        if (top <= SCROLL_THRESHOLD) {
          activeId = el.id;
        }
      }
      const id = activeId ?? elements[0]?.id ?? "hero";
      const newHash = `#${id}`;
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, "", `${window.location.pathname}${newHash}`);
      }
    }

    updateHash(); // einmalig beim Mount (z. B. bei Start mit Hash)

    let raf = 0;
    function onScroll() {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        updateHash();
        raf = 0;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}

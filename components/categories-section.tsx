"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { VENUE_TYPES_ORDER, getVenueTypeLabel } from "@/lib/utils/venueType";
import type { Venue } from "@/lib/types";

const CATEGORY_CONFIG: Record<Venue["type"], { description: string }> = {
  restaurant: { description: "Reservieren & Genießen" },
  hair_salon: { description: "Schnitte, Färben & Styling" },
  beauty_salon: { description: "Gesicht, Nägel & Wimpern" },
  cafe: { description: "Kaffee, Kuchen & Frühstück" },
  bar: { description: "Cocktails & Drinks" },
  spa: { description: "Massage, Sauna & Entspannung" },
};

// Unsplash images per venue type (no local /images needed)
const CATEGORY_IMAGES: Record<Venue["type"], string> = {
  restaurant:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
  hair_salon:
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
  beauty_salon:
    "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800",
  cafe:
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
  bar:
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800",
  spa:
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
};

export function CategoriesSection() {
  const categories = VENUE_TYPES_ORDER.map((type) => ({
    type,
    title: getVenueTypeLabel(type),
    description: CATEGORY_CONFIG[type].description,
    image: CATEGORY_IMAGES[type],
    href: `/venues?type=${type}`,
  }));

  return (
    <section id="categories" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Kategorien
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl text-balance">
              Angebote entdecken
            </h2>
          </div>
          <Link
            href="/venues"
            className="hidden items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80 md:flex"
          >
            Alle Kategorien
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.type}
              href={category.href}
              className="group relative flex h-64 overflow-hidden rounded-2xl text-left"
            >
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="relative z-10 flex flex-1 flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white">
                  {category.title}
                </h3>
                <p className="mt-0.5 text-sm text-white/80">
                  {category.description}
                </p>
              </div>
              <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <ArrowRight className="h-4 w-4 text-white" />
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/venues"
          className="mt-6 flex w-full items-center justify-center gap-2 text-sm font-medium text-primary md:hidden"
        >
          Alle Kategorien
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

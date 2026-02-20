"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Clock, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/customer/FavoriteButton";
import { getVenueTypeLabel } from "@/lib/utils/venueType";
import type { Venue } from "@/lib/types";

/** Minimal venue shape so both lib/types Venue and API favorite.venue work */
type VenueLike = Pick<Venue, "id" | "name" | "type"> & {
  image_url?: string;
  city?: string;
  address?: string;
};

const FALLBACK_IMAGES: Record<Venue["type"], string> = {
  restaurant: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
  hair_salon: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
  beauty_salon: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800",
  cafe: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
  bar: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800",
  spa: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
  other: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
};

export type VenueCardProps = {
  venue: VenueLike;
  /** Optional: show rating + review count */
  rating?: number;
  reviews?: number;
  /** Optional: e.g. "Ab 35 €" */
  price?: string;
  /** Optional: e.g. "Heute, 14:00" */
  nextSlot?: string;
  /** Optional: show "Beliebt" badge */
  popular?: boolean;
  /** Show favorite heart button (default true) */
  showFavoriteButton?: boolean;
  /** Wenn true: Herz sofort als „favorisiert“ anzeigen (z. B. auf der Favoriten-Seite) */
  favorited?: boolean;
  /** Optional: An Link anhängen (z. B. "?type=restaurant&location=Berlin") */
  linkSuffix?: string;
};

export function VenueCard({
  venue,
  rating,
  reviews,
  price,
  nextSlot,
  popular = false,
  showFavoriteButton = true,
  favorited,
  linkSuffix = "",
}: VenueCardProps) {
  const imageUrl = venue.image_url || FALLBACK_IMAGES[venue.type];
  const location = [venue.city, venue.address].filter(Boolean).join(", ") || "Deutschland";
  const showRating = rating != null && reviews != null;
  const showFooter = price != null || nextSlot != null;
  const venueHref = `/venues/${venue.id}${linkSuffix}`;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-300 hover:shadow-xl">
      <div className="relative h-48 overflow-hidden">
        <Link href={venueHref} className="block h-full w-full">
          <Image
            src={imageUrl}
            alt={venue.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized
          />
        </Link>
        {popular && (
          <Badge className="absolute left-3 top-3 border-0 bg-primary text-primary-foreground text-xs font-semibold">
            Beliebt
          </Badge>
        )}
        {showFavoriteButton && (
          <div className="absolute right-3 top-3 z-10">
            <FavoriteButton
              venueId={venue.id}
              initialFavorited={favorited}
              className="h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm transition-colors hover:bg-card border-0"
            />
          </div>
        )}
      </div>

      <div className="relative flex min-h-[10rem] flex-1 flex-col p-5">
        {showRating && (
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-semibold text-foreground">{rating}</span>
            <span className="text-xs text-muted-foreground">({reviews})</span>
          </div>
        )}

        <div className="min-h-[2.75rem]">
<Link href={venueHref}>
          <h3 className={`line-clamp-2 font-bold text-foreground hover:text-primary ${showRating ? "mt-2 text-lg" : "text-lg"}`}>
              {venue.name}
            </h3>
          </Link>
        </div>
        <p className="min-h-[1.25rem] text-sm text-muted-foreground">{getVenueTypeLabel(venue.type)}</p>

        <div className="mt-3 min-h-[2.5rem] text-xs text-muted-foreground">
          <span className="flex items-start gap-1 line-clamp-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>{location}</span>
          </span>
        </div>

        {showFooter && (
          <div className="mt-auto flex items-center justify-between border-t border-border pt-4 mt-4">
            <div>
              {price != null && <p className="text-sm font-bold text-foreground">{price}</p>}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-primary">
              {nextSlot != null && (
                <>
                  <Clock className="h-3.5 w-3.5" />
                  <span className="font-medium">{nextSlot}</span>
                </>
              )}
            </div>
          </div>
        )}

        {!showFooter && (
          <div className="mt-auto pt-4 mt-4 border-t border-border">
            <span className="text-sm font-medium text-primary">
              {venue.type === "restaurant" ? "Tisch reservieren" : "Termin buchen"}
              <span className="ml-1">→</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

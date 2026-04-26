import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Users, Maximize2, Lock } from "lucide-react";
import type { Room } from "@/lib/hotel";

type RoomCardProps = {
  room: Room;
  isBooked?: boolean;
  /** Agar true bo'lsa, band xona umuman ko'rsatilmaydi (clientlar uchun) */
  hideIfBooked?: boolean;
};

export function RoomCard({ room, isBooked = false, hideIfBooked = false }: RoomCardProps) {
  // Client tarafda band xonani umuman ko'rsatmaslik
  if (isBooked && hideIfBooked) return null;

  return (
    <article className="luxe-card group relative transition-all duration-500 hover:-translate-y-2 hover:shadow-royal">
      {/* Image */}
      <div className="image-frame relative aspect-[4/3] overflow-hidden rounded-t-[var(--radius-xl)] rounded-b-none">
        <img
          src={room.image}
          alt={`${room.name} at Artsuzani Hotel Bukhara`}
          loading="lazy"
          className={`h-full w-full object-cover transition-all duration-[1200ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-110 ${
            isBooked ? "grayscale-[0.4]" : ""
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/15 to-transparent" />

        {/* Decorative corner ornament */}
        <svg
          className="absolute right-3 top-3 size-8 text-gold/70 mix-blend-screen"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <path d="M16 4 L20 16 L16 28 L12 16 Z" />
          <path d="M4 16 L16 12 L28 16 L16 20 Z" />
          <circle cx="16" cy="16" r="2" />
        </svg>

        {/* Mood badge */}
        <span className="floating-badge absolute left-4 top-4 rounded-full px-3 py-1 text-xs uppercase tracking-[0.22em] text-foreground">
          {room.mood}
        </span>

        {/* Category */}
        <span className="absolute right-4 top-4 rounded-full bg-primary/85 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground backdrop-blur">
          {room.category}
        </span>

        {/* Booked overlay (admin-only display path) */}
        {isBooked && (
          <div className="booked-overlay">
            <div className="text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-full border border-gold/40 bg-gold/10 backdrop-blur">
                <Lock className="size-6 text-gold" />
              </div>
              <p className="mt-3 font-serif text-2xl text-primary-foreground">Currently booked</p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-gold">Unavailable</p>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="space-y-5 p-6">
        <div>
          <h3 className="font-serif text-3xl font-medium leading-tight text-foreground">
            {room.name}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{room.subtitle}</p>
        </div>

        <div className="flex items-center justify-between gap-3 border-y border-border/60 py-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Users className="size-3.5 text-gold-deep" />
            {room.guests}
          </span>
          <span className="inline-flex items-center gap-2">
            <Maximize2 className="size-3.5 text-gold-deep" />
            {room.size}
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 pt-1">
          <div>
            <p className="text-[0.66rem] uppercase tracking-[0.22em] text-muted-foreground">
              From
            </p>
            <strong className="font-serif text-3xl font-medium text-gold-deep">
              {room.price}
              <span className="ml-1 text-sm font-normal text-muted-foreground"> / night</span>
            </strong>
          </div>
          <Link
            to="/rooms/$roomSlug"
            params={{ roomSlug: room.slug }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90"
          >
            View
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

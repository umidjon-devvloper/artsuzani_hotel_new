import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  Users,
  Maximize2,
  Eye,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { BookingForm } from "@/components/hotel/BookingForm";
import { PatternDivider } from "@/components/hotel/PatternDivider";
import { SiteHeader } from "@/components/hotel/SiteHeader";
import { getRoom } from "@/lib/hotel";
import type { Room } from "@/lib/hotel";

export const Route = createFileRoute("/rooms/$roomSlug")({
  loader: ({ params }) => {
    const room = getRoom(params.roomSlug);
    if (!room) throw notFound();
    return { room };
  },
  head: ({ loaderData }) => {
    const room = loaderData?.room;
    return {
      meta: [
        { title: room ? `${room.name} · Artsuzani Hotel` : "Room · Artsuzani Hotel" },
        {
          name: "description",
          content: room?.details ?? "Luxury Artsuzani Hotel room in historic Bukhara.",
        },
        {
          property: "og:title",
          content: room ? `${room.name} · Artsuzani Hotel` : "Room · Artsuzani Hotel",
        },
        {
          property: "og:description",
          content: room?.details ?? "Luxury Artsuzani Hotel room in historic Bukhara.",
        },
        ...(room
          ? [
              { property: "og:image", content: room.image },
              { name: "twitter:image", content: room.image },
            ]
          : []),
      ],
    };
  },
  notFoundComponent: RoomNotFound,
  errorComponent: RoomNotFound,
  component: RoomDetailPage,
});

function RoomNotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 text-center text-foreground">
      <div className="absolute inset-0 eastern-pattern opacity-50" aria-hidden="true" />
      <div className="relative">
        <p className="eyebrow justify-center">Lost in the courtyard</p>
        <h1 className="mt-3 font-serif text-6xl font-light">Room not found</h1>
        <p className="mt-3 text-muted-foreground">This room may have been booked or renamed.</p>
        <Link to="/rooms" className="btn-gold mt-7">
          Return to rooms
        </Link>
      </div>
    </main>
  );
}

function RoomDetailPage() {
  const { room } = Route.useLoaderData();
  const gallery = room.gallery && room.gallery.length > 0 ? room.gallery : [room.image];
  const [activeImage, setActiveImage] = useState(0);

  const next = () => setActiveImage((i) => (i + 1) % gallery.length);
  const prev = () => setActiveImage((i) => (i === 0 ? gallery.length - 1 : i - 1));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="px-5 pb-20 pt-28 md:px-8 md:pt-32">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="transition-colors hover:text-gold-deep">
              Home
            </Link>
            <span>·</span>
            <Link to="/rooms" className="transition-colors hover:text-gold-deep">
              Rooms
            </Link>
            <span>·</span>
            <span className="text-foreground">{room.name}</span>
          </nav>

          <Link
            to="/rooms"
            className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-gold-deep"
          >
            <ArrowLeft className="size-4" /> Back to rooms
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            {/* Left — gallery & details */}
            <div>
              {/* Main image */}
              <div className="image-frame relative aspect-[16/11] shadow-royal">
                <img
                  src={gallery[activeImage]}
                  alt={`${room.name} at Artsuzani Hotel`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <p className="eyebrow text-gold">{room.mood}</p>
                    <h1 className="mt-2 font-serif text-5xl font-light leading-[0.95] text-primary-foreground md:text-7xl">
                      {room.name}
                    </h1>
                  </div>
                  <span className="rounded-full bg-primary/85 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground backdrop-blur">
                    {room.category}
                  </span>
                </div>

                {/* Gallery nav */}
                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      aria-label="Previous photo"
                      className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-gold/40 bg-card/40 text-foreground backdrop-blur-md transition-all hover:bg-card/80"
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                    <button
                      onClick={next}
                      aria-label="Next photo"
                      className="absolute right-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-gold/40 bg-card/40 text-foreground backdrop-blur-md transition-all hover:bg-card/80"
                    >
                      <ChevronRight className="size-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {gallery.map((src, i) => (
                    <button
                      key={src + i}
                      onClick={() => setActiveImage(i)}
                      className={`image-frame aspect-[4/3] transition-all ${
                        i === activeImage
                          ? "ring-2 ring-gold ring-offset-2 ring-offset-background"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <PatternDivider />

              {/* Quick stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <Stat icon={Users} label="Guests" value={room.guests} />
                <Stat icon={Maximize2} label="Size" value={room.size} />
                <Stat icon={Eye} label="View" value={room.mood} />
              </div>

              {/* Description */}
              <div className="mt-10 max-w-3xl space-y-5 text-lg leading-8 text-muted-foreground">
                <p className="font-serif text-2xl italic leading-snug text-foreground">
                  "{room.subtitle}"
                </p>
                <p>{room.details}</p>
              </div>

              {/* Highlights */}
              {room.highlights && room.highlights.length > 0 && (
                <div className="mt-10">
                  <p className="eyebrow">Highlights</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {room.highlights.map((h) => (
                      <div
                        key={h}
                        className="luxe-card flex items-center gap-3 p-4"
                      >
                        <span className="grid size-9 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold-deep">
                          <Sparkles className="size-4" />
                        </span>
                        <span className="text-sm font-medium text-foreground">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              <div className="mt-10">
                <p className="eyebrow">In your room</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {room.amenities.map((a: Room["amenities"][number]) => (
                    <div
                      key={a}
                      className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 px-4 py-3"
                    >
                      <span className="grid size-7 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold-deep">
                        <Check className="size-3.5" strokeWidth={2.5} />
                      </span>
                      <span className="text-sm text-foreground">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — booking form (sticky) */}
            <div className="lg:sticky lg:top-28">
              <div className="luxe-card mb-4 p-5 md:p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[0.66rem] uppercase tracking-[0.22em] text-muted-foreground">
                      From
                    </p>
                    <p className="font-serif text-4xl font-medium text-gold-deep">
                      {room.price}
                      <span className="ml-1 text-sm font-normal text-muted-foreground">
                        / night
                      </span>
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    Best price guaranteed
                  </span>
                </div>
              </div>

              <BookingForm room={room} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="luxe-card p-5">
      <Icon className="mb-3 size-5 text-gold-deep" />
      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-serif text-2xl text-foreground">{value}</p>
    </div>
  );
}

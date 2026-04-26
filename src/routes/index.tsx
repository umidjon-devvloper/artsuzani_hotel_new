import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Landmark,
  Sparkles,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Coffee,
  Wifi,
  KeyRound,
  Sun,
} from "lucide-react";
import { PatternDivider } from "@/components/hotel/PatternDivider";
import { RoomCard } from "@/components/hotel/RoomCard";
import { SiteHeader } from "@/components/hotel/SiteHeader";
import { galleryImages, rooms, getCurrentlyBookedRoomSlugs, WHATSAPP_NUMBER } from "@/lib/hotel";

const HERO_IMAGE = "https://8npyms8qz2.ufs.sh/f/tLZsXxIXMCJ3J11U1IGPNuiPOyCWIqmas4RvDp98LtEnwZKY";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Artsuzani Hotel · Luxury Boutique Stay in Historic Bukhara" },
      {
        name: "description",
        content:
          "Artsuzani Hotel is a premium cultural hotel experience in historic Bukhara, Uzbekistan, with elegant rooms and WhatsApp booking.",
      },
      { property: "og:title", content: "Artsuzani Hotel · Luxury Bukhara Hotel" },
      {
        property: "og:description",
        content:
          "A boutique hotel inspired by old Bukhara courtyards, madrasas, suzani textiles, and golden Silk Road hospitality.",
      },
      { property: "og:image", content: HERO_IMAGE },
      { name: "twitter:image", content: HERO_IMAGE },
    ],
  }),
  component: Index,
});

function Index() {
  const [bookedSlugs, setBookedSlugs] = useState<string[]>([]);

  useEffect(() => {
    void getCurrentlyBookedRoomSlugs().then(setBookedSlugs);
  }, []);

  // Bosh sahifada — band xonalarni ko'rsatmaymiz, faqat 3 ta available xonani ko'rsatamiz
  const availableRooms = rooms.filter((r) => !bookedSlugs.includes(r.slug)).slice(0, 3);
  const featuredRooms = availableRooms.length > 0 ? availableRooms : rooms.slice(0, 3);

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <SiteHeader />

      {/* ─────────── Hero ─────────── */}
      <section className="relative min-h-[100svh] px-5 pt-32 md:px-8">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Historic Bukhara minaret glowing at sunset near Artsuzani Hotel"
            className="h-full w-full scale-105 object-cover"
          />
          <div className="hero-vignette" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/55 to-primary/10" />
          <div className="absolute inset-0 eastern-pattern opacity-25" aria-hidden="true" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100svh-8rem)] max-w-7xl items-end pb-20">
          <div className="max-w-4xl">
            <p className="eyebrow soft-reveal text-gold">Old Bukhara · Uzbekistan</p>
            <h1 className="soft-reveal-delay-1 mt-6 font-serif text-6xl font-light leading-[0.92] text-primary-foreground md:text-[8.5rem]">
              <span className="block italic">Art</span>
              <span className="block">Suzani</span>
            </h1>
            <div className="soft-reveal-delay-2 mt-8 flex max-w-2xl items-center gap-5">
              <span className="h-px flex-1 bg-gold/60" />
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
                Boutique Hotel
              </p>
              <span className="h-px flex-1 bg-gold/60" />
            </div>
            <p className="soft-reveal-delay-3 mt-7 max-w-2xl text-lg leading-8 text-primary-foreground/90 md:text-xl">
              A luxury cultural stay shaped by madrasa arches, suzani textures, golden courtyards,
              and the spiritual calm of historic Bukhara.
            </p>
            <div className="soft-reveal-delay-4 mt-10 flex flex-col gap-3 sm:flex-row">
              <Link to="/rooms" className="btn-gold">
                Explore rooms <ArrowUpRight className="size-5" />
              </Link>
              <Link
                to="/account"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-foreground/40 bg-primary-foreground/5 px-7 py-4 font-medium text-primary-foreground backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-primary-foreground/15"
              >
                My bookings
              </Link>
            </div>
          </div>

          {/* Decorative scroll cue */}
          <div className="pointer-events-none absolute bottom-10 right-8 hidden flex-col items-center gap-3 text-gold md:flex">
            <span className="text-[0.66rem] uppercase tracking-[0.32em]">Scroll</span>
            <span className="h-12 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
          </div>
        </div>
      </section>

      {/* ─────────── About / Story ─────────── */}
      <section className="relative px-5 py-24 md:px-8 md:py-32">
        <div className="absolute inset-0 eastern-pattern opacity-50" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="luxe-card relative p-8 md:p-12">
            <Landmark className="mb-6 size-12 text-gold-deep" />
            <p className="eyebrow">Experience the spirit</p>
            <h2 className="mt-4 font-serif text-4xl font-light leading-tight md:text-6xl">
              A courtyard where history feels close enough to touch.
            </h2>
            <PatternDivider />
            <div className="grid grid-cols-3 gap-4">
              <Stat value="11" label="Curated rooms" />
              <Stat value="5★" label="Hospitality" />
              <Stat value="2KM" label="To Lyabi-Hauz" />
            </div>
          </div>

          <div className="space-y-7 text-lg leading-8 text-muted-foreground">
            <p className="font-serif text-2xl italic leading-snug text-foreground">
              "Artsuzani is imagined as a quiet sanctuary among old streets, carved portals, ancient
              walls, ceramic blues, and warm evening light."
            </p>
            <p>
              Every detail is designed to feel ceremonial: tea at dusk, patterned shadows, softened
              plaster, suzani textile warmth, and a calm rhythm after exploring the bazaars and
              madrasas of Bukhara.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Sun, label: "Cultural atmosphere" },
                { icon: Coffee, label: "Courtyard calm" },
                { icon: MessageCircle, label: "WhatsApp booking" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="luxe-card p-5">
                  <Icon className="mb-3 size-5 text-gold-deep" />
                  <p className="text-sm font-medium text-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── Rooms ─────────── */}
      <section className="relative overflow-hidden bg-primary px-5 py-24 text-primary-foreground md:px-8 md:py-32">
        <div className="absolute inset-0 suzani-pattern opacity-15" aria-hidden="true" />
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-gold/10 blur-[120px]" />
        <div className="absolute -bottom-40 left-0 h-[500px] w-[500px] rounded-full bg-copper/15 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-gold">Rooms & suites</p>
              <h2 className="mt-4 font-serif text-5xl font-light leading-[0.95] md:text-7xl">
                Sleep in Silk Road <span className="italic text-gold">elegance.</span>
              </h2>
              {bookedSlugs.length > 0 && (
                <p className="mt-3 text-sm text-primary-foreground/70">
                  Showing currently available rooms.
                </p>
              )}
            </div>
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2.5 text-sm font-medium uppercase tracking-[0.18em] text-gold transition-all hover:bg-gold hover:text-primary"
            >
              View all rooms <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {featuredRooms.map((room) => (
              <div key={room.slug} className="text-foreground">
                <RoomCard room={room} hideIfBooked />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── Amenities ─────────── */}
      <section className="px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="eyebrow justify-center">Hospitality</p>
            <h2 className="mt-4 font-serif text-4xl font-light md:text-6xl">
              The little things, ceremoniously done.
            </h2>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Coffee,
                title: "Tea at dusk",
                text: "Warm samovar tea, dried fruit, and conversation each evening.",
              },
              {
                icon: Wifi,
                title: "Connected calm",
                text: "Fast Wi-Fi throughout the property — present, never intrusive.",
              },
              {
                icon: KeyRound,
                title: "Effortless arrival",
                text: "Direct WhatsApp coordination, late check-in, simple keys.",
              },
              {
                icon: MapPin,
                title: "Heart of the old city",
                text: "Walking distance to madrasas, minarets, and the trading domes.",
              },
            ].map(({ icon: Icon, title, text }, idx) => (
              <div
                key={title}
                className="luxe-card group relative p-7 transition-all hover:-translate-y-1.5 hover:shadow-royal"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="mb-5 grid size-12 place-items-center rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/15 to-copper/10 text-gold-deep transition-all group-hover:scale-110">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-serif text-2xl text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── Gallery preview ─────────── */}
      <section className="px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Gallery</p>
              <h2 className="mt-4 max-w-3xl font-serif text-5xl font-light md:text-7xl">
                Hotel and city vibes <span className="italic">woven together.</span>
              </h2>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 self-start rounded-full border border-gold/50 px-5 py-2.5 text-sm font-medium uppercase tracking-[0.18em] text-gold-deep transition-all hover:bg-gold hover:text-primary md:self-end"
            >
              All photos <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="mt-12 grid gap-3 md:grid-cols-4">
            {galleryImages.slice(0, 6).map((image, index) => (
              <figure
                key={`${image.alt}-${index}`}
                className={`image-frame group ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <img
                  src={image.src as string}
                  alt={image.alt}
                  loading="lazy"
                  className="h-full min-h-64 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── CTA ─────────── */}
      <section className="relative overflow-hidden px-5 py-24 md:px-8 md:py-32">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="" aria-hidden="true" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/95" />
          <div className="absolute inset-0 suzani-pattern opacity-15" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center text-primary-foreground">
          <Sparkles className="mx-auto mb-6 size-10 animate-pulse-gold rounded-full bg-gold/10 p-2 text-gold" />
          <h2 className="font-serif text-4xl font-light leading-tight md:text-6xl">
            Reserve your <span className="italic text-gold">moment</span> in Bukhara.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-primary-foreground/85">
            Choose your room, share your dates, and we'll meet you at the gate with tea.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/rooms" className="btn-gold">
              Browse rooms <ArrowUpRight className="size-5" />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/40 bg-primary-foreground/5 px-7 py-4 font-medium text-primary-foreground backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-gold hover:bg-primary-foreground/10"
            >
              <MessageCircle className="size-5" /> WhatsApp us
            </a>
          </div>
        </div>
      </section>

      {/* ─────────── Footer ─────────── */}
      <footer className="relative border-t border-border/40 bg-card/50 px-5 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          <Link
            to="/"
            className="group w-50 flex items-center gap-3"
            aria-label="Artsuzani Hotel home"
          >
            <img
              src="https://8npyms8qz2.ufs.sh/f/tLZsXxIXMCJ32RNJl1QqM6OtfBkRePmcFj9JUE1HVuQZpoLz"
              alt="Artsuzani Hotel logo"
              className=" h-50  w-50 transition-transform duration-300 group-hover:rotate-6"
            />
          </Link>
          <div>
            <p className="eyebrow">Visit</p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold" /> Old Bukhara, Uzbekistan
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-gold" /> +998 90 123 45 67
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-gold" />
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold-deep"
                >
                  WhatsApp booking
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">Browse</p>
            <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
              {[
                ["/rooms", "Rooms & suites"],
                ["/gallery", "Gallery"],
                ["/account", "My account"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="inline-flex items-center gap-2 transition-colors hover:text-gold-deep"
                  >
                    <span>→</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl items-center justify-between border-t border-border/30 pt-6 text-xs text-muted-foreground">
          <p className="inline-flex items-center gap-2">
            <Star className="size-3.5 text-gold" /> © {new Date().getFullYear()} Artsuzani Hotel
          </p>
          <p className="uppercase tracking-[0.22em]">
            Created with{" "}
            <a href="https://new.umidjon.dev" target="_blank" rel="noreferrer">
              @umidjon_developer
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="stat-number">{value}</p>
      <p className="mt-1 text-[0.66rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

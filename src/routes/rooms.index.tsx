import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Filter, Search, Sparkles, Users } from "lucide-react";
import { PatternDivider } from "@/components/hotel/PatternDivider";
import { RoomCard } from "@/components/hotel/RoomCard";
import { SiteHeader } from "@/components/hotel/SiteHeader";
import {
  rooms,
  getCurrentlyBookedRoomSlugs,
  getBookedRoomSlugsForDates,
  type Room,
} from "@/lib/hotel";

export const Route = createFileRoute("/rooms/")({
  head: () => ({
    meta: [
      { title: "Luxury Rooms in Bukhara · Artsuzani Hotel" },
      {
        name: "description",
        content:
          "Explore premium rooms at Artsuzani Hotel — a luxury cultural hotel in historic Bukhara, Uzbekistan.",
      },
      { property: "og:title", content: "Luxury Rooms · Artsuzani Hotel" },
      {
        property: "og:description",
        content:
          "Boutique Bukhara rooms with suzani textures, courtyard calm, and WhatsApp booking.",
      },
    ],
  }),
  component: RoomsPage,
});

const CATEGORIES = ["All", "Triple", "Deluxe", "Standard"] as const;
type Category = (typeof CATEGORIES)[number];

const todayISO = () => new Date().toISOString().split("T")[0];

function RoomsPage() {
  const [bookedSlugs, setBookedSlugs] = useState<string[]>([]);
  const [category, setCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState<number>(1);
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Default holatda hozirgi vaqtdagi band xonalarni olamiz
  useEffect(() => {
    void getCurrentlyBookedRoomSlugs().then(setBookedSlugs);
  }, []);

  // Sana o'zgarganda yangi band xonalar ro'yxatini olamiz
  useEffect(() => {
    if (!checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)) {
      setFiltersApplied(false);
      return;
    }
    void getBookedRoomSlugsForDates(checkIn, checkOut).then((slugs) => {
      setBookedSlugs(slugs);
      setFiltersApplied(true);
    });
  }, [checkIn, checkOut]);

  const filteredRooms: Room[] = useMemo(() => {
    return rooms
      .filter((r) => !bookedSlugs.includes(r.slug)) // band xonalar — clientga ko'rinmaydi
      .filter((r) => (category === "All" ? true : r.category === category))
      .filter((r) =>
        search
          ? r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.subtitle.toLowerCase().includes(search.toLowerCase()) ||
            r.mood.toLowerCase().includes(search.toLowerCase())
          : true,
      )
      .filter((r) => r.guestCount >= guests);
  }, [bookedSlugs, category, search, guests]);

  const totalAvailable = rooms.filter((r) => !bookedSlugs.includes(r.slug)).length;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-12 pt-32 md:px-8 md:pt-40">
        <div className="absolute inset-0 eastern-pattern opacity-50" aria-hidden="true" />
        <div className="absolute -right-20 top-32 h-[420px] w-[420px] rounded-full bg-gold/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow">Rooms & suites</p>
            <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-gold-deep">
              {totalAvailable} available
            </span>
          </div>
          <h1 className="soft-reveal mt-5 max-w-4xl font-serif text-5xl font-light leading-[0.95] md:text-8xl">
            Rest inside the poetry of <span className="italic text-gold">old Bukhara.</span>
          </h1>
          <p className="soft-reveal-delay-1 mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Each room is shaped around tactility — carved wood, suzani softness, golden evening
            light, and the hush of a historic courtyard.
          </p>
          <PatternDivider />
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 -mt-2 px-5 pb-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="luxe-card relative p-4 md:p-6">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
              {/* Search */}
              <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Search className="size-3.5 text-gold-deep" /> Search
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="hotel-input text-sm"
                  placeholder="Room name, mood, or view..."
                />
              </label>

              {/* Dates */}
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="size-3.5 text-gold-deep" /> Check-in
                  </span>
                  <input
                    type="date"
                    min={todayISO()}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="hotel-input text-sm"
                  />
                </label>
                <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="size-3.5 text-gold-deep" /> Check-out
                  </span>
                  <input
                    type="date"
                    min={checkIn || todayISO()}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="hotel-input text-sm"
                  />
                </label>
              </div>

              {/* Guests */}
              <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Users className="size-3.5 text-gold-deep" /> Guests
                </span>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value) || 1)}
                  className="hotel-input w-full text-sm md:w-28"
                />
              </label>
            </div>

            {/* Category tabs */}
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/40 pt-4">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                <Filter className="size-3.5" /> Category:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] transition-all ${
                    category === cat
                      ? "border-gold bg-gold text-primary shadow-glow"
                      : "border-border bg-card text-muted-foreground hover:border-gold/50 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
              {filtersApplied && (
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-700 dark:text-emerald-300">
                  <Sparkles className="size-3" /> Filtered by your dates
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Rooms grid */}
      <section className="px-5 pb-24 pt-6 md:px-8 md:pb-32">
        <div className="mx-auto max-w-7xl">
          {filteredRooms.length === 0 ? (
            <div className="luxe-card mx-auto max-w-xl p-10 text-center">
              <div className="mx-auto grid size-16 place-items-center rounded-full border border-gold/30 bg-gold/10">
                <Sparkles className="size-7 text-gold-deep" />
              </div>
              <h3 className="mt-5 font-serif text-3xl">No rooms match your filters</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Try adjusting your dates, guest count, or category — many of our rooms get booked
                quickly during peak season.
              </p>
              <button
                onClick={() => {
                  setCategory("All");
                  setSearch("");
                  setCheckIn("");
                  setCheckOut("");
                  setGuests(1);
                }}
                className="btn-ghost mt-6"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRooms.map((room) => (
                <RoomCard key={room.slug} room={room} hideIfBooked />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

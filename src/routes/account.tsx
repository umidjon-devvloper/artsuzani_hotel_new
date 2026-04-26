import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LogOut,
  UserRound,
  MessageCircle,
  Sparkles,
  CalendarDays,
  Mail,
  KeyRound,
  ArrowUpRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { SiteHeader } from "@/components/hotel/SiteHeader";
import { PatternDivider } from "@/components/hotel/PatternDivider";
import { supabase } from "@/integrations/supabase/client";
import { WHATSAPP_NUMBER } from "@/lib/hotel";
import type { Tables } from "@/integrations/supabase/types";

type Booking = Tables<"bookings">;

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Bookings · Artsuzani Hotel" },
      {
        name: "description",
        content: "Register, sign in, and view your Artsuzani Hotel room bookings.",
      },
      { property: "og:title", content: "My Artsuzani Hotel Bookings" },
      {
        property: "og:description",
        content: "Guest account page for Artsuzani Hotel room bookings.",
      },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"info" | "error" | "success">("info");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadBookings() {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    setBookings(data ?? []);
  }

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? null);
      if (session?.user) setTimeout(() => void loadBookings(), 0);
      else setBookings([]);
    });

    void supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user.email ?? null);
      if (data.session?.user) void loadBookings();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (result.error) {
      setMessageType("error");
      setMessage(result.error.message);
      return;
    }

    setMessageType("success");
    setMessage(
      mode === "register"
        ? "Account created. Please check your email if confirmation is required."
        : "Signed in successfully.",
    );
  }

  // ────────── Sign in / register ──────────
  if (!userEmail) {
    return (
      <main className="min-h-screen bg-background pb-16 pt-28 text-foreground">
        <SiteHeader />
        <section className="relative px-5 md:px-8">
          <div className="absolute inset-0 eastern-pattern opacity-50" aria-hidden="true" />
          <div className="absolute right-0 top-20 h-[400px] w-[400px] rounded-full bg-gold/10 blur-[120px]" />

          <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            {/* Left — story */}
            <div className="luxe-card relative overflow-hidden p-8 md:p-12">
              <div className="absolute inset-0 suzani-pattern opacity-30" aria-hidden="true" />
              <div className="relative">
                <div className="mb-7 grid size-16 place-items-center rounded-full border border-gold/40 bg-gradient-to-br from-gold/15 to-copper/10">
                  <Sparkles className="size-7 text-gold-deep" />
                </div>
                <p className="eyebrow">Guest account</p>
                <h1 className="mt-5 font-serif text-5xl font-light leading-[0.95] md:text-7xl">
                  Book rooms with your <span className="italic text-gold">own account.</span>
                </h1>
                <p className="mt-7 text-lg leading-8 text-muted-foreground">
                  Register once, reserve a room, then return to see your booking status — and
                  confirm payment with us via WhatsApp.
                </p>
                <PatternDivider />
                <ul className="grid gap-3">
                  {[
                    "Save bookings to your private account",
                    "Track status: pending, paid, cancelled",
                    "Direct WhatsApp confirmation channel",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                      <span className="grid size-6 place-items-center rounded-full border border-gold/40 bg-gold/15 text-gold-deep">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right — form */}
            <form onSubmit={handleAuth} className="luxe-card relative space-y-5 p-7 md:p-9">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-full border border-gold/40 bg-gradient-to-br from-gold/15 to-copper/10 text-gold-deep">
                  <UserRound className="size-5" />
                </span>
                <div>
                  <p className="text-[0.66rem] uppercase tracking-[0.28em] text-muted-foreground">
                    {mode === "login" ? "Welcome back" : "Create account"}
                  </p>
                  <h2 className="font-serif text-3xl text-foreground">
                    {mode === "login" ? "Sign in" : "Register"}
                  </h2>
                </div>
              </div>

              {/* Toggle */}
              <div className="grid grid-cols-2 gap-1 rounded-full border border-border bg-secondary/40 p-1">
                {(["login", "register"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMode(m);
                      setMessage("");
                    }}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-all ${
                      mode === m
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m === "login" ? "Sign in" : "Register"}
                  </button>
                ))}
              </div>

              <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Mail className="size-3.5 text-gold-deep" /> Email
                </span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="hotel-input text-sm"
                  placeholder="you@example.com"
                  type="email"
                  required
                  autoComplete="email"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <KeyRound className="size-3.5 text-gold-deep" /> Password
                </span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="hotel-input text-sm"
                  placeholder="Minimum 6 characters"
                  type="password"
                  minLength={6}
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
              </label>

              {message && (
                <div
                  className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${
                    messageType === "error"
                      ? "border-destructive/30 bg-destructive/10 text-destructive"
                      : messageType === "success"
                        ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "border-border bg-secondary text-muted-foreground"
                  }`}
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-gold w-full">
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Please wait...
                  </>
                ) : mode === "login" ? (
                  <>
                    Sign in <ArrowUpRight className="size-4" />
                  </>
                ) : (
                  <>
                    Create account <Sparkles className="size-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  // ────────── Authenticated ──────────
  return (
    <main className="min-h-screen bg-background pb-20 pt-28 text-foreground">
      <SiteHeader />
      <section className="relative px-5 md:px-8">
        <div className="absolute inset-0 eastern-pattern opacity-30" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">My account</p>
              <h1 className="mt-3 font-serif text-5xl font-light md:text-7xl">
                My <span className="italic text-gold">bookings</span>
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">Signed in as {userEmail}</p>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="btn-ghost"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </div>

          <PatternDivider />

          {/* Bookings */}
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}

            {bookings.length === 0 && (
              <div className="luxe-card p-10 text-center">
                <div className="mx-auto grid size-16 place-items-center rounded-full border border-gold/30 bg-gold/10">
                  <CalendarDays className="size-7 text-gold-deep" />
                </div>
                <h2 className="mt-5 font-serif text-3xl">No bookings yet</h2>
                <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                  Choose a room and create your first booking request — your reservations will
                  appear here.
                </p>
                <Link to="/rooms" className="btn-gold mt-7">
                  Explore rooms <ArrowUpRight className="size-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const statusClass =
    booking.status === "paid"
      ? "status-paid"
      : booking.status === "cancelled"
        ? "status-cancelled"
        : "status-pending";

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Artsuzani Hotel,\n\nI have a booking request:\n\nRoom: ${booking.room_name}\nName: ${booking.guest_name}\nPhone: ${booking.phone}\nDates: ${booking.check_in} → ${booking.check_out}\nGuests: ${booking.guests}\n\nI would like to confirm and make payment.`,
  )}`;

  const nights = Math.max(
    1,
    Math.round(
      (new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );

  return (
    <article className="luxe-card relative overflow-hidden p-6 transition-all hover:-translate-y-0.5 md:p-8">
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gold/5 blur-3xl" />
      <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold-deep">
              <CalendarDays className="size-5" />
            </span>
            <div>
              <h2 className="font-serif text-2xl text-foreground md:text-3xl">
                {booking.room_name}
              </h2>
              <p className="mt-0.5 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {nights} night{nights > 1 ? "s" : ""} · {booking.guests} guest
                {booking.guests > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-2 text-sm md:grid-cols-3">
            <Field label="Check-in" value={booking.check_in} />
            <Field label="Check-out" value={booking.check_out} />
            <Field label="Booked by" value={booking.guest_name} />
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-3 md:items-end">
          <span className={`status-badge ${statusClass}`}>{booking.status}</span>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-medium text-emerald-700 transition-all hover:-translate-y-0.5 hover:bg-emerald-500/20 dark:text-emerald-300"
          >
            <MessageCircle className="size-4" /> Confirm & pay via WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-secondary/30 px-4 py-3">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

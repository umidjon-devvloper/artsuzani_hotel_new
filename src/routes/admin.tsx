import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  LogOut,
  ShieldCheck,
  Trash2,
  Search,
  Mail,
  KeyRound,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Phone,
  CalendarDays,
  Home,
  Sparkles,
  Plus,
  Lock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/hotel/SiteHeader";
import { PatternDivider } from "@/components/hotel/PatternDivider";
import { AdminBookingDialog } from "@/components/hotel/AdminBookingDialog";
import { rooms, type Room } from "@/lib/hotel";
import type { Tables } from "@/integrations/supabase/types";

type Booking = Tables<"bookings">;
type Tab = "bookings" | "rooms";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard · Artsuzani Hotel" },
      {
        name: "description",
        content: "Secure Artsuzani Hotel booking dashboard for managing guest requests.",
      },
      { property: "og:title", content: "Artsuzani Hotel Admin" },
      { property: "og:description", content: "Manage booking requests and statuses." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid" | "cancelled">(
    "all",
  );
  const [tab, setTab] = useState<Tab>("bookings");
  // Manual booking dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [preselectedRoom, setPreselectedRoom] = useState<Room | undefined>(undefined);

  async function refreshBookings() {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    setBookings(data ?? []);
  }

  async function checkAdmin(userId: string) {
    const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    setIsAdmin(Boolean(data));
    if (data) await refreshBookings();
  }

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionReady(true);
      if (session?.user) {
        setTimeout(() => void checkAdmin(session.user.id), 0);
      } else {
        setIsAdmin(false);
        setBookings([]);
      }
    });

    void supabase.auth.getSession().then(({ data }) => {
      setSessionReady(true);
      if (data.session?.user) void checkAdmin(data.session.user.id);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const stats = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      paid: bookings.filter((b) => b.status === "paid").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
      revenue: bookings
        .filter((b) => b.status === "paid")
        .reduce((sum, b) => {
          const room = rooms.find((r) => r.slug === b.room_slug);
          if (!room) return sum;
          const nights = Math.max(
            1,
            Math.round(
              (new Date(b.check_out).getTime() - new Date(b.check_in).getTime()) /
                (1000 * 60 * 60 * 24),
            ),
          );
          return sum + room.priceValue * nights;
        }, 0),
    }),
    [bookings],
  );

  // Hozirgi vaqtdagi band xonalar
  const currentlyBookedSlugs = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return new Set(
      bookings
        .filter(
          (b) =>
            ["pending", "paid"].includes(b.status) &&
            b.check_in <= today &&
            b.check_out > today,
        )
        .map((b) => b.room_slug),
    );
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    return bookings
      .filter((b) => (statusFilter === "all" ? true : b.status === statusFilter))
      .filter((b) =>
        search
          ? [b.guest_name, b.phone, b.room_name].some((field) =>
              field.toLowerCase().includes(search.toLowerCase()),
            )
          : true,
      );
  }, [bookings, search, statusFilter]);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (error) setAuthError(error.message);
  }

  async function updateStatus(id: string, status: "pending" | "paid" | "cancelled") {
    await supabase.from("bookings").update({ status }).eq("id", id);
    await refreshBookings();
  }

  async function deleteBooking(id: string) {
    if (!confirm("Are you sure you want to permanently delete this booking?")) return;
    await supabase.from("bookings").delete().eq("id", id);
    await refreshBookings();
  }

  function openDialogForRoom(room?: Room) {
    setPreselectedRoom(room);
    setDialogOpen(true);
  }

  // ────────── Loading ──────────
  if (!sessionReady) {
    return (
      <main className="grid min-h-screen place-items-center bg-background text-foreground">
        <div className="text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-gold" />
          <p className="mt-3 text-sm uppercase tracking-[0.22em] text-muted-foreground">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  // ────────── Login ──────────
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-background pt-28 text-foreground">
        <SiteHeader />
        <section className="relative px-5 md:px-8">
          <div className="absolute inset-0 eastern-pattern opacity-50" aria-hidden="true" />
          <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-gold/10 blur-[120px]" />

          <div className="relative mx-auto max-w-md">
            <div className="luxe-card relative space-y-6 p-7 md:p-9">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

              <div className="grid size-14 place-items-center rounded-full border border-gold/40 bg-gradient-to-br from-gold/15 to-copper/10">
                <ShieldCheck className="size-7 text-gold-deep" />
              </div>

              <div>
                <p className="text-[0.66rem] uppercase tracking-[0.28em] text-muted-foreground">
                  Restricted area
                </p>
                <h1 className="mt-2 font-serif text-4xl font-light">Admin login</h1>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Sign in with the hotel admin email and password to manage booking requests.
                </p>
              </div>

              <form onSubmit={signIn} className="space-y-4">
                <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Mail className="size-3.5 text-gold-deep" /> Email
                  </span>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="hotel-input text-sm"
                    placeholder="admin@artsuzani.com"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </label>
                <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <KeyRound className="size-3.5 text-gold-deep" /> Password
                  </span>
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="hotel-input text-sm"
                    placeholder="Your password"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </label>

                {authError && (
                  <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <button type="submit" disabled={authLoading} className="btn-gold w-full">
                  {authLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ────────── Admin dashboard ──────────
  return (
    <main className="min-h-screen bg-background pb-16 pt-28 text-foreground">
      <SiteHeader />

      <section className="px-5 md:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Private dashboard</p>
              <h1 className="mt-3 font-serif text-5xl font-light md:text-7xl">
                Hotel <span className="italic text-gold">control</span>
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => openDialogForRoom(undefined)}
                className="btn-gold"
              >
                <Plus className="size-4" /> New booking
              </button>
              <button onClick={() => supabase.auth.signOut()} className="btn-ghost">
                <LogOut className="size-4" /> Sign out
              </button>
            </div>
          </div>

          <PatternDivider />

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StatCard
              icon={BarChart3}
              label="Total bookings"
              value={stats.total}
              tone="neutral"
            />
            <StatCard icon={Clock} label="Pending" value={stats.pending} tone="warning" />
            <StatCard icon={CheckCircle2} label="Paid" value={stats.paid} tone="success" />
            <StatCard icon={XCircle} label="Cancelled" value={stats.cancelled} tone="danger" />
            <StatCard
              icon={Sparkles}
              label="Revenue (USD)"
              value={`$${stats.revenue}`}
              tone="gold"
            />
          </div>

          {/* Tabs */}
          <div className="mt-10 flex flex-wrap items-center gap-2 border-b border-border/50">
            <TabButton active={tab === "bookings"} onClick={() => setTab("bookings")}>
              <CalendarDays className="size-4" /> Bookings
            </TabButton>
            <TabButton active={tab === "rooms"} onClick={() => setTab("rooms")}>
              <Home className="size-4" /> Rooms ({rooms.length})
              {currentlyBookedSlugs.size > 0 && (
                <span className="ml-1 rounded-full bg-destructive/15 px-2 py-0.5 text-[0.66rem] text-destructive">
                  {currentlyBookedSlugs.size} booked
                </span>
              )}
            </TabButton>
          </div>

          {/* ────────── BOOKINGS TAB ────────── */}
          {tab === "bookings" && (
            <>
              {/* Search + filter */}
              <div className="luxe-card mt-6 grid gap-3 p-5 md:grid-cols-[1fr_auto] md:items-end">
                <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Search className="size-3.5 text-gold-deep" /> Search
                  </span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="hotel-input text-sm"
                    placeholder="Guest name, phone, or room..."
                  />
                </label>

                <div className="flex flex-wrap gap-2">
                  {(["all", "pending", "paid", "cancelled"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition-all ${
                        statusFilter === s
                          ? "border-gold bg-gold text-primary shadow-glow"
                          : "border-border bg-card text-muted-foreground hover:border-gold/50 hover:text-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings table */}
              <div className="luxe-card mt-5 overflow-hidden p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[960px] text-left text-sm">
                    <thead className="bg-secondary/60 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      <tr>
                        <th className="p-4">Guest & Room</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">Dates</th>
                        <th className="p-4">Guests</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking) => (
                        <BookingRow
                          key={booking.id}
                          booking={booking}
                          onUpdateStatus={updateStatus}
                          onDelete={deleteBooking}
                        />
                      ))}
                      {filteredBookings.length === 0 && (
                        <tr>
                          <td
                            className="p-12 text-center text-muted-foreground"
                            colSpan={6}
                          >
                            <Sparkles className="mx-auto mb-3 size-8 text-gold-deep" />
                            <p className="font-serif text-2xl text-foreground">
                              No bookings to display
                            </p>
                            <p className="mt-1 text-sm">
                              Try adjusting your filters, or click "New booking" above to add one
                              manually.
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ────────── ROOMS TAB ────────── */}
          {tab === "rooms" && (
            <>
              {/* Helper */}
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm text-muted-foreground">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-gold-deep" />
                <p>
                  Click <strong className="text-foreground">"Mark as booked"</strong> on any room
                  to instantly hide it from clients and create a manual booking entry. Useful for
                  walk-ins, phone calls, or third-party reservations.
                </p>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rooms.map((room) => {
                  const isBooked = currentlyBookedSlugs.has(room.slug);
                  const totalBookings = bookings.filter((b) => b.room_slug === room.slug).length;
                  return (
                    <div key={room.slug} className="luxe-card relative overflow-hidden">
                      <div className="image-frame relative aspect-[4/3] overflow-hidden rounded-t-[var(--radius-xl)] rounded-b-none">
                        <img
                          src={room.image}
                          alt={room.name}
                          className={`h-full w-full object-cover ${isBooked ? "grayscale" : ""}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
                        {isBooked ? (
                          <div className="floating-badge absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-destructive">
                            <span className="size-2 rounded-full bg-destructive shadow-[0_0_8px_currentColor]" />
                            Booked now
                          </div>
                        ) : (
                          <div className="floating-badge absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
                            <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_currentColor]" />
                            Available
                          </div>
                        )}
                      </div>
                      <div className="space-y-3 p-5">
                        <div>
                          <h3 className="font-serif text-2xl text-foreground">{room.name}</h3>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            {room.category} · {room.guests} · {room.size}
                          </p>
                        </div>
                        <div className="flex items-center justify-between border-t border-border/50 pt-3">
                          <span className="font-serif text-xl text-gold-deep">
                            {room.price}
                            <span className="text-xs text-muted-foreground"> / night</span>
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {totalBookings} total
                          </span>
                        </div>
                        {/* ⭐ NEW: Mark as booked button */}
                        <button
                          onClick={() => openDialogForRoom(room)}
                          className={`mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium uppercase tracking-[0.16em] transition-all ${
                            isBooked
                              ? "border border-border bg-secondary/40 text-muted-foreground hover:bg-secondary"
                              : "border border-gold bg-gradient-to-br from-gold to-gold-deep text-primary shadow-[0_8px_20px_-8px_var(--gold-deep)] hover:-translate-y-0.5"
                          }`}
                        >
                          <Lock className="size-3.5" />
                          {isBooked ? "Add another booking" : "Mark as booked"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ⭐ Manual booking dialog */}
      <AdminBookingDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={refreshBookings}
        preselectedRoom={preselectedRoom}
      />
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  tone: "neutral" | "warning" | "success" | "danger" | "gold";
}) {
  const toneClasses = {
    neutral: "text-foreground",
    warning: "text-yellow-600 dark:text-yellow-400",
    success: "text-emerald-600 dark:text-emerald-400",
    danger: "text-destructive",
    gold: "text-gold-deep",
  } as const;

  return (
    <div className="luxe-card relative overflow-hidden p-5">
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gold/5 blur-2xl" />
      <Icon className={`mb-4 size-5 ${toneClasses[tone]}`} />
      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className={`mt-2 font-serif text-4xl font-light ${toneClasses[tone]}`}>{value}</p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`-mb-px inline-flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] transition-all ${
        active
          ? "border-gold text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function BookingRow({
  booking,
  onUpdateStatus,
  onDelete,
}: {
  booking: Booking;
  onUpdateStatus: (id: string, status: "pending" | "paid" | "cancelled") => void;
  onDelete: (id: string) => void;
}) {
  const statusClass =
    booking.status === "paid"
      ? "status-paid"
      : booking.status === "cancelled"
        ? "status-cancelled"
        : "status-pending";

  return (
    <tr className="border-t border-border/40 transition-colors hover:bg-secondary/30">
      <td className="p-4">
        <p className="font-medium text-foreground">{booking.guest_name}</p>
        <p className="mt-0.5 text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {booking.room_name}
        </p>
      </td>
      <td className="p-4">
        <p className="inline-flex items-center gap-1.5 text-sm">
          <Phone className="size-3.5 text-gold-deep" />
          {booking.phone}
        </p>
      </td>
      <td className="p-4">
        <p className="text-sm text-foreground">
          {booking.check_in}
          <span className="mx-2 text-muted-foreground">→</span>
          {booking.check_out}
        </p>
      </td>
      <td className="p-4">
        <span className="inline-flex items-center gap-1.5 text-sm">
          <Users className="size-3.5 text-gold-deep" />
          {booking.guests}
        </span>
      </td>
      <td className="p-4">
        <span className={`status-badge ${statusClass}`}>{booking.status}</span>
      </td>
      <td className="p-4">
        <div className="flex justify-end gap-2">
          {booking.status !== "paid" && (
            <button
              onClick={() => onUpdateStatus(booking.id, "paid")}
              className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-500/20 dark:text-emerald-300"
              title="Mark as paid"
            >
              <CheckCircle2 className="size-3.5" /> Paid
            </button>
          )}
          {booking.status !== "cancelled" && (
            <button
              onClick={() => onUpdateStatus(booking.id, "cancelled")}
              className="inline-flex items-center gap-1 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-700 transition-colors hover:bg-yellow-500/20 dark:text-yellow-300"
              title="Cancel"
            >
              <XCircle className="size-3.5" /> Cancel
            </button>
          )}
          <button
            onClick={() => onDelete(booking.id)}
            className="inline-flex items-center gap-1 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20"
            title="Delete"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

import { useEffect, useMemo, useState } from "react";
import {
  X,
  CalendarDays,
  Users,
  Phone,
  UserRound,
  Sparkles,
  AlertCircle,
  Loader2,
  Home,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { rooms, type Room, getBookedRoomSlugsForDates } from "@/lib/hotel";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  /** Agar oldindan tanlangan xona bo'lsa */
  preselectedRoom?: Room;
};

const todayISO = () => new Date().toISOString().split("T")[0];

export function AdminBookingDialog({ open, onClose, onCreated, preselectedRoom }: Props) {
  const [roomSlug, setRoomSlug] = useState(preselectedRoom?.slug ?? rooms[0]?.slug ?? "");
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState(todayISO());
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [status, setStatus] = useState<"pending" | "paid">("paid");
  const [bookedSlugsForDates, setBookedSlugsForDates] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset on open / preselect room
  useEffect(() => {
    if (open) {
      setRoomSlug(preselectedRoom?.slug ?? rooms[0]?.slug ?? "");
      setGuestName("");
      setPhone("");
      setCheckIn(todayISO());
      setCheckOut("");
      setGuests(2);
      setStatus("paid");
      setError("");
    }
  }, [open, preselectedRoom]);

  // Real-time check: tanlangan sanalarda qaysi xonalar band?
  useEffect(() => {
    if (!checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)) {
      setBookedSlugsForDates([]);
      return;
    }
    let cancelled = false;
    void getBookedRoomSlugsForDates(checkIn, checkOut).then((slugs) => {
      if (!cancelled) setBookedSlugsForDates(slugs);
    });
    return () => {
      cancelled = true;
    };
  }, [checkIn, checkOut]);

  // ESC bilan yopish
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.slug === roomSlug),
    [roomSlug],
  );

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff =
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.round(diff) : 0;
  }, [checkIn, checkOut]);

  const totalPrice = nights * (selectedRoom?.priceValue ?? 0);

  const isRoomConflict = bookedSlugsForDates.includes(roomSlug);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!selectedRoom) {
      setError("Please choose a room.");
      return;
    }
    if (!guestName.trim() || !phone.trim()) {
      setError("Guest name and phone are required.");
      return;
    }
    if (!checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)) {
      setError("Check-out must be after check-in.");
      return;
    }
    if (isRoomConflict) {
      setError("This room is already booked for the selected dates.");
      return;
    }

    setLoading(true);
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user.id;

    if (!userId) {
      setLoading(false);
      setError("Admin session expired. Please sign in again.");
      return;
    }

    const { error: insertError } = await supabase.from("bookings").insert({
      user_id: userId,
      room_slug: selectedRoom.slug,
      room_name: selectedRoom.name,
      guest_name: guestName.trim(),
      phone: phone.trim(),
      check_in: checkIn,
      check_out: checkOut,
      guests,
      status,
    });

    setLoading(false);

    if (insertError) {
      if (
        insertError.message?.toLowerCase().includes("already booked") ||
        insertError.code === "23505"
      ) {
        setError("This room is already booked for the selected dates.");
        return;
      }
      setError(`Could not create booking: ${insertError.message}`);
      return;
    }

    onCreated();
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="animate-scale-in fixed inset-0 z-[60] grid place-items-center bg-primary/85 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="luxe-card relative max-h-[92vh] w-full max-w-2xl overflow-y-auto p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="mb-6 flex items-center gap-3 pr-10">
          <span className="grid size-12 shrink-0 place-items-center rounded-full border border-gold/40 bg-gradient-to-br from-gold/15 to-copper/10 text-gold-deep">
            <CalendarDays className="size-5" />
          </span>
          <div>
            <p className="text-[0.66rem] uppercase tracking-[0.28em] text-muted-foreground">
              Admin · Manual booking
            </p>
            <h2 className="font-serif text-3xl text-foreground">Block a room</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              For walk-ins, phone calls, WhatsApp, or third-party bookings.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Room picker */}
          <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Home className="size-3.5 text-gold-deep" /> Room
            </span>
            <select
              value={roomSlug}
              onChange={(e) => setRoomSlug(e.target.value)}
              className="hotel-input text-sm"
              required
            >
              {rooms.map((room) => {
                const conflict = bookedSlugsForDates.includes(room.slug);
                return (
                  <option key={room.slug} value={room.slug} disabled={conflict}>
                    {room.name} — {room.price}/night ({room.category}, {room.guests})
                    {conflict ? " · BOOKED" : ""}
                  </option>
                );
              })}
            </select>
          </label>

          {/* Guest info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <UserRound className="size-3.5 text-gold-deep" /> Guest name
              </span>
              <input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="hotel-input text-sm"
                placeholder="Full name"
                required
              />
            </label>
            <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Phone className="size-3.5 text-gold-deep" /> Phone
              </span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="hotel-input text-sm"
                placeholder="+998 ..."
                required
              />
            </label>
          </div>

          {/* Dates + guests */}
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-3.5 text-gold-deep" /> Check-in
              </span>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="hotel-input text-sm"
                required
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
                required
              />
            </label>
            <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Users className="size-3.5 text-gold-deep" /> Guests
              </span>
              <input
                type="number"
                min={1}
                max={selectedRoom?.guestCount ?? 6}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value) || 1)}
                className="hotel-input text-sm"
                required
              />
            </label>
          </div>

          {/* Status toggle */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Initial status
            </p>
            <div className="grid grid-cols-2 gap-1 rounded-full border border-border bg-secondary/40 p-1">
              {(["pending", "paid"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-all ${
                    status === s
                      ? s === "paid"
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "bg-gold text-primary shadow-glow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s === "paid" ? "✓ Confirmed (paid)" : "⏳ Pending"}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {status === "paid"
                ? "Room will appear as fully booked to clients."
                : "Reserved but not yet paid — still hidden from clients."}
            </p>
          </div>

          {/* Conflict warning */}
          {isRoomConflict && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>
                <strong>{selectedRoom?.name}</strong> is already booked for these dates. Please
                choose another room or different dates.
              </span>
            </div>
          )}

          {/* Price summary */}
          {nights > 0 && selectedRoom && !isRoomConflict && (
            <div className="rounded-xl border border-gold/20 bg-gradient-to-br from-gold/5 via-transparent to-copper/5 p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {selectedRoom.price} × {nights} night{nights > 1 ? "s" : ""}
                </span>
                <span className="font-medium text-foreground">${totalPrice}</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-2">
                <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Total
                </span>
                <span className="font-serif text-2xl font-medium text-gold-deep">
                  ${totalPrice}
                </span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || isRoomConflict}
              className="btn-gold"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Creating...
                </>
              ) : status === "paid" ? (
                <>
                  <CheckCircle2 className="size-4" /> Block room (paid)
                </>
              ) : (
                <>
                  <Sparkles className="size-4" /> Block room (pending)
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

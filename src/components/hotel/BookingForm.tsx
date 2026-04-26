import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, LogIn, AlertCircle, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { checkRoomAvailability, type Room } from "@/lib/hotel";

const bookingSchema = z
  .object({
    name: z.string().trim().min(2, "Name is required").max(100),
    phone: z.string().trim().min(5, "Phone is required").max(40),
    checkIn: z.string().min(1, "Check-in is required"),
    checkOut: z.string().min(1, "Check-out is required"),
    guests: z.coerce.number().int().min(1).max(12),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });

type BookingFormValues = z.infer<typeof bookingSchema>;

const todayISO = () => new Date().toISOString().split("T")[0];

export function BookingForm({ room }: { room: Room }) {
  const [values, setValues] = useState<BookingFormValues>({
    name: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityState, setAvailabilityState] =
    useState<"idle" | "checking" | "available" | "unavailable">("idle");

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
    });

    void supabase.auth.getSession().then(({ data }) =>
      setUserId(data.session?.user.id ?? null),
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  // Real-time availability check on date change
  useEffect(() => {
    let cancelled = false;
    const { checkIn, checkOut } = values;

    if (!checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)) {
      setAvailabilityState("idle");
      return;
    }

    setAvailabilityState("checking");
    const t = setTimeout(async () => {
      const ok = await checkRoomAvailability(room.slug, checkIn, checkOut);
      if (!cancelled) setAvailabilityState(ok ? "available" : "unavailable");
    }, 320);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [room.slug, values.checkIn, values.checkOut]);

  const nights = useMemo(() => {
    if (!values.checkIn || !values.checkOut) return 0;
    const diff =
      (new Date(values.checkOut).getTime() - new Date(values.checkIn).getTime()) /
      (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.round(diff) : 0;
  }, [values.checkIn, values.checkOut]);

  const totalPrice = nights * room.priceValue;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!userId) {
      setError("Please register or sign in before booking this room.");
      return;
    }

    const parsed = bookingSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your booking details.");
      return;
    }

    if (availabilityState === "unavailable") {
      setError("This room is unavailable for the selected dates. Please choose other dates.");
      return;
    }

    setIsSubmitting(true);
    const data = parsed.data;

    // Final availability check before insert
    const ok = await checkRoomAvailability(room.slug, data.checkIn, data.checkOut);
    if (!ok) {
      setIsSubmitting(false);
      setAvailabilityState("unavailable");
      setError("Sorry — this room was just booked. Please pick different dates.");
      return;
    }

    const { error: bookingError } = await supabase.from("bookings").insert({
      user_id: userId,
      room_slug: room.slug,
      room_name: room.name,
      guest_name: data.name,
      phone: data.phone,
      check_in: data.checkIn,
      check_out: data.checkOut,
      guests: data.guests,
    });

    setIsSubmitting(false);

    if (bookingError) {
      // Postgres exception via trigger
      if (
        bookingError.message?.toLowerCase().includes("already booked") ||
        bookingError.code === "23505"
      ) {
        setAvailabilityState("unavailable");
        setError("This room is no longer available for the selected dates.");
        return;
      }
      setError("We could not save the request. Please try again or contact us.");
      return;
    }

    window.location.href = "/account";
  }

  if (!userId) {
    return (
      <div className="luxe-card relative space-y-5 p-6 md:p-8">
        <div className="absolute inset-0 suzani-pattern opacity-30" aria-hidden="true" />
        <div className="relative flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-full border border-gold/40 bg-gradient-to-br from-gold/15 to-copper/10 text-gold">
            <LogIn className="size-5" />
          </span>
          <div>
            <h3 className="font-serif text-2xl text-foreground">Sign in to book</h3>
            <p className="text-sm text-muted-foreground">
              Create an account first — your booking will appear in your dashboard.
            </p>
          </div>
        </div>
        <Link to="/account" className="btn-gold relative w-full">
          Register or sign in
        </Link>
      </div>
    );
  }

  const today = todayISO();

  return (
    <form
      onSubmit={handleSubmit}
      className="luxe-card relative space-y-5 p-6 md:p-7"
      aria-label="Booking form"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-full border border-gold/40 bg-gradient-to-br from-gold/15 to-copper/10 text-gold">
          <CalendarDays className="size-5" />
        </span>
        <div className="flex-1">
          <p className="text-[0.66rem] uppercase tracking-[0.28em] text-muted-foreground">
            Reservation
          </p>
          <h3 className="font-serif text-2xl text-foreground">Reserve {room.name}</h3>
        </div>
      </div>

      <div className="grid gap-4">
        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Full name
          <input
            value={values.name}
            onChange={(event) => setValues({ ...values, name: event.target.value })}
            className="hotel-input text-sm"
            placeholder="Your full name"
            autoComplete="name"
          />
        </label>
        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Phone
          <input
            value={values.phone}
            onChange={(event) => setValues({ ...values, phone: event.target.value })}
            className="hotel-input text-sm"
            placeholder="+998 ..."
            autoComplete="tel"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Check-in
            <input
              type="date"
              min={today}
              value={values.checkIn}
              onChange={(event) => setValues({ ...values, checkIn: event.target.value })}
              className="hotel-input text-sm"
            />
          </label>
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Check-out
            <input
              type="date"
              min={values.checkIn || today}
              value={values.checkOut}
              onChange={(event) => setValues({ ...values, checkOut: event.target.value })}
              className="hotel-input text-sm"
            />
          </label>
        </div>
        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Guests
          <input
            type="number"
            min="1"
            max={room.guestCount}
            value={values.guests}
            onChange={(event) => setValues({ ...values, guests: Number(event.target.value) })}
            className="hotel-input text-sm"
          />
        </label>
      </div>

      {/* Availability indicator */}
      {availabilityState !== "idle" && (
        <div
          className={`rounded-xl border p-3.5 text-sm transition-all ${
            availabilityState === "available"
              ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : availabilityState === "unavailable"
                ? "border-destructive/40 bg-destructive/10 text-destructive"
                : "border-gold/40 bg-gold/10 text-gold-deep"
          }`}
        >
          <div className="flex items-center gap-2">
            {availabilityState === "checking" && <Loader2 className="size-4 animate-spin" />}
            {availabilityState === "available" && <CheckCircle2 className="size-4" />}
            {availabilityState === "unavailable" && <AlertCircle className="size-4" />}
            <span className="font-medium">
              {availabilityState === "checking" && "Checking availability..."}
              {availabilityState === "available" && "Available for these dates"}
              {availabilityState === "unavailable" && "Booked for these dates — try other dates"}
            </span>
          </div>
        </div>
      )}

      {/* Price summary */}
      {nights > 0 && availabilityState !== "unavailable" && (
        <div className="rounded-xl border border-gold/20 bg-gradient-to-br from-gold/5 via-transparent to-copper/5 p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {room.price} × {nights} night{nights > 1 ? "s" : ""}
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

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || availabilityState === "unavailable"}
        className="btn-gold w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Processing...
          </>
        ) : (
          <>
            <Sparkles className="size-4" /> Book now
          </>
        )}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Saved to your account. Confirm & pay via WhatsApp afterwards.
      </p>
    </form>
  );
}

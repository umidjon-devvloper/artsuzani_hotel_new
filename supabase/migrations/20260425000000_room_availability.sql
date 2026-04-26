-- ─────────────────────────────────────────────────────────────
-- Migration: Public room availability for clients
-- 
-- Bu migration mehmon (anon) foydalanuvchilarga band qilingan
-- xonalarni (sana oraliqlari bilan) ko'rishga ruxsat beradi —
-- shaxsiy ma'lumotlarni (ism, telefon, email) ko'rsatmaydi.
-- ─────────────────────────────────────────────────────────────

-- 1) Public view: faqat band qilingan xonalar va sanalar
-- Bekor qilingan (cancelled) bronlar hisobga olinmaydi.
CREATE OR REPLACE VIEW public.room_availability AS
SELECT
  room_slug,
  check_in,
  check_out,
  status
FROM public.bookings
WHERE status IN ('pending', 'paid');

-- View'ga grant
GRANT SELECT ON public.room_availability TO anon, authenticated;

-- 2) Helper funksiya — ma'lum xona ma'lum sanalarda band ekanligini tekshiradi
CREATE OR REPLACE FUNCTION public.is_room_available(
  _room_slug TEXT,
  _check_in DATE,
  _check_out DATE
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1
    FROM public.bookings
    WHERE room_slug = _room_slug
      AND status IN ('pending', 'paid')
      AND (
        -- Sana oraliqlari kesishadimi?
        (check_in < _check_out AND check_out > _check_in)
      )
  )
$$;

GRANT EXECUTE ON FUNCTION public.is_room_available(TEXT, DATE, DATE) TO anon, authenticated;

-- 3) Hozirgi sanaga (bugun) qaysi xonalar band ekanligini ko'radigan
-- public view — bosh sahifada va xonalar ro'yxatida ishlatish uchun
CREATE OR REPLACE VIEW public.currently_booked_rooms AS
SELECT DISTINCT room_slug
FROM public.bookings
WHERE status IN ('pending', 'paid')
  AND check_in <= CURRENT_DATE
  AND check_out > CURRENT_DATE;

GRANT SELECT ON public.currently_booked_rooms TO anon, authenticated;

-- 4) Booking yaratishda overlap'ni oldini olish — DB darajasida himoya
CREATE OR REPLACE FUNCTION public.prevent_overlapping_bookings()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.bookings
    WHERE room_slug = NEW.room_slug
      AND id <> NEW.id
      AND status IN ('pending', 'paid')
      AND check_in < NEW.check_out
      AND check_out > NEW.check_in
  ) THEN
    RAISE EXCEPTION 'This room is already booked for the selected dates'
      USING ERRCODE = '23505';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_booking_overlap ON public.bookings;
CREATE TRIGGER prevent_booking_overlap
BEFORE INSERT OR UPDATE OF check_in, check_out, status, room_slug
ON public.bookings
FOR EACH ROW
WHEN (NEW.status IN ('pending', 'paid'))
EXECUTE FUNCTION public.prevent_overlapping_bookings();

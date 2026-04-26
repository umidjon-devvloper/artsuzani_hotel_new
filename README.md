# 🏛️ Artsuzani Hotel — Premium Bukhara Boutique Hotel

Premium darajadagi mehmonxona sayti — **TanStack Router + React 19 + Supabase + Tailwind CSS v4** stack ustida qurilgan.

---

## 🆕 Bu yangilanishda nima o'zgardi?

### 🎨 Premium dizayn
- **Cormorant Garamond** (display) + **Inter** (body) fontlari Google Fonts orqali ulandi
- Tozalangan oltin (gold) palettesi: `--gold`, `--gold-deep`, `--copper`, `--terracotta`
- Layered shadowlar (`--shadow-luxe`, `--shadow-royal`, `--shadow-glow`)
- Glassmorphism navigation, scroll effekt
- Suzani-inspired patternlar va dekorativ medallon dividerlar
- Premium oltin button (`btn-gold`) — shimmer effekt va soft glow bilan
- Soft-reveal animatsiyalar, shimmer text, pulse-gold

### 🛏️ Band xonalar — clientga ko'rinmaydi (eng muhim talab!)
- **Database darajasida**: yangi `currently_booked_rooms` va `room_availability` view'lari yaratildi (anon foydalanuvchilar shaxsiy ma'lumotlarsiz faqat band qilingan slug'larni ko'ra oladi)
- **Bosh sahifada** (`/`): faqat 3 ta available xonani ko'rsatadi
- **Rooms ro'yxatida** (`/rooms`): band xonalar avtomatik filterlanadi
- **Real-time check**: Booking formada sana o'zgartirilganda darhol availability tekshiriladi
- **DB trigger**: `prevent_overlapping_bookings()` — overlap'ni server tomonida bloklaydi (race condition'larni oldini oladi)

### 🛡️ Admin panel
- **Bookings tabi**: search, filter (status), Mark as Paid / Cancel / Delete actionlar
- **Rooms tabi**: har bir xona uchun "Booked now" yoki "Available" indikator
- **5 ta stat card**: Total / Pending / Paid / Cancelled / Revenue (USD avtomatik hisoblanadi)

### 📱 Premium komponentlar
- `SiteHeader` — scroll effekti, mobile drawer menu, glassmorphism
- `RoomCard` — `hideIfBooked` prop, dekorativ corner ornament, booked overlay
- `BookingForm` — real-time availability check, narx hisobi, validatsiya
- `PatternDivider` — Buxoro madrasa medalon ornamenti

---

## 📂 Loyiha tuzilmasi

```
src/
├── components/hotel/
│   ├── SiteHeader.tsx       # Premium nav + mobile drawer
│   ├── RoomCard.tsx         # Booked overlay + hideIfBooked prop
│   ├── BookingForm.tsx      # Real-time availability check
│   └── PatternDivider.tsx   # Decorative ornament
├── lib/
│   └── hotel.ts             # Rooms data + availability helpers
├── routes/
│   ├── __root.tsx           # Premium 404 + Google Fonts
│   ├── index.tsx            # Hero + about + featured rooms + amenities + CTA
│   ├── rooms.index.tsx      # Sticky filter + band xona yashirish
│   ├── rooms.$roomSlug.tsx  # Gallery carousel + sticky booking form
│   ├── gallery.tsx          # Masonry grid + keyboard lightbox
│   ├── account.tsx          # Login/register + booking cards
│   └── admin.tsx            # Bookings + Rooms tabs + stats
└── styles.css               # Premium design tokens

supabase/migrations/
└── 20260425000000_room_availability.sql   # ⭐ YANGI MIGRATION
```

---

## 🚀 Boshlash

### 1. Dependency'larni o'rnatish

```bash
npm install
# yoki
bun install
```

### 2. Supabase migration'ni qo'llash

**Eng muhim qadam!** Yangi migration faylini Supabase'ga qo'llang:

```bash
# Agar Supabase CLI bo'lsa:
supabase db push

# Yoki Supabase Dashboard → SQL Editor da
# `supabase/migrations/20260425000000_room_availability.sql`
# faylining mazmunini qo'lda ishga tushiring
```

Bu migration quyidagilarni yaratadi:
- `currently_booked_rooms` view (anon ko'ra oladi)
- `room_availability` view (anon ko'ra oladi)
- `is_room_available()` SQL funksiyasi
- `prevent_overlapping_bookings()` trigger (DB darajasida himoya)

### 3. Dev server

```bash
npm run dev
```

### 4. Admin yaratish

Birinchi user `admin` roli bilan avtomatik yaratiladi (eski migration shunday sozlangan). Keyin `/admin` sahifasiga kirib, login qilishingiz mumkin.

---

## 🎯 Asosiy mantiq qanday ishlaydi?

### Client tomonida band xona yashirilishi

```typescript
// lib/hotel.ts — anon ham ishlaydigan funksiya:
const bookedSlugs = await getCurrentlyBookedRoomSlugs();
const availableRooms = rooms.filter((r) => !bookedSlugs.includes(r.slug));
```

`currently_booked_rooms` view orqali — clientga **faqat slug** keladi, mehmon ismi/telefoni hech qachon oshkor qilinmaydi.

### Sana asosida tekshiruv

```typescript
// BookingForm.tsx — sana o'zgarganda:
const ok = await checkRoomAvailability(roomSlug, checkIn, checkOut);
// "Available" / "Unavailable" / "Checking..." statusni real-time ko'rsatadi
```

### DB darajasida himoya

Hatto kimdir API'ni chetlab o'tib, band xonaga booking yaratmoqchi bo'lsa, `prevent_booking_overlap` trigger uni rad etadi — shuningdek RLS policy'lari ham himoya qiladi.

---

## 🎨 Dizayn tokenlari (eng muhimlari)

| Token | Vazifasi |
|-------|----------|
| `--gold`, `--gold-deep`, `--copper` | Asosiy oltin paletka |
| `--shadow-luxe`, `--shadow-royal`, `--shadow-glow` | Layered premium shadowlar |
| `--font-display` (Cormorant Garamond) | Bosh sarlavhalar |
| `--font-sans` (Inter) | Body matn |
| `.btn-gold`, `.btn-ghost` | Premium buttonlar |
| `.luxe-card` | Premium kartochka surface |
| `.eastern-pattern`, `.suzani-pattern` | Dekorativ patternlar |
| `.status-pending/.paid/.cancelled` | Status badge'lar |

---

## 📞 Qo'llanma

WhatsApp raqamini o'zgartirish: `src/lib/hotel.ts` → `WHATSAPP_NUMBER` konstantasi.

Logo: hozir `Sparkles` icon ishlatilmoqda (`SiteHeader.tsx`'da). Asl logo URL'ni qo'shish uchun shu fayldagi icon'ni `<img>` bilan almashtiring.

---

**Crafted with ✨ for Old Bukhara hospitality.**

import courtyardImage from "@/assets/bukhara-courtyard.png";
import minaretImage from "@/assets/bukhara-minaret.png";
import { supabase } from "@/integrations/supabase/client";

export type Room = {
  slug: string;
  name: string;
  subtitle: string;
  price: string;
  priceValue: number; // numeric for filtering
  image: string;
  gallery?: string[];
  size: string;
  guests: string;
  guestCount: number;
  mood: string;
  category: "Triple" | "Deluxe" | "Standard";
  details: string;
  amenities: string[];
  highlights?: string[];
};

export const WHATSAPP_NUMBER = "998901234567";

export const WHATSAPP_TEXT = (values: {
  name: string;
  phone: string;
  dates: string;
  guests: number;
}) =>
  `Hello Artsuzani Hotel,\n\nI would like to book a room.\n\nName: ${values.name}\n\nPhone: ${values.phone}\n\nDates: ${values.dates}\n\nGuests: ${values.guests}`;

export const galleryImages = [
  { src: courtyardImage, alt: "Historic Bukhara courtyard reflected in water at dusk" },
  { src: minaretImage, alt: "Illuminated Bukhara minaret and madrasa at sunset" },
  { src: courtyardImage, alt: "Quiet madrasa arches and ancient ceramic details in Bukhara" },
  { src: minaretImage, alt: "Golden evening atmosphere beside old Bukhara architecture" },
  {
    src: "https://8npyms8qz2.ufs.sh/f/tLZsXxIXMCJ3gSHj2PnbIF9c04TjWouklZS8CmqdKvbLywgU",
    alt: "Artsuzani hotel — interior view",
  },
  {
    src: "https://8npyms8qz2.ufs.sh/f/tLZsXxIXMCJ3SyC8rzMjxK9olwTig68ynV2G1pZdrh5RXb3H",
    alt: "Artsuzani hotel — courtyard hospitality",
  },
  {
    src: "https://8npyms8qz2.ufs.sh/f/tLZsXxIXMCJ3humkJr7WpkO4Gzyfdjasu6JvoSTc3FM27AKt",
    alt: "Artsuzani hotel — handcrafted suzani textile detail",
  },
  {
    src: "https://8npyms8qz2.ufs.sh/f/tLZsXxIXMCJ3MCH8En4jptqki8DlwSP92fM0svGYgVOuLaZn",
    alt: "Artsuzani hotel — golden evening light",
  },
  {
    src: "https://8npyms8qz2.ufs.sh/f/tLZsXxIXMCJ31KEvfz9Io80rn3Rxiu6dzpYgkQ7fhFDyZlVG",
    alt: "Artsuzani hotel — architectural detail",
  },
  {
    src: "https://8npyms8qz2.ufs.sh/f/tLZsXxIXMCJ3a8mZAV6I3pmRvxgASNnUbtyi5CXLwJ78Heh0",
    alt: "Artsuzani hotel — ceremonial atmosphere",
  },
];

export const rooms: Room[] = [
  // Triple Rooms (2 rooms) - $75/night
  {
    slug: "triple-deluxe",
    name: "Triple Deluxe",
    subtitle: "Spacious comfort for three travellers exploring together.",
    price: "$75",
    priceValue: 75,
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1600&q=80&auto=format&fit=crop",
    ],
    size: "38 m²",
    guests: "3 guests",
    guestCount: 3,
    mood: "City view",
    category: "Triple",
    details:
      "A generously sized room with traditional Uzbek motifs, perfect for friends or small families. Handwoven textiles and carved wooden details create an authentic Bukhara atmosphere.",
    amenities: ["Three beds", "Private bathroom", "Air conditioning", "Free Wi-Fi"],
    highlights: ["38 m² of space", "Handwoven suzani", "City vista"],
  },
  {
    slug: "triple-classic",
    name: "Triple Classic",
    subtitle: "Authentic Silk Road hospitality in a comfortable triple setting.",
    price: "$75",
    priceValue: 75,
    image:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1600&q=80&auto=format&fit=crop",
    ],
    size: "36 m²",
    guests: "3 guests",
    guestCount: 3,
    mood: "Courtyard view",
    category: "Triple",
    details:
      "Traditional architecture meets modern comfort. Decorated with suzani embroidery and local ceramics, this room offers a genuine taste of Bukhara's heritage.",
    amenities: ["Three beds", "En-suite shower", "Mini-fridge", "Tea service"],
    highlights: ["36 m² of space", "Tea service", "Courtyard outlook"],
  },

  // Deluxe Rooms (3 rooms) - $65/night
  {
    slug: "madrasa-deluxe",
    name: "Madrasa Deluxe",
    subtitle: "Elegant arches, deep rest, and a quiet sense of place.",
    price: "$65",
    priceValue: 65,
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=80&auto=format&fit=crop",
    ],
    size: "34 m²",
    guests: "2 guests",
    guestCount: 2,
    mood: "Historic ambience",
    category: "Deluxe",
    details:
      "A balanced room for travellers who want premium comfort wrapped in Bukhara-inspired geometry, carved woods, and gold details.",
    amenities: ["Queen bed", "Walk-in shower", "Workspace", "City guide"],
    highlights: ["Carved walnut", "Walk-in shower", "Quiet wing"],
  },
  {
    slug: "silk-road-deluxe",
    name: "Silk Road Deluxe",
    subtitle: "Where merchant tales meet modern luxury.",
    price: "$65",
    priceValue: 65,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1600&q=80&auto=format&fit=crop",
    ],
    size: "32 m²",
    guests: "2 guests",
    guestCount: 2,
    mood: "Garden view",
    category: "Deluxe",
    details:
      "Rich fabrics and intricate tilework tell stories of ancient caravans. Enjoy premium bedding and thoughtful amenities in this refined retreat.",
    amenities: ["Double bed", "Marble bathroom", "Sitting area", "Breakfast included"],
    highlights: ["Marble bathroom", "Breakfast included", "Garden view"],
  },
  {
    slug: "bukhara-deluxe",
    name: "Bukhara Deluxe",
    subtitle: "Contemporary elegance with traditional soul.",
    price: "$65",
    priceValue: 65,
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=80&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=80&auto=format&fit=crop",
    ],
    size: "33 m²",
    guests: "2 guests",
    guestCount: 2,
    mood: "Minaret view",
    category: "Deluxe",
    details:
      "Wake to views of historic minarets from your comfortable sanctuary. Local craftsmanship and plush furnishings create a memorable stay.",
    amenities: ["Queen bed", "Premium linens", "Coffee maker", "Rooftop access"],
    highlights: ["Minaret view", "Rooftop access", "Premium linens"],
  },

  // Double Standard Rooms (5 rooms) - $55/night
  {
    slug: "standard-double-one",
    name: "Double Standard — Courtyard",
    subtitle: "Cozy comfort in the heart of old Bukhara.",
    price: "$55",
    priceValue: 55,
    image:
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200&q=80&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600&q=80&auto=format&fit=crop",
    ],
    size: "28 m²",
    guests: "2 guests",
    guestCount: 2,
    mood: "Peaceful courtyard",
    category: "Standard",
    details:
      "A well-appointed room featuring traditional suzani patterns and warm lighting. Perfect for budget-conscious travellers seeking authentic charm.",
    amenities: ["Double bed", "Private bathroom", "Air conditioning", "Daily cleaning"],
    highlights: ["Suzani textiles", "Private bath", "Daily cleaning"],
  },
  {
    slug: "standard-double-two",
    name: "Twin Standard — Heritage",
    subtitle: "Twin beds in a heritage setting.",
    price: "$55",
    priceValue: 55,
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600&q=80&auto=format&fit=crop",
    ],
    size: "27 m²",
    guests: "2 guests",
    guestCount: 2,
    mood: "Traditional décor",
    category: "Standard",
    details:
      "Two comfortable beds adorned with handmade textiles. Simple elegance meets practical comfort for friends travelling together.",
    amenities: ["Twin beds", "Shared balcony", "Free Wi-Fi", "Luggage storage"],
    highlights: ["Twin beds", "Shared balcony", "Heritage décor"],
  },
  {
    slug: "standard-double-three",
    name: "Double Standard — Garden",
    subtitle: "Garden whispers and restful nights.",
    price: "$55",
    priceValue: 55,
    image:
      "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=1200&q=80&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=1600&q=80&auto=format&fit=crop",
    ],
    size: "26 m²",
    guests: "2 guests",
    guestCount: 2,
    mood: "Garden view",
    category: "Standard",
    details:
      "Overlook our peaceful garden from this charming room. Local artwork and comfortable furnishings create a welcoming atmosphere.",
    amenities: ["Double bed", "Garden access", "Reading nook", "Complimentary tea"],
    highlights: ["Garden access", "Reading nook", "Complimentary tea"],
  },
  {
    slug: "standard-double-four",
    name: "Twin Standard — Old Town",
    subtitle: "Experience Bukhara from your window.",
    price: "$55",
    priceValue: 55,
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600&q=80&auto=format&fit=crop",
    ],
    size: "28 m²",
    guests: "2 guests",
    guestCount: 2,
    mood: "Old town charm",
    category: "Standard",
    details:
      "Twin beds with views toward the historic old town. A comfortable base for exploring Bukhara's architectural wonders.",
    amenities: ["Twin beds", "City view", "Work desk", "In-room safe"],
    highlights: ["Twin beds", "City view", "In-room safe"],
  },
  {
    slug: "standard-double-five",
    name: "Double Standard — Classic",
    subtitle: "Timeless comfort at an honest price.",
    price: "$55",
    priceValue: 55,
    image:
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1600&q=80&auto=format&fit=crop",
    ],
    size: "27 m²",
    guests: "2 guests",
    guestCount: 2,
    mood: "Classic style",
    category: "Standard",
    details:
      "Clean lines, traditional touches, and all the essentials. A reliable choice for travellers who value comfort and authenticity.",
    amenities: ["Double bed", "En-suite bathroom", "Climate control", "24/7 reception"],
    highlights: ["Climate control", "24/7 reception", "Authentic decor"],
  },
];

export function getRoom(slug: string) {
  return rooms.find((room) => room.slug === slug);
}

/**
 * Hozir band qilingan xonalar slug'larini olish (anonim foydalanuvchilar uchun)
 * Bu ma'lumot 'currently_booked_rooms' public view orqali keladi
 */
export async function getCurrentlyBookedRoomSlugs(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("currently_booked_rooms" as never)
      .select("room_slug");
    if (error || !data) return [];
    return (data as Array<{ room_slug: string }>).map((row) => row.room_slug);
  } catch {
    return [];
  }
}

/**
 * Berilgan sana oraliqlarida band qilingan xonalar
 */
export async function getBookedRoomSlugsForDates(
  checkIn: string,
  checkOut: string,
): Promise<string[]> {
  if (!checkIn || !checkOut) return [];
  try {
    const { data, error } = await supabase
      .from("room_availability" as never)
      .select("room_slug, check_in, check_out")
      .lt("check_in", checkOut)
      .gt("check_out", checkIn);
    if (error || !data) return [];
    const rows = data as Array<{ room_slug: string }>;
    return Array.from(new Set(rows.map((row) => row.room_slug)));
  } catch {
    return [];
  }
}

/**
 * Ma'lum bir xona berilgan sanalarda mavjudmi
 */
export async function checkRoomAvailability(
  roomSlug: string,
  checkIn: string,
  checkOut: string,
): Promise<boolean> {
  if (!checkIn || !checkOut) return true;
  try {
    const booked = await getBookedRoomSlugsForDates(checkIn, checkOut);
    return !booked.includes(roomSlug);
  } catch {
    return true;
  }
}

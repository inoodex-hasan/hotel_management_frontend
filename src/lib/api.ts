/**
 * API Service for The Azura Hotel Frontend
 * Connects to Laravel 12 Backend API (v1)
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export function formatImageUrl(url?: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // If backend returned localhost without port 8000 for storage, fix it:
    if (url.includes("localhost/storage") || url.includes("127.0.0.1/storage")) {
      const backendBase = API_BASE_URL.replace(/\/api\/v1\/?$/, "");
      return url.replace(/^http:\/\/(localhost|127\.0\.0\.1)(\/storage)/, `${backendBase}$2`);
    }
    // If it's localhost/images/... turn it into /images/... for frontend public
    if (url.includes("localhost/images/") || url.includes("127.0.0.1:8000/images/") || url.includes("127.0.0.1/images/")) {
      return url.replace(/^https?:\/\/[^\/]+(\/images\/.*)$/, "$1");
    }
    return url;
  }
  if (url.startsWith("/storage/") || url.startsWith("storage/")) {
    const backendBase = API_BASE_URL.replace(/\/api\/v1\/?$/, "");
    return `${backendBase}/${url.replace(/^\/+/, "")}`;
  }
  return url.startsWith("/") ? url : `/${url}`;
}

export interface RoomAmenity {
  icon: string;
  label: string;
}

export interface RoomType {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  tag?: string;
  description: string;
  longDescription: string;
  long_description?: string;
  image: string;
  gallery: string[];
  thumbnail_url?: string;
  gallery_urls?: string[];
  price: string;
  base_price_per_night: number;
  floor: string;
  bed: string;
  bed_type?: string;
  maxGuests: string;
  capacity_adults: number;
  capacity_children: number;
  size: string;
  room_size?: string;
  stars: number;
  amenities: RoomAmenity[];
  highlights: string[];
  total_rooms?: number;
  available_rooms?: number;
  is_refundable?: boolean;
}

export interface FacilityItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  image: string;
  features: string[];
  opening_hours?: string;
}

export interface DiningItem {
  id: number;
  slug: string;
  name: string;
  title: string;
  label: string;
  description: string;
  image: string;
  location?: string;
  serves?: string;
  phone?: string;
  hours?: string;
  details?: {
    location: string;
    serves: string;
    phone: string;
    hours: string;
  };
  features: string[];
}

export interface HeroSlide {
  id: number;
  title?: string;
  subtitle?: string;
  description?: string;
  badge_text?: string;
  button_text?: string;
  button_link?: string;
  image: string;
  image_url: string;
  order?: number;
  is_active?: boolean;
}

export interface AboutContent {
  id: number;
  hotel_id?: number;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  feature_1_title?: string;
  feature_1_subtitle?: string;
  feature_2_title?: string;
  feature_2_subtitle?: string;
  main_image: string;
  main_image_url: string;
  sub_image: string;
  sub_image_url: string;
  button_text?: string;
  button_link?: string;
  since_year?: string;
  story_title?: string;
  story_subtitle?: string;
  story_description?: string;
  contact_phone?: string;
  contact_email?: string;
  story_image_1?: string;
  story_image_2?: string;
  stats?: {
    rooms: number;
    guests: string;
    years: string;
    rating: string;
  };
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

export interface TestimonialItem {
  id: number;
  name: string;
  location: string;
  stay: string;
  rating: number;
  quote: string;
  avatar?: string;
}

export interface BookingPayload {
  room?: string;
  room_slug?: string;
  room_type_id?: number;
  checkIn: string;
  checkOut: string;
  adults: string | number;
  children: string | number;
  rooms?: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  zip?: string;
  arrivalTime?: string;
  paymentMethod: string;
  paymentPhone?: string;
  transactionId?: string;
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  bankName?: string;
  bankAccount?: string;
  bankRouting?: string;
  coupon?: string;
  specialRequests?: string;
}

export interface ContactPayload {
  first_name?: string;
  last_name?: string;
  name?: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

async function fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const res = await fetch(url, {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let errorData: any = {};
    try {
      errorData = await res.json();
    } catch {
      errorData = { message: res.statusText };
    }
    throw new Error(errorData.message || `Request failed with status ${res.status}`);
  }

  return res.json();
}

function normalizeRoomType(r: RoomType): RoomType {
  const image = formatImageUrl(r.image || r.thumbnail_url);
  const gallery = (r.gallery && r.gallery.length > 0 ? r.gallery : [image]).map(formatImageUrl);
  return {
    ...r,
    image,
    thumbnail_url: image,
    gallery,
    gallery_urls: gallery,
  };
}

/**
 * Fetch all room types (optionally filtered by hotel_slug, hotel_id, or price)
 */
export async function getRoomTypes(params?: {
  hotel_slug?: string;
  hotel_id?: number;
  per_page?: number;
}): Promise<RoomType[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.hotel_slug) searchParams.set("hotel_slug", params.hotel_slug);
    if (params?.hotel_id) searchParams.set("hotel_id", String(params.hotel_id));
    if (params?.per_page) searchParams.set("per_page", String(params.per_page));

    const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : "";
    const res = await fetchJson<{ data: RoomType[] }>(`/room-types${queryStr}`);
    return (res.data || []).map(normalizeRoomType);
  } catch (error) {
    console.warn("API getRoomTypes error", error);
    return [];
  }
}

/**
 * Fetch all active hotels
 */
export async function getHotels(): Promise<any[]> {
  try {
    const res = await fetchJson<{ data: any[] }>("/hotels");
    return res.data || [];
  } catch (error) {
    console.warn("API getHotels error", error);
    return [];
  }
}

/**
 * Fetch single room type by slug
 */
export async function getRoomTypeBySlug(slug: string): Promise<RoomType | null> {
  try {
    const res = await fetchJson<{ data: RoomType }>(`/room-types/${slug}`);
    return res.data ? normalizeRoomType(res.data) : null;
  } catch (error) {
    console.warn(`API getRoomTypeBySlug(${slug}) error`, error);
    return null;
  }
}

/**
 * Fetch facilities
 */
export async function getFacilities(): Promise<FacilityItem[]> {
  try {
    const res = await fetchJson<{ data: FacilityItem[] }>("/facilities");
    return (res.data || []).map((f) => ({
      ...f,
      image: formatImageUrl(f.image),
    }));
  } catch (error) {
    console.warn("API getFacilities error", error);
    return [];
  }
}

/**
 * Fetch dining venues
 */
export async function getDiningVenues(): Promise<DiningItem[]> {
  try {
    const res = await fetchJson<{ data: DiningItem[] }>("/dining");
    return (res.data || []).map((venue) => ({
      ...venue,
      image: formatImageUrl(venue.image),
    }));
  } catch (error) {
    console.warn("API getDiningVenues error", error);
    return [];
  }
}

export async function getHeroSlides(params?: {
  hotel_slug?: string;
}): Promise<HeroSlide[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.hotel_slug) searchParams.set("hotel_slug", params.hotel_slug);
    const res = await fetchJson<{ data: HeroSlide[] }>(`/hero-slides?${searchParams.toString()}`);
    return (res.data || []).map((s) => ({
      ...s,
      image: formatImageUrl(s.image || s.image_url),
      image_url: formatImageUrl(s.image_url || s.image),
    }));
  } catch (error) {
    console.warn("API getHeroSlides error:", error);
    return [];
  }
}

/**
 * Fetch about section & story details
 */
export async function getAboutContent(params?: {
  hotel_slug?: string;
}): Promise<AboutContent | null> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.hotel_slug) searchParams.set("hotel_slug", params.hotel_slug);
    const res = await fetchJson<{ data: AboutContent }>(`/about?${searchParams.toString()}`);
    return res.data;
  } catch (error) {
    console.warn("API getAboutContent error:", error);
    return null;
  }
}

/**
 * Fetch gallery items
 */
export async function getGalleryItems(category?: string): Promise<GalleryItem[]> {
  try {
    const q = category && category.toLowerCase() !== "all" ? `?category=${encodeURIComponent(category)}` : "";
    const res = await fetchJson<{ data: GalleryItem[] }>(`/gallery${q}`);
    return (res.data || []).map((item) => ({
      ...item,
      image: formatImageUrl(item.image),
    }));
  } catch (error) {
    console.warn("API getGalleryItems error", error);
    return [];
  }
}

/**
 * Fetch testimonials
 */
export async function getTestimonials(): Promise<TestimonialItem[]> {
  try {
    const res = await fetchJson<{ data: TestimonialItem[] }>("/testimonials");
    return (res.data || []).map((t) => ({
      ...t,
      avatar: t.avatar ? formatImageUrl(t.avatar) : undefined,
    }));
  } catch (error) {
    console.warn("API getTestimonials error", error);
    return [];
  }
}

/**
 * Validate a promotional coupon
 */
export async function validateCoupon(code: string, amount: number) {
  return fetchJson<{
    valid: boolean;
    message: string;
    data: {
      code: string;
      discount_type: string;
      discount_value: number;
      discount_amount: number;
      original_amount: number;
      final_amount: number;
    };
  }>("/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code, amount }),
  });
}

/**
 * Submit checkout booking reservation
 */
export async function submitBooking(payload: BookingPayload) {
  return fetchJson<{
    data: {
      id: number;
      reference_no: string;
      booking_id: string;
      status: string;
      total_amount: number;
      discount_amount: number;
      net_amount: number;
      currency: string;
      hotel_booking: any;
    };
  }>("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Submit contact inquiry message
 */
export async function submitContactMessage(payload: ContactPayload) {
  return fetchJson<{
    message: string;
    data: any;
  }>("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Subscribe email to newsletter
 */
export async function subscribeNewsletter(email: string) {
  return fetchJson<{
    message: string;
    data: any;
  }>("/newsletter", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export interface HotelSettings {
  app_name: string;
  hotel_tagline: string;
  app_logo?: string;
  app_favicon?: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  youtube_url?: string;

  // Experience Spotlight Banner
  experience_label?: string;
  experience_title?: string;
  experience_subtitle?: string;
  experience_image?: string;
  experience_video_url?: string;
  experience_button_text?: string;
  experience_button_link?: string;
}

/**
 * Get site settings & hotel general info
 */
export async function getSettings(): Promise<HotelSettings> {
  try {
    const res = await fetchJson<{ data: HotelSettings }>("/settings");
    const data = res.data;
    if (data.experience_image) {
      data.experience_image = formatImageUrl(data.experience_image);
    }
    return data;
  } catch (error) {
    console.warn("API getSettings error, falling back to defaults", error);
    return {
      app_name: "The Azura Hotel & Suites",
      hotel_tagline: "A place where thoughtful design, genuine hospitality and unforgettable experiences come together.",
      contact_email: "reservation.theazura@gmail.com",
      contact_phone: "+880 1401 777 888",
      address: "Marine Drive Road, Cox's Bazar, Bangladesh",
      facebook_url: "https://facebook.com",
      instagram_url: "https://instagram.com",
      twitter_url: "https://twitter.com",
      youtube_url: "https://youtube.com",
      experience_label: "The Azura Experience",
      experience_title: "Where every stay becomes a memory.",
      experience_subtitle: "Immerse yourself in panoramic coastal luxury, exceptional gastronomy, and refined seaside serenity.",
      experience_image: "",
      experience_button_text: "Explore Suites",
      experience_button_link: "/rooms",
    };
  }
}

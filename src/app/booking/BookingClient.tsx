"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Users,
  BedDouble,
  Star,
  Maximize2,
  Check,
  Phone,
  Sparkles,
  Wifi,
  Utensils,
  Waves,
  Car,
} from "lucide-react";
import { getRoomTypes, RoomType, getSettings, HotelSettings } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

interface BookingRoom {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  tags: string[];
  image: string;
  price: string;
  floor: string;
  bed: string;
  maxGuests: string;
  stars: number;
  amenities: string[];
}

function formatBookingRoom(r: any): BookingRoom {
  const amList: string[] = Array.isArray(r.amenities)
    ? r.amenities.map((a: any) => (typeof a === "string" ? a : a.label || a.icon || "")).filter(Boolean)
    : [];

  return {
    id: r.slug || String(r.id),
    slug: r.slug || "",
    name: r.name || "",
    subtitle: r.subtitle || "",
    tags: r.tag ? [r.tag] : [],
    image: r.image || r.thumbnail_url || "",
    price: r.price || (r.base_price_per_night ? Number(r.base_price_per_night).toLocaleString() : ""),
    floor: r.floor || r.size || "",
    bed: r.bed || r.bed_type || "",
    maxGuests: r.maxGuests || (r.capacity_adults ? `${r.capacity_adults} Adults` : ""),
    stars: r.stars || 5,
    amenities: amList,
  };
}

export default function BookingClient({
  initialRooms = [],
  initialSettings = null,
}: {
  initialRooms?: RoomType[];
  initialSettings?: HotelSettings | null;
}) {
  const pageRef = useRef<HTMLDivElement>(null);
  const formattedInitial = initialRooms.length > 0 ? initialRooms.map(formatBookingRoom) : [];
  const [rooms, setRooms] = useState<BookingRoom[]>(formattedInitial);
  const [settings, setSettings] = useState<HotelSettings | null>(initialSettings);
  const [isLoading, setIsLoading] = useState(formattedInitial.length === 0);

  useEffect(() => {
    if (rooms.length > 0 && settings) {
      setIsLoading(false);
      return;
    }
    let isMounted = true;
    Promise.allSettled([getRoomTypes(), getSettings()])
      .then(([roomsRes, settingsRes]) => {
        if (!isMounted) return;
        if (roomsRes.status === "fulfilled" && roomsRes.value?.length) {
          setRooms(roomsRes.value.map(formatBookingRoom));
        }
        if (settingsRes.status === "fulfilled" && settingsRes.value) {
          setSettings(settingsRes.value);
        }
      })
      .catch((err) => {
        console.warn("Failed to load booking room types:", err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [rooms.length, settings]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".booking-hero-text", { y: 50, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2 });

      gsap.utils.toArray<HTMLElement>(".room-card").forEach((card, i) => {
        gsap.fromTo(card,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
            delay: i * 0.12,
            scrollTrigger: { trigger: card, start: "top 95%", toggleActions: "play none none none" },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".amenity-item").forEach((item, i) => {
        gsap.fromTo(item,
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
            delay: i * 0.1,
            scrollTrigger: { trigger: item, start: "top 95%", toggleActions: "play none none none" },
          }
        );
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const heroImage = rooms[0]?.image;

  return (
    <main ref={pageRef} className="bg-white text-black overflow-hidden">

      {/* HERO */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden pt-[86px] lg:min-h-[58vh]">
        {heroImage ? (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroImage}')` }} />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c1c] via-[#121212] to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />
        <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 lg:px-10 pb-12 sm:pb-16">
          <div className="booking-hero-text max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={14} className="text-[#ff784e]" />
              <span className="text-[#ff784e] text-[10px] font-bold uppercase tracking-[0.3em]">Reservation</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[68px] font-serif font-light leading-[1.0] text-white">
              Book Your <span className="italic text-[#ff784e]">Perfect</span> Stay
            </h1>
            <p className="mt-3 max-w-lg text-white/60 text-[14px] leading-7">
              Select your dates, choose your room, and enjoy a luxurious experience at The Azura.
            </p>
          </div>
        </div>
      </section>

      {/* ROOMS LISTING */}
      <section className="py-16 lg:py-24 bg-[#fafafa]">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="h-px w-8 bg-[#ff784e]/40" />
                <span className="text-[#ff784e] text-[10px] font-bold uppercase tracking-[0.3em]">Available Rooms</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1a1a1a]">Choose Your Room</h2>
            </div>
            {!isLoading && <p className="text-[13px] text-black/40">{rooms.length} room{rooms.length !== 1 ? "s" : ""} found</p>}
          </div>

          {isLoading ? (
            <div className="space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-black/[0.04] bg-white animate-pulse">
                  <div className="grid lg:grid-cols-[340px_1fr]">
                    <div className="h-[240px] sm:h-[280px] lg:h-[320px] bg-black/10" />
                    <div className="p-6 sm:p-8 space-y-4">
                      <div className="h-6 w-1/3 bg-black/10 rounded" />
                      <div className="h-4 w-1/4 bg-black/10 rounded" />
                      <div className="h-12 bg-black/5 rounded mt-4" />
                      <div className="h-8 bg-black/10 rounded mt-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <div className="mx-auto max-w-xl text-center py-16 px-6 rounded-2xl border border-black/[0.06] bg-white shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ff784e]/10 text-[#ff784e] mb-4">
                <BedDouble size={28} />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-light text-[#1a1a1a]">No Rooms Available For Booking</h3>
              <p className="mt-3 text-sm text-black/50 leading-relaxed max-w-md mx-auto">
                We are currently updating our online reservation inventory. Please call our reception or contact us directly for immediate reservation assistance.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a href="tel:+8801401777888" className="inline-flex items-center gap-2 bg-[#ff784e] text-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.12em] hover:bg-[#1a1a1a] transition-all rounded-lg">
                  <Phone size={13} /> Call +880 1401 777 888
                </a>
                <Link href="/contact" className="inline-flex items-center gap-2 border border-black/15 text-[#1a1a1a] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.12em] hover:border-[#ff784e] hover:text-[#ff784e] transition-all rounded-lg">
                  Contact Reception
                </Link>
              </div>
            </div>
          ) : (
            <div className="rooms-grid space-y-5">
              {rooms.map((room) => (
                <div key={room.id} className="room-card group overflow-hidden rounded-2xl border border-black/[0.04] bg-white shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-500">
                  <div className="grid lg:grid-cols-[340px_1fr]">
                    <div className="relative h-[240px] sm:h-[280px] lg:h-[320px] overflow-hidden">
                      <img src={room.image} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                      {room.tags.length > 0 && (
                        <div className="absolute top-4 left-4 flex gap-1.5">
                          {room.tags.map((tag) => (
                            <span key={tag} className="px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.15em] bg-[#ff784e] text-white rounded-sm">{tag}</span>
                          ))}
                        </div>
                      )}
                      <div className="absolute bottom-4 right-4 flex items-center gap-0.5">
                        {Array.from({ length: room.stars }).map((_, i) => (
                          <Star key={i} size={11} className="fill-[#ff784e] text-[#ff784e]" />
                        ))}
                      </div>
                      <div className="absolute bottom-4 left-4 sm:hidden">
                        <span className="text-2xl font-serif font-light text-white">&#x09F3;{room.price}</span>
                        <span className="text-[10px] text-white/60 ml-1">/night</span>
                      </div>
                    </div>

                    <div className="p-6 sm:p-7 lg:p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-serif font-light text-[#1a1a1a]">{room.name}</h3>
                            <p className="text-[11px] text-[#ff784e] font-semibold uppercase tracking-[0.2em] mt-1">{room.subtitle}</p>
                          </div>
                          <div className="hidden sm:block text-right shrink-0">
                            <span className="text-[9px] text-black/30 font-semibold uppercase tracking-[0.2em]">From</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl lg:text-3xl font-serif font-light text-[#1a1a1a]">&#x09F3;{room.price}</span>
                              <span className="text-[10px] text-black/30">/night</span>
                            </div>
                          </div>
                        </div>

                        <div className="my-4 h-px bg-black/5" />

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-black/55">
                          <span className="flex items-center gap-1.5"><BedDouble size={14} className="text-[#ff784e]" /> {room.bed}</span>
                          <span className="flex items-center gap-1.5"><Users size={14} className="text-[#ff784e]" /> {room.maxGuests}</span>
                          <span className="flex items-center gap-1.5"><Maximize2 size={14} className="text-[#ff784e]" /> {room.floor}</span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {room.amenities.map((a) => (
                            <span key={a} className="flex items-center gap-1 px-2.5 py-1 text-[9px] font-medium text-[#ff784e] bg-[#ff784e]/[0.06] border border-[#ff784e]/10 rounded-full">
                              <Check size={9} /> {a}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between pt-4 border-t border-black/5">
                        <div className="sm:hidden">
                          <span className="text-[10px] text-black/30 font-semibold">From</span>
                          <span className="ml-1 text-xl font-serif text-[#1a1a1a]">&#x09F3;{room.price}</span>
                          <span className="text-[10px] text-black/30">/night</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <a href="tel:+8801401777888"
                            className="hidden sm:inline-flex items-center gap-2 border border-black/10 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-black/60 hover:border-[#ff784e] hover:text-[#ff784e] transition-all rounded-lg">
                            <Phone size={12} /> Call
                          </a>
                          <Link href={`/rooms/${room.id}`}
                            className="group/btn inline-flex items-center gap-2 bg-[#ff784e] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.12em] hover:bg-[#1a1a1a] transition-all rounded-lg">
                            View Details <ArrowUpRight size={13} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AMENITIES STRIP */}
      <section className="amenities-strip bg-[#f7f4ef] py-14 lg:py-16">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {[
              { icon: Wifi, label: "Free Wi-Fi", sub: "High-speed internet" },
              { icon: Utensils, label: "Restaurant", sub: "Fine dining" },
              { icon: Waves, label: "Infinity Pool", sub: "Rooftop pool" },
              { icon: Car, label: "Free Parking", sub: "24/7 secured" },
            ].map((item) => (
              <div key={item.label} className="amenity-item flex items-center gap-4 bg-white p-5 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
                <div className="flex h-12 w-12 items-center justify-center bg-[#ff784e]/10 rounded-lg shrink-0">
                  <item.icon size={20} className="text-[#ff784e]" />
                </div>
                <div>
                  <span className="block text-[13px] font-semibold text-[#1a1a1a]">{item.label}</span>
                  <span className="text-[11px] text-black/40">{item.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 lg:py-28 bg-[#1a1a1a] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c1c] via-[#141414] to-black" />
        <div className="absolute inset-0 bg-[#1a1a1a]/60" />
        <div className="absolute top-8 left-8 h-16 w-16 border-t border-l border-[#ff784e]/20" />
        <div className="absolute bottom-8 right-8 h-16 w-16 border-b border-r border-[#ff784e]/20" />
        <div className="relative z-10 max-w-[1500px] mx-auto px-6 lg:px-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#ff784e]/40" />
            <span className="text-[#ff784e] text-[10px] font-bold uppercase tracking-[0.3em]">Need Help?</span>
            <span className="h-px w-8 bg-[#ff784e]/40" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-white leading-tight">
            Contact Us for <span className="italic text-[#ff784e]">Special Offers</span>
          </h2>
          <p className="mt-5 max-w-lg mx-auto text-white/50 text-[15px] leading-7">
            Looking for a deal? Call us directly for exclusive packages and group bookings.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={`tel:${(settings?.contact_phone || "+880 1401 777 888").replace(/\s+/g, "")}`} className="group inline-flex items-center gap-4 bg-[#ff784e] text-white px-10 py-5 text-xs font-bold uppercase tracking-[0.18em] hover:bg-white hover:text-[#1a1a1a] transition-all duration-300">
              Call {settings?.contact_phone || "+880 1401 777 888"} <ArrowUpRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <Link href="/contact" className="inline-flex items-center gap-3 border border-white/20 text-white px-10 py-5 text-xs font-bold uppercase tracking-[0.18em] hover:border-[#ff784e] hover:text-[#ff784e] transition-all duration-300">
              Contact Page
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Users,
  Maximize2,
  Phone,
  Star,
  Check,
  Wifi,
  Tv,
  Wind,
  Coffee,
  Bath,
  Utensils,
  Sparkles,
  Lock,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CalendarDays,
  ChevronDown,
  X,
  Camera,
} from "lucide-react";
import { roomsData } from "@/lib/roomsData";
import { getRoomTypeBySlug, getRoomTypes, RoomType } from "@/lib/api";
import DatePicker from "@/components/shared/DatePicker";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Wifi, Tv, Wind, Coffee, Bath, Utensils, Sparkles, Lock,
};

function RoomDetailInner() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [room, setRoom] = useState<RoomType | null>(() => {
    return (roomsData.find((r) => r.slug === slug) as unknown as RoomType) || null;
  });
  const [otherRooms, setOtherRooms] = useState<RoomType[]>(() => {
    return (roomsData.filter((r) => r.slug !== slug).slice(0, 3) as unknown as RoomType[]);
  });

  const [checkIn, setCheckIn] = useState(searchParams.get("checkin") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkout") || "");
  const [adults, setAdults] = useState(Number(searchParams.get("adults")) || 2);
  const [childrenCount, setChildrenCount] = useState(Number(searchParams.get("children")) || 0);
  const [roomsCount, setRoomsCount] = useState(Number(searchParams.get("rooms")) || 1);
  const [dateOpen, setDateOpen] = useState(false);
  const [dateMode, setDateMode] = useState<"checkin" | "checkout">("checkin");

  const bookingLink = `/checkout?room=${room?.slug}&checkin=${checkIn}&checkout=${checkOut}&adults=${adults}&children=${childrenCount}&rooms=${roomsCount}`;

  useEffect(() => {
    if (typeof slug === "string") {
      getRoomTypeBySlug(slug).then((data) => {
        if (data) {
          setRoom(data);
        }
      });
      getRoomTypes().then((all) => {
        if (all && all.length > 0) {
          setOtherRooms(all.filter((r) => r.slug !== slug).slice(0, 3));
        }
      });
    }
  }, [slug]);

  useEffect(() => {
    if (!room && !roomsData.find((r) => r.slug === slug)) {
      router.replace("/rooms");
      return;
    }
  }, [room, router, slug]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen || !room) return;
    const galleryList = room.gallery && room.gallery.length > 0 ? room.gallery : [room.image || "/images/room1.avif"];
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") setActiveImage((p) => (p === 0 ? galleryList.length - 1 : p - 1));
      if (e.key === "ArrowRight") setActiveImage((p) => (p === galleryList.length - 1 ? 0 : p + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, room]);

  useEffect(() => {
    if (!room) return;
    const ctx = gsap.context(() => {
      gsap.from(".room-hero-content", { y: 50, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2 });

      gsap.utils.toArray<HTMLElement>(".room-detail-block").forEach((block, i) => {
        gsap.fromTo(block, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          delay: i * 0.15,
          scrollTrigger: { trigger: block, start: "top 92%", toggleActions: "play none none none" },
        });
      });

      gsap.utils.toArray<HTMLElement>(".amenity-block").forEach((block, i) => {
        gsap.fromTo(block, { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
          delay: i * 0.08,
          scrollTrigger: { trigger: block, start: "top 92%", toggleActions: "play none none none" },
        });
      });
    }, pageRef);
    return () => ctx.revert();
  }, [slug]);

  if (!room) return null;

  const gallery = room.gallery && room.gallery.length > 0 ? room.gallery : [room.image || "/images/room1.avif"];
  const highlights = room.highlights || [];
  const amenities = room.amenities || [];

  return (
    <main ref={pageRef} className="bg-white text-black overflow-hidden">

      {/* LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[150] flex flex-col justify-between bg-black/95 backdrop-blur-2xl p-4 sm:p-6" onClick={() => setLightboxOpen(false)}>
          {/* Top Header */}
          <div className="flex items-center justify-between z-20" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <span className="text-sm sm:text-base font-serif text-white">{room.name}</span>
              <span className="text-xs text-white/50">· {activeImage + 1} / {gallery.length}</span>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 hover:border-white hover:text-white transition"
              aria-label="Close photo viewer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Image View */}
          <div className="relative my-auto flex-1 flex items-center justify-center min-h-0 py-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full max-w-6xl h-[60vh] sm:h-[72vh]">
              <Image
                key={activeImage}
                src={gallery[activeImage] || room.image}
                alt={room.name}
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            {/* Navigation Arrows */}
            <button
              type="button"
              onClick={() => setActiveImage((p) => (p === 0 ? gallery.length - 1 : p - 1))}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur-md hover:border-[#ff784e] hover:bg-[#ff784e] transition"
              aria-label="Previous image"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => setActiveImage((p) => (p === gallery.length - 1 ? 0 : p + 1))}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur-md hover:border-[#ff784e] hover:bg-[#ff784e] transition"
              aria-label="Next image"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Bottom Thumbnails */}
          <div className="flex items-center justify-center gap-2 z-20 overflow-x-auto py-2" onClick={(e) => e.stopPropagation()}>
            {gallery.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`relative h-12 w-16 sm:h-14 sm:w-20 rounded-lg overflow-hidden shrink-0 transition-all ${
                  i === activeImage ? "ring-2 ring-[#ff784e] scale-105" : "opacity-50 hover:opacity-100"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="80px" unoptimized />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative min-h-[50vh] sm:min-h-[65vh] flex items-end overflow-hidden pt-[86px] lg:min-h-[78vh]">
        {/* Background photo */}
        <div className="absolute inset-0">
          <Image
            key={activeImage}
            src={gallery[activeImage] || room.image}
            alt={room.name}
            fill
            priority
            className="object-cover object-center transition-all duration-700 ease-out"
            sizes="100vw"
            unoptimized
          />
        </div>

        {/* Clear, refined lighting overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent hidden sm:block" />

        {/* Fullscreen Button Top Right */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute right-3 top-24 z-20 flex items-center gap-1.5 rounded-full border border-white/25 bg-black/40 px-3 py-1.5 text-[9px] font-semibold tracking-wider text-white backdrop-blur-md transition-all hover:border-[#ff784e] hover:bg-[#ff784e] sm:right-8 sm:top-28 sm:px-4 sm:py-2 sm:text-[11px] sm:gap-2"
        >
          <Maximize2 size={11} className="sm:size-[13]" />
          <span className="hidden sm:inline">View All ({gallery.length} Photos)</span>
          <span className="sm:hidden">{gallery.length} Photos</span>
        </button>

        {/* Floating Thumbnails on Hero bottom right */}
        <div className="absolute right-6 bottom-8 z-20 hidden md:flex items-center gap-2.5 rounded-2xl border border-white/15 bg-black/60 p-2 backdrop-blur-xl shadow-2xl lg:right-10 lg:bottom-10">
          {gallery.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveImage(i)}
              className={`relative h-14 w-20 overflow-hidden rounded-xl transition-all duration-300 ${
                i === activeImage
                  ? "ring-2 ring-[#ff784e] scale-105 opacity-100"
                  : "opacity-60 hover:opacity-100 hover:scale-102"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="80px" unoptimized />
            </button>
          ))}
        </div>

        {/* Mobile Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 flex gap-1.5 md:hidden">
          {gallery.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveImage(i)}
              className={`h-[3px] rounded-full transition-all duration-300 ${i === activeImage ? "w-6 bg-[#ff784e]" : "w-2.5 bg-white/40"}`}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 pb-10 sm:pb-16">
          <div className="room-hero-content max-w-3xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 text-[9px] sm:text-[11px] text-white/60">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/rooms" className="hover:text-white transition-colors">Rooms</Link>
              <span>/</span>
              <span className="text-[#ff784e] font-medium truncate">{room.name}</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-2.5">
              {room.tag && (
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.15em] bg-[#ff784e] text-white rounded-sm">{room.tag}</span>
              )}
              <div className="flex items-center gap-0.5 sm:gap-1">
                {Array.from({ length: room.stars }).map((_, i) => (
                  <Star key={i} size={9} className="fill-[#ff784e] text-[#ff784e] sm:size-[11]" />
                ))}
              </div>
            </div>

            <h1 className="text-2xl sm:text-5xl md:text-6xl font-serif font-light leading-[1.05] text-white">
              {room.name}
            </h1>
            <p className="mt-1.5 sm:mt-2 text-[#ff784e] text-[11px] sm:text-sm font-medium tracking-wide">{room.subtitle}</p>

            <div className="mt-3 sm:mt-5 flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-6">
              <div>
                <span className="text-[8px] sm:text-[9px] text-white/50 font-semibold uppercase tracking-[0.2em]">Starting from</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-3xl font-serif font-light text-white">&#x09F3;{room.price}</span>
                  <span className="text-[10px] sm:text-[11px] text-white/50">/night</span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <a href="tel:+8801401777888"
                  className="inline-flex items-center gap-1.5 sm:gap-2 border border-white/30 bg-black/20 backdrop-blur-sm px-3 sm:px-5 py-2 sm:py-2.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] text-white hover:border-[#ff784e] hover:text-[#ff784e] transition-all rounded-lg">
                  <Phone size={11} className="sm:size-[13]" /> Call to Book
                </a>
                <Link href={bookingLink}
                  className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#ff784e] text-white px-3 sm:px-5 py-2 sm:py-2.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] hover:bg-white hover:text-[#1a1a1a] transition-all rounded-lg">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE THUMBNAILS BAR */}
      <section className="md:hidden border-b border-black/5 bg-[#111] p-3">
        <div className="flex gap-2 overflow-x-auto">
          {gallery.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveImage(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg transition-all ${
                i === activeImage ? "ring-2 ring-[#ff784e]" : "opacity-60"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="96px" unoptimized />
            </button>
          ))}
        </div>
      </section>

      {/* ROOM DETAILS */}
      <section className="room-details py-14 lg:py-20 bg-[#fafafa]">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">

            {/* Left — Info */}
            <div>
              <div className="room-detail-block">
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-px w-8 bg-[#ff784e]/40" />
                  <span className="text-[#ff784e] text-[10px] font-bold uppercase tracking-[0.3em]">About This Room</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#1a1a1a]">{room.name}</h2>
                <p className="mt-4 text-black/60 text-[14px] leading-7">{room.description}</p>
                <p className="mt-4 text-black/50 text-[13px] leading-7">{room.longDescription || room.long_description || room.description}</p>
              </div>

              {/* Specs */}
              <div className="room-detail-block mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: BedDouble, label: "Bed", value: room.bed || room.bed_type },
                  { icon: Users, label: "Guests", value: room.maxGuests },
                  { icon: Maximize2, label: "Size", value: room.size || room.room_size },
                  { icon: MapPin, label: "Floor", value: room.floor },
                ].map((spec) => (
                  <div key={spec.label} className="flex flex-col items-center gap-2 rounded-xl border border-black/[0.06] bg-white p-4">
                    <spec.icon size={20} className="text-[#ff784e]" />
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-black/40">{spec.label}</span>
                    <span className="text-[11px] font-medium text-[#1a1a1a] text-center">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Photo Showcase Grid */}
              <div className="room-detail-block mt-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Camera size={16} className="text-[#ff784e]" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1a1a1a]">Room Photo Gallery</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="text-[11px] font-semibold text-[#ff784e] hover:underline flex items-center gap-1"
                  >
                    View All ({gallery.length}) <ChevronRight size={13} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {gallery.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setActiveImage(i); setLightboxOpen(true); }}
                      className="group relative h-40 overflow-hidden rounded-xl border border-black/[0.06] bg-black/5 transition-all hover:shadow-lg"
                    >
                      <Image
                        src={img}
                        alt={`${room.name} Photo ${i + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 33vw"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm">
                          <Maximize2 size={15} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              {highlights.length > 0 && (
                <div className="room-detail-block mt-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1a1a1a] mb-4">Room Highlights</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {highlights.map((h) => (
                      <div key={h} className="flex items-center gap-3 rounded-xl border border-black/[0.04] bg-white px-4 py-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ff784e]/10">
                          <Check size={14} className="text-[#ff784e]" />
                        </div>
                        <span className="text-[12px] font-medium text-[#1a1a1a]">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right — Booking Card */}
            <div>
              <div className="room-detail-block sticky top-24 rounded-2xl border border-black/[0.06] bg-white p-5 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[9px] text-black/30 font-semibold uppercase tracking-[0.2em]">From</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-serif font-light text-[#1a1a1a]">&#x09F3;{room.price}</span>
                      <span className="text-[10px] text-black/30">/night</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: room.stars }).map((_, i) => (
                      <Star key={i} size={11} className="fill-[#ff784e] text-[#ff784e]" />
                    ))}
                  </div>
                </div>

                <div className="my-4 h-px bg-black/5 sm:my-5" />

                {/* Date buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => {
                    if (dateOpen && dateMode === "checkin") {
                      setDateOpen(false);
                    } else {
                      setDateMode("checkin");
                      setDateOpen(true);
                    }
                  }}
                    className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2.5 text-left hover:border-[#ff784e] transition-colors">
                    <CalendarDays size={14} className="text-[#ff784e] shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-black/40">Check-in</span>
                      <span className="text-[11px] font-medium text-[#1a1a1a] truncate">
                        {checkIn ? new Date(checkIn + "T00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Select"}
                      </span>
                    </div>
                    <ChevronDown size={11} className={`ml-auto text-black/30 shrink-0 transition-transform ${dateOpen && dateMode === "checkin" ? "rotate-180 text-[#ff784e]" : ""}`} />
                  </button>
                  <button type="button" onClick={() => {
                    if (dateOpen && dateMode === "checkout") {
                      setDateOpen(false);
                    } else {
                      setDateMode("checkout");
                      setDateOpen(true);
                    }
                  }}
                    className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2.5 text-left hover:border-[#ff784e] transition-colors">
                    <CalendarDays size={14} className="text-[#ff784e] shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-black/40">Check-out</span>
                      <span className="text-[11px] font-medium text-[#1a1a1a] truncate">
                        {checkOut ? new Date(checkOut + "T00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Select"}
                      </span>
                    </div>
                    <ChevronDown size={11} className={`ml-auto text-black/30 shrink-0 transition-transform ${dateOpen && dateMode === "checkout" ? "rotate-180 text-[#ff784e]" : ""}`} />
                  </button>
                </div>

                {dateOpen && (
                  <div className="mt-3">
                    <DatePicker
                      checkIn={checkIn}
                      checkOut={checkOut}
                      mode={dateMode}
                      onCheckInChange={(d) => {
                        setCheckIn(d);
                        setDateOpen(false);
                      }}
                      onCheckOutChange={(d) => {
                        setCheckOut(d);
                        if (d) setDateOpen(false);
                      }}
                    />
                  </div>
                )}

                {/* Guests */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-[0.12em] text-black/40 mb-1">Adults</label>
                    <select value={adults} onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full rounded-lg border border-black/10 px-2 py-2 text-[11px] text-[#1a1a1a] outline-none focus:border-[#ff784e] transition-colors">
                      {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-[0.12em] text-black/40 mb-1">Children</label>
                    <select value={childrenCount} onChange={(e) => setChildrenCount(Number(e.target.value))}
                      className="w-full rounded-lg border border-black/10 px-2 py-2 text-[11px] text-[#1a1a1a] outline-none focus:border-[#ff784e] transition-colors">
                      {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-[0.12em] text-black/40 mb-1">Rooms</label>
                    <select value={roomsCount} onChange={(e) => setRoomsCount(Number(e.target.value))}
                      className="w-full rounded-lg border border-black/10 px-2 py-2 text-[11px] text-[#1a1a1a] outline-none focus:border-[#ff784e] transition-colors">
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>

                <div className="my-4 h-px bg-black/5 sm:my-5" />

                <Link href={bookingLink}
                  className="group flex w-full items-center justify-center gap-2 bg-[#ff784e] text-white py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] hover:bg-[#1a1a1a] transition-all rounded-lg sm:py-4">
                  Check Availability <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                <a href="tel:+8801401777888"
                  className="mt-3 flex w-full items-center justify-center gap-2 border border-black/10 py-3.5 text-[11px] font-bold uppercase tracking-[0.1em] text-black/60 hover:border-[#ff784e] hover:text-[#ff784e] transition-all rounded-lg sm:py-4">
                  <Phone size={13} /> Call +880 1401 777 888
                </a>

                <p className="mt-3 text-center text-[10px] text-black/30 sm:mt-4">Free cancellation up to 24 hours before check-in</p>

                <div className="my-4 h-px bg-black/5 sm:my-5" />

                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-black/40 mb-3">This Room Includes</h4>
                <div className="space-y-2.5">
                  {amenities.slice(0, 6).map((a) => {
                    const Icon = iconMap[a.icon] || Check;
                    return (
                      <div key={a.label} className="flex items-center gap-3">
                        <Icon size={15} className="text-[#ff784e] shrink-0" />
                        <span className="text-[12px] text-black/60">{a.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AMENITIES FULL */}
      {amenities.length > 0 && (
        <section className="amenities-grid py-14 lg:py-20 bg-white">
          <div className="max-w-[1500px] mx-auto px-6 lg:px-10">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-8 bg-[#ff784e]/40" />
                <span className="text-[#ff784e] text-[10px] font-bold uppercase tracking-[0.3em]">Amenities</span>
                <span className="h-px w-8 bg-[#ff784e]/40" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#1a1a1a]">What&apos;s Included</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {amenities.map((a) => {
                const Icon = iconMap[a.icon] || Check;
                return (
                  <div key={a.label} className="amenity-block flex items-center gap-4 rounded-xl border border-black/[0.04] bg-[#fafafa] px-5 py-4 hover:border-[#ff784e]/20 transition-colors">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff784e]/10">
                      <Icon size={18} className="text-[#ff784e]" />
                    </div>
                    <span className="text-[12px] font-medium text-[#1a1a1a]">{a.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* OTHER ROOMS */}
      <section className="py-14 lg:py-20 bg-[#fafafa]">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-[#ff784e]/40" />
              <span className="text-[#ff784e] text-[10px] font-bold uppercase tracking-[0.3em]">You May Also Like</span>
              <span className="h-px w-8 bg-[#ff784e]/40" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#1a1a1a]">Explore Other Rooms</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherRooms.map((r) => (
              <Link key={r.slug} href={`/rooms/${r.slug}`}
                className="group block overflow-hidden rounded-xl border border-black/[0.04] bg-white shadow-sm hover:shadow-lg transition-all duration-500">
                <div className="relative h-[200px] overflow-hidden">
                  <Image src={r.image} alt={r.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {r.tag && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider bg-[#ff784e] text-white rounded-sm">{r.tag}</span>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: r.stars }).map((_, i) => (
                        <Star key={i} size={10} className="fill-[#ff784e] text-[#ff784e]" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-serif font-light text-[#1a1a1a] group-hover:text-[#ff784e] transition-colors">{r.name}</h3>
                  <p className="mt-1 text-[11px] text-black/40">{r.bed} · {r.size} · {r.maxGuests}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xl font-serif font-light text-[#1a1a1a]">&#x09F3;{r.price}<span className="text-[10px] text-black/30">/night</span></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff784e] flex items-center gap-1">View <ChevronRight size={12} /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/rooms" className="inline-flex items-center gap-2 border border-black/10 px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-black/60 hover:border-[#ff784e] hover:text-[#ff784e] transition-all rounded-lg">
              View All Rooms <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

export default function RoomDetailPage() {
  return (
    <Suspense fallback={<div />}>
      <RoomDetailInner />
    </Suspense>
  );
}

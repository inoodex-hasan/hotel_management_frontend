"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Users,
  BedDouble,
} from "lucide-react";
import gsap from "gsap";
import DatePicker from "./DatePicker";

import { getHeroSlides, HeroSlide, formatImageUrl, getSettings, HotelSettings } from "@/lib/api";

const NAV_HEIGHT = 80;
const GAP = 10;

interface DropdownPos {
  top?: number;
  bottom?: number;
  left: number;
  maxHeight?: number;
}

function computeDropdownPos(
  triggerRect: DOMRect,
  dropdownHeight: number,
  dropdownWidth: number,
  containerRect?: DOMRect
): DropdownPos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isMobile = vw < 640;

  const targetTop = containerRect ? containerRect.top : triggerRect.top;
  const targetBottom = containerRect ? containerRect.bottom : triggerRect.bottom;
  const spaceAbove = targetTop - GAP - NAV_HEIGHT;
  const spaceBelow = vh - targetBottom - GAP;

  let left: number;

  if (isMobile) {
    left = Math.max(12, (vw - dropdownWidth) / 2);

    if (spaceAbove >= dropdownHeight) {
      return {
        bottom: vh - targetTop + GAP,
        left,
        maxHeight: spaceAbove,
      };
    } else if (spaceBelow >= dropdownHeight) {
      return {
        top: targetBottom + GAP,
        left,
        maxHeight: spaceBelow,
      };
    } else {
      const maxH = Math.min(dropdownHeight, vh - NAV_HEIGHT - 24);
      const centeredTop = Math.max(NAV_HEIGHT + 8, Math.min((vh - maxH) / 2, vh - maxH - 12));
      return {
        top: centeredTop,
        left,
        maxHeight: maxH,
      };
    }
  } else {
    // Desktop & Laptop
    left = triggerRect.left + triggerRect.width / 2 - dropdownWidth / 2;
    const clampedLeft = Math.max(16, Math.min(left, vw - dropdownWidth - 16));

    if (spaceAbove >= dropdownHeight) {
      return {
        bottom: vh - targetTop + GAP,
        left: clampedLeft,
        maxHeight: spaceAbove,
      };
    } else if (spaceBelow >= dropdownHeight) {
      return {
        top: targetBottom + GAP,
        left: clampedLeft,
        maxHeight: spaceBelow,
      };
    } else if (spaceAbove >= spaceBelow) {
      return {
        bottom: vh - targetTop + GAP,
        left: clampedLeft,
        maxHeight: Math.max(160, spaceAbove),
      };
    } else {
      return {
        top: targetBottom + GAP,
        left: clampedLeft,
        maxHeight: Math.max(160, spaceBelow),
      };
    }
  }
}

export default function Hero({
  initialSlides = [],
  initialSettings = null,
}: {
  initialSlides?: HeroSlide[];
  initialSettings?: HotelSettings | null;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [settings, setSettings] = useState<HotelSettings | null>(initialSettings);
  const [isLoading, setIsLoading] = useState(initialSlides.length === 0);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [dateOpen, setDateOpen] = useState(false);
  const [dateMode, setDateMode] = useState<"checkin" | "checkout">("checkin");
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [roomsOpen, setRoomsOpen] = useState(false);
  const [calendarPos, setCalendarPos] = useState<DropdownPos>({ left: 0 });
  const [guestsPos, setGuestsPos] = useState<DropdownPos>({ left: 0 });
  const [roomsPos, setRoomsPos] = useState<DropdownPos>({ left: 0 });

  useEffect(() => {
    if (slides.length > 0 && settings) {
      setIsLoading(false);
      return;
    }
    let isMounted = true;
    Promise.allSettled([getHeroSlides(), getSettings()]).then(([slidesRes, settingsRes]) => {
      if (!isMounted) return;
      if (slidesRes.status === "fulfilled" && slidesRes.value?.length) {
        setSlides(slidesRes.value);
      }
      if (settingsRes.status === "fulfilled" && settingsRes.value) {
        setSettings(settingsRes.value);
      }
      setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [slides.length, settings]);

  const closeAll = () => { setDateOpen(false); setGuestsOpen(false); setRoomsOpen(false); };

  const getBookingRect = () => bookingRef.current?.getBoundingClientRect();

  const openDate = (e: React.MouseEvent, mode: "checkin" | "checkout") => {
    if (dateOpen && dateMode === mode) { closeAll(); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const isMob = window.innerWidth < 640;
    const calWidth = isMob ? Math.min(280, window.innerWidth - 24) : 520;
    const pos = computeDropdownPos(rect, isMob ? 300 : 400, calWidth, getBookingRect());
    setDateMode(mode);
    setCalendarPos(pos);
    setDateOpen(true);
    setGuestsOpen(false);
    setRoomsOpen(false);
  };

  const openGuests = (btn: HTMLButtonElement) => {
    if (guestsOpen) { closeAll(); return; }
    const rect = btn.getBoundingClientRect();
    const isMob = window.innerWidth < 640;
    const guestsWidth = isMob ? Math.min(280, window.innerWidth - 24) : 280;
    const pos = computeDropdownPos(rect, 140, guestsWidth, getBookingRect());
    setGuestsPos(pos);
    setGuestsOpen(true);
    setRoomsOpen(false);
    setDateOpen(false);
  };

  const openRooms = (btn: HTMLButtonElement) => {
    if (roomsOpen) { closeAll(); return; }
    const rect = btn.getBoundingClientRect();
    const isMob = window.innerWidth < 640;
    const roomsWidth = isMob ? Math.min(240, window.innerWidth - 24) : 240;
    const pos = computeDropdownPos(rect, 90, roomsWidth, getBookingRect());
    setRoomsPos(pos);
    setRoomsOpen(true);
    setGuestsOpen(false);
    setDateOpen(false);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(heroRef.current, { scale: 1.08 }, { scale: 1, duration: 1.8 })
        .fromTo(".hero-label", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=1")
        .fromTo(".hero-title", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.5")
        .fromTo(".hero-description", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.6")
        .fromTo(".hero-actions", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.5")
        .fromTo(bookingRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.3");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const goTo = (index: number) => {
    if (slides.length === 0) return;
    const next = ((index % slides.length) + slides.length) % slides.length;
    const outEl = slideRefs.current[current];
    const inEl = slideRefs.current[next];
    if (outEl && inEl && current !== next) {
      gsap.to(outEl, { opacity: 0, scale: 1.05, duration: 1.2, ease: "power2.inOut" });
      gsap.fromTo(inEl, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power2.inOut" });
    }
    setCurrent(next);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % slides.length;
        const outEl = slideRefs.current[prev];
        const inEl = slideRefs.current[next];
        if (outEl && inEl) {
          gsap.to(outEl, { opacity: 0, scale: 1.05, duration: 1.2, ease: "power2.inOut" });
          gsap.fromTo(inEl, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power2.inOut" });
        }
        return next;
      });
    }, 4500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [slides.length]);

  const prev = () => { if (intervalRef.current) clearInterval(intervalRef.current); goTo(current - 1); };
  const next = () => { if (intervalRef.current) clearInterval(intervalRef.current); goTo(current + 1); };

  useEffect(() => {
    const onScroll = () => closeAll();
    if (dateOpen || guestsOpen || roomsOpen) {
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, [dateOpen, guestsOpen, roomsOpen]);

  const DateButton = ({ label, value, mode }: { label: string; value: string; mode: "checkin" | "checkout" }) => (
    <button type="button" onClick={(e) => openDate(e, mode)}
      className="group flex w-full items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.04] px-3 py-2.5 text-left sm:rounded-xl sm:border-white/[0.07] sm:bg-white/[0.05] sm:px-5 sm:py-3.5 sm:hover:border-white/15 sm:hover:bg-white/[0.08]">
      <CalendarDays size={15} className="text-[#ff784e] shrink-0 sm:size-[18]" />
      <div className="flex flex-1 flex-col min-w-0">
        <span className="text-[7px] font-bold uppercase tracking-[0.14em] text-white/35 sm:text-[9px] sm:tracking-[0.18em]">{label}</span>
        <span className="mt-px text-[11px] font-medium text-white truncate sm:mt-1 sm:text-sm">
          {value ? new Date(value + "T00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Select"}
        </span>
      </div>
      <ChevronDown size={12} className={`text-white/30 transition-all duration-300 shrink-0 sm:size-[14] ${dateOpen && dateMode === mode ? "rotate-180 text-[#ff784e]" : ""}`} />
    </button>
  );

  const activeSlide = slides.length > 0 ? slides[current] || slides[0] : null;

  return (
    <section className="relative min-h-[100dvh] bg-black sm:h-screen">

      {/* BACKGROUND / SLIDER */}
      <div ref={heroRef} className="absolute inset-0 h-full w-full overflow-hidden">
        {slides.length > 0 ? (
          slides.map((slide, i) => {
            const imgSrc = formatImageUrl(slide.image || slide.image_url);
            return (
              <div key={`${slide.id || i}-${imgSrc}`} ref={(el) => { slideRefs.current[i] = el; }}
                className="absolute inset-0 h-full w-full"
                style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}>
                {imgSrc ? (
                  <Image src={imgSrc} alt={slide.title || "Hero Slide"} fill priority={i === 0}
                    className="object-cover object-center" sizes="100vw" unoptimized />
                ) : (
                  <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-[#1c1c1c] via-[#121212] to-black" />
                )}
              </div>
            );
          })
        ) : (
          <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-[#1c1c1c] via-[#121212] to-black">
            <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff784e]/10 blur-[150px]" />
          </div>
        )}
      </div>

      <div className="absolute inset-0 z-[2] bg-black/40" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/40 via-transparent to-black/70" />

      {/* SLIDER CONTROLS */}
      {slides.length > 1 && (
        <>
          <button type="button" onClick={prev}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 hidden sm:flex lg:left-8" aria-label="Previous slide">
            <div className="flex h-12 w-12 items-center justify-center border border-white/30 text-white backdrop-blur-sm transition-all duration-300 hover:border-[#ff784e] hover:text-[#ff784e]">
              <ChevronLeft size={20} />
            </div>
          </button>
          <button type="button" onClick={next}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 hidden sm:flex lg:right-8" aria-label="Next slide">
            <div className="flex h-12 w-12 items-center justify-center border border-white/30 text-white backdrop-blur-sm transition-all duration-300 hover:border-[#ff784e] hover:text-[#ff784e]">
              <ChevronRight size={20} />
            </div>
          </button>

          {/* Dots */}
          <div className="absolute bottom-[90px] left-1/2 z-20 -translate-x-1/2 sm:bottom-[130px] lg:bottom-[140px]">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {slides.map((_, i) => (
                <button key={i} type="button"
                  onClick={() => { if (intervalRef.current) clearInterval(intervalRef.current); goTo(i); }}
                  className={`h-[3px] transition-all duration-500 ${i === current ? "w-6 sm:w-8 bg-[#ff784e]" : "w-3 sm:w-4 bg-white/40"}`}
                  aria-label={`Go to slide ${i + 1}`} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* HERO CONTENT */}
      <div ref={contentRef}
        className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1500px] flex-col items-center justify-center px-4 pt-[70px] pb-[240px] text-center sm:h-screen sm:px-8 sm:pt-20 sm:pb-[180px] lg:px-10 lg:pt-32 lg:pb-60">
        
        {/* Badge / Subtitle */}
        <div className="hero-label mb-3 flex items-center gap-1.5 sm:mb-6 sm:gap-3">
          <span className="h-px w-5 bg-[#ff784e] sm:w-10" />
          <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-white sm:text-[11px] sm:tracking-[0.3em]">
            {activeSlide?.badge_text || activeSlide?.subtitle || settings?.app_name || "Welcome"}
          </span>
          <span className="h-px w-5 bg-[#ff784e] sm:w-10" />
        </div>

        {/* Title */}
        <h1 className="hero-title text-[28px] font-light leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-[88px]">
          {activeSlide?.title ? (
            <span>{activeSlide.title}</span>
          ) : (
            <span>{settings?.app_name || "The Azura Hotel"}</span>
          )}
        </h1>

        {/* Description */}
        {(activeSlide?.description || settings?.hotel_tagline) && (
          <p className="hero-description mt-3 max-w-[280px] px-1 text-[10px] leading-[1.4] text-white/80 sm:mt-7 sm:max-w-2xl sm:text-sm sm:leading-7 md:text-base">
            {activeSlide?.description || settings?.hotel_tagline}
          </p>
        )}

        {/* Action Buttons */}
        <div className="hero-actions mt-4 flex w-full max-w-xs flex-col gap-2.5 sm:mt-9 sm:max-w-none sm:flex-row sm:justify-center sm:gap-3">
          <Link href={activeSlide?.button_link || "/rooms"}
            className="group flex w-full items-center justify-center gap-3 bg-[#ff784e] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:bg-white hover:text-black sm:w-fit sm:gap-4 sm:px-6 sm:py-3.5 sm:text-[12px]">
            {activeSlide?.button_text || "Explore Rooms"}
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-black transition-all duration-300 group-hover:bg-[#ff784e] group-hover:text-white sm:h-7 sm:w-7">
              <ArrowUpRight size={13} />
            </span>
          </Link>
          <Link href="/rooms"
            className="flex w-full items-center justify-center gap-2.5 border border-white/40 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black sm:w-fit sm:gap-3 sm:px-6 sm:py-3.5 sm:text-[12px]">
            Check Availability
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BOOKING SEARCH BAR */}
      {/* ========================================================= */}

      <div ref={bookingRef} className="absolute bottom-0 left-0 z-20 w-full">
        <div className="mx-auto max-w-[1500px] px-2.5 pb-2.5 sm:px-6 sm:pb-5 lg:px-10 lg:pb-8">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-2xl backdrop-blur-xl sm:rounded-2xl lg:rounded-3xl">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-[#ff784e] to-transparent" />

            {/* Mobile layout — compact */}
            <div className="p-2 sm:hidden">
              <div className="grid grid-cols-2 gap-1.5">
                <DateButton label="Check-in" value={checkIn} mode="checkin" />
                <DateButton label="Check-out" value={checkOut} mode="checkout" />
                <button type="button"
                  onClick={(e) => openGuests(e.currentTarget)}
                  className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.04] px-3 py-2.5 text-left">
                  <Users size={13} className="text-[#ff784e] shrink-0" />
                  <div className="flex flex-1 flex-col min-w-0">
                    <span className="text-[7px] font-bold uppercase tracking-[0.14em] text-white/35">Guests</span>
                    <span className="mt-px text-[11px] font-medium text-white truncate">{adults}A, {children}C</span>
                  </div>
                  <ChevronDown size={11} className={`text-white/25 transition-all duration-300 shrink-0 ${guestsOpen ? "rotate-180 text-[#ff784e]" : ""}`} />
                </button>
                <button type="button"
                  onClick={(e) => openRooms(e.currentTarget)}
                  className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.04] px-3 py-2.5 text-left">
                  <BedDouble size={13} className="text-[#ff784e] shrink-0" />
                  <div className="flex flex-1 flex-col min-w-0">
                    <span className="text-[7px] font-bold uppercase tracking-[0.14em] text-white/35">Rooms</span>
                    <span className="mt-px text-[11px] font-medium text-white truncate">{rooms} Room{rooms > 1 ? "s" : ""}</span>
                  </div>
                  <ChevronDown size={11} className={`text-white/25 transition-all duration-300 shrink-0 ${roomsOpen ? "rotate-180 text-[#ff784e]" : ""}`} />
                </button>
              </div>
              <Link href={`/rooms?checkin=${checkIn}&checkout=${checkOut}&adults=${adults}&children=${children}&rooms=${rooms}`}
                className="mt-1.5 flex items-center justify-center gap-1.5 rounded-lg bg-[#ff784e] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                Check Availability <ArrowUpRight size={12} />
              </Link>
            </div>

            {/* Desktop layout */}
            <div className="hidden sm:block p-3 lg:p-4">
              <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-stretch">
                <DateButton label="Check-in" value={checkIn} mode="checkin" />
                <DateButton label="Check-out" value={checkOut} mode="checkout" />

                {/* Guests */}
                <div className="relative">
                  <button type="button"
                    onClick={(e) => openGuests(e.currentTarget)}
                    className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.05] px-5 py-3.5 text-left transition-all duration-300 hover:border-white/15 hover:bg-white/[0.08]">
                    <span className="text-[#ff784e]"><Users size={18} /></span>
                    <span className="flex flex-1 flex-col">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">Guests</span>
                      <span className="mt-1 whitespace-nowrap text-sm font-medium text-white">{adults} Adults, {children} Children</span>
                    </span>
                    <ChevronDown size={14} className={`text-white/30 transition-all duration-300 ${guestsOpen ? "rotate-180 text-[#ff784e]" : ""}`} />
                  </button>
                </div>

                {/* Rooms */}
                <div className="relative">
                  <button type="button"
                    onClick={(e) => openRooms(e.currentTarget)}
                    className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.05] px-5 py-3.5 text-left transition-all duration-300 hover:border-white/15 hover:bg-white/[0.08]">
                    <span className="text-[#ff784e]"><BedDouble size={18} /></span>
                    <span className="flex flex-1 flex-col">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">Rooms</span>
                      <span className="mt-1 whitespace-nowrap text-sm font-medium text-white">{rooms} Room{rooms > 1 ? "s" : ""}</span>
                    </span>
                    <ChevronDown size={14} className={`text-white/30 transition-all duration-300 ${roomsOpen ? "rotate-180 text-[#ff784e]" : ""}`} />
                  </button>
                </div>

                <Link href={`/rooms?checkin=${checkIn}&checkout=${checkOut}&adults=${adults}&children=${children}&rooms=${rooms}`}
                  className="group flex col-span-2 w-full items-center justify-center gap-2.5 rounded-xl bg-[#ff784e] px-5 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-white hover:text-black lg:col-span-1 lg:py-0">
                  Check Availability
                  <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside overlay */}
      {(dateOpen || guestsOpen || roomsOpen) && (
        <div className="fixed inset-0 z-[99] bg-black/40 sm:bg-transparent" onClick={closeAll} />
      )}

      {/* Calendar portal */}
      {dateOpen && typeof window !== "undefined" && createPortal(
        <div data-lenis-prevent onClick={(e) => e.stopPropagation()}
          className="fixed z-[100] overflow-hidden rounded-2xl border border-white/10 bg-black/95 shadow-2xl backdrop-blur-xl"
          style={{
            ...(calendarPos.bottom != null ? { bottom: calendarPos.bottom } : { top: calendarPos.top }),
            left: calendarPos.left,
            width: window.innerWidth < 640 ? "min(280px, calc(100vw - 24px))" : "min(520px, calc(100vw - 32px))",
            maxHeight: calendarPos.maxHeight ?? (window.innerWidth < 640 ? "min(380px, calc(100dvh - 100px))" : "min(420px, calc(100vh - 120px))"),
          }}>
          <div className="overflow-y-auto">
            <DatePicker
              checkIn={checkIn}
              checkOut={checkOut}
              mode={dateMode}
              onCheckInChange={(d) => {
                setCheckIn(d);
                closeAll();
              }}
              onCheckOutChange={(d) => {
                setCheckOut(d);
                if (d) closeAll();
              }}
            />
          </div>
        </div>,
        document.body
      )}

      {/* Guests portal */}
      {guestsOpen && typeof window !== "undefined" && createPortal(
        <div data-lenis-prevent
          className="fixed z-[100] overflow-hidden rounded-2xl border border-white/10 bg-black/95 shadow-2xl backdrop-blur-xl"
          style={{
            ...(guestsPos.bottom != null ? { bottom: guestsPos.bottom } : { top: guestsPos.top }),
            left: guestsPos.left,
            width: window.innerWidth < 640 ? "min(280px, calc(100vw - 24px))" : 280,
          }}>
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-sm font-medium text-white">Adults</span>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-sm font-bold text-white transition hover:border-[#ff784e] hover:text-[#ff784e]">-</button>
                <span className="w-6 text-center text-base font-semibold text-white">{adults}</span>
                <button type="button" onClick={() => setAdults(Math.min(10, adults + 1))} className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-sm font-bold text-white transition hover:border-[#ff784e] hover:text-[#ff784e]">+</button>
              </div>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex items-center justify-between py-2.5">
              <span className="text-sm font-medium text-white">Children</span>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setChildren(Math.max(0, children - 1))} className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-sm font-bold text-white transition hover:border-[#ff784e] hover:text-[#ff784e]">-</button>
                <span className="w-6 text-center text-base font-semibold text-white">{children}</span>
                <button type="button" onClick={() => setChildren(Math.min(6, children + 1))} className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-sm font-bold text-white transition hover:border-[#ff784e] hover:text-[#ff784e]">+</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Rooms portal */}
      {roomsOpen && typeof window !== "undefined" && createPortal(
        <div data-lenis-prevent
          className="fixed z-[100] overflow-hidden rounded-2xl border border-white/10 bg-black/95 shadow-2xl backdrop-blur-xl"
          style={{
            ...(roomsPos.bottom != null ? { bottom: roomsPos.bottom } : { top: roomsPos.top }),
            left: roomsPos.left,
            width: window.innerWidth < 640 ? "min(240px, calc(100vw - 24px))" : 240,
          }}>
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-sm font-medium text-white">Rooms</span>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setRooms(Math.max(1, rooms - 1))} className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-sm font-bold text-white transition hover:border-[#ff784e] hover:text-[#ff784e]">-</button>
                <span className="w-6 text-center text-base font-semibold text-white">{rooms}</span>
                <button type="button" onClick={() => setRooms(Math.min(5, rooms + 1))} className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-sm font-bold text-white transition hover:border-[#ff784e] hover:text-[#ff784e]">+</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}

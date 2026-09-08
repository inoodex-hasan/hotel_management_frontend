"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Dumbbell,
  Waves,
  Utensils,
  Sparkles,
  Car,
  Wifi,
  Calendar,
  Coffee,
  ShieldCheck,
} from "lucide-react";
import { getFacilities, FacilityItem } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  Waves,
  Utensils,
  Sparkles,
  Dumbbell,
  Car,
  Wifi,
  Calendar,
  Coffee,
  ShieldCheck,
};

const DEFAULT_FACILITIES: FacilityItem[] = [
  {
    id: 1,
    title: "Infinity Pool",
    subtitle: "Relax & Refresh",
    description: "Take a refreshing break and unwind beside our beautifully designed pool.",
    image: "/images/facilities/pool.webp",
    icon: "Waves",
    features: ["Heated Pool", "Poolside Bar"],
  },
  {
    id: 2,
    title: "Fine Dining",
    subtitle: "Taste & Discover",
    description: "Enjoy carefully crafted dishes prepared with fresh ingredients.",
    image: "/images/facilities/dining.avif",
    icon: "Utensils",
    features: ["International Menu", "Private Dining"],
  },
  {
    id: 3,
    title: "Spa & Wellness",
    subtitle: "Relax & Rejuvenate",
    description: "Restore your body and mind with our relaxing wellness experience.",
    image: "/images/facilities/spa.avif",
    icon: "Sparkles",
    features: ["Couples Treatment", "Sauna"],
  },
  {
    id: 4,
    title: "Fitness Center",
    subtitle: "Move & Energize",
    description: "Stay active with modern equipment available throughout your stay.",
    image: "/images/facilities/gym.webp",
    icon: "Dumbbell",
    features: ["Modern Equipment", "24/7 Access"],
  },
  {
    id: 5,
    title: "Private Parking",
    subtitle: "Easy & Convenient",
    description: "Secure and convenient parking for a worry-free arrival.",
    image: "/images/facilities/parking.jpg",
    icon: "Car",
    features: ["24/7 Security", "Valet Service"],
  },
  {
    id: 6,
    title: "High-Speed Wi-Fi",
    subtitle: "Always Connected",
    description: "Stay connected with reliable high-speed Wi-Fi throughout the hotel.",
    image: "/images/facilities/wifi.avif",
    icon: "Wifi",
    features: ["Fiber Optic", "No Limits"],
  },
];

export default function FacilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [facilities, setFacilities] = useState<FacilityItem[]>(DEFAULT_FACILITIES);

  useEffect(() => {
    getFacilities()
      .then((data) => {
        if (data && data.length > 0) {
          setFacilities(data);
        }
      })
      .catch((err) => {
        console.warn("Failed to load facilities:", err);
      });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".facility-heading", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      gsap.from(".facility-card", {
        y: 80,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".facilities-grid",
          start: "top 80%",
          once: true,
        },
      });

      gsap.from(".facility-bottom", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".facility-bottom",
          start: "top 90%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#e85d04] py-24 sm:py-32 lg:py-40"
    >
      {/* Decorative Number */}
      <div className="pointer-events-none absolute -left-10 top-16 select-none text-[180px] font-bold leading-none tracking-[-0.08em] text-white/[0.025] sm:text-[260px] lg:text-[360px]">
        02
      </div>

      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-10">

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <div className="facility-heading mb-14 grid grid-cols-1 gap-8 lg:mb-16 lg:grid-cols-[1fr_auto] lg:items-end">

          <div>
            {/* Label */}
            <div className="mb-6 flex items-center gap-3">
              <span className="h-[2px] w-10 bg-[#e85d04]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#e85d04]">
                Hotel Facilities
              </span>
            </div>

            {/* Heading */}
            <h2 className="max-w-3xl text-4xl font-light leading-[1] tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl">
              Everything you need,
              <br />
              <span className="font-semibold">
                all in one place.
              </span>
            </h2>
          </div>

          {/* Description */}
          <div className="max-w-sm lg:pb-1">
            <p className="border-l-2 border-[#e85d04] pl-5 text-sm leading-7 text-white/45">
              From wellness and dining to leisure and convenience,
              discover everything designed to make your stay
              effortless.
            </p>
          </div>

        </div>

        {/* ===================================================== */}
        {/* FEATURED FACILITIES */}
        {/* ===================================================== */}

        <div className="facilities-grid grid grid-cols-1 gap-5 lg:grid-cols-2">

          {facilities.slice(0, 2).map((facility) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              large
            />
          ))}

        </div>

        {/* ===================================================== */}
        {/* SMALL FACILITIES */}
        {/* ===================================================== */}

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {facilities.slice(2).map((facility) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
            />
          ))}

        </div>

        {/* ===================================================== */}
        {/* BOTTOM CTA */}
        {/* ===================================================== */}

        <div className="facility-bottom mt-14 flex flex-col justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center">

          <div>
            <p className="text-xs leading-6 text-white/35">
              Designed around your comfort.
              Created around your experience.
            </p>
          </div>

          <Link
            href="/facilities"
            className="group flex w-fit items-center gap-4 border border-white/20 px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:border-[#e85d04] hover:bg-[#e85d04]"
          >
            Explore All Facilities

            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e85d04] transition-all duration-300 group-hover:bg-white group-hover:text-[#e85d04]">
              <ArrowUpRight size={14} />
            </span>
          </Link>

        </div>

      </div>
    </section>
  );
}

/* ============================================================= */
/* FACILITY CARD */
/* ============================================================= */

function FacilityCard({
  facility,
  large = false,
}: {
  facility: FacilityItem;
  large?: boolean;
}) {
  const Icon = (typeof facility.icon === "string" ? iconMap[facility.icon] : facility.icon) || Sparkles;

  return (
    <Link
      href="/facilities"
      className={`facility-card group relative block overflow-hidden bg-white ${
        large
          ? "aspect-[16/10] sm:aspect-[16/9]"
          : "aspect-[1/1]"
      }`}
    >

      {/* ================================================= */}
      {/* IMAGE */}
      {/* ================================================= */}

      <img
        src={facility.image || "/images/facilities/pool.webp"}
        alt={facility.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/images/facilities/pool.webp";
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 transition-all duration-500 group-hover:opacity-100" />

      {/* Hover Orange Overlay */}
      <div className="absolute inset-0 bg-[#e85d04]/0 transition-all duration-500 group-hover:bg-[#e85d04]/10" />

      {/* ================================================= */}
      {/* TOP ICON */}
      {/* ================================================= */}

      <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center border border-white/30 bg-black/20 text-white backdrop-blur-sm transition-all duration-500 group-hover:border-[#e85d04] group-hover:bg-[#e85d04]">
        <Icon size={18} strokeWidth={1.5} />
      </div>

      {/* Number */}
      <span className="absolute right-5 top-5 text-[10px] font-medium tracking-[0.2em] text-white/60">
        0{facility.id}
      </span>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">

        {/* Subtitle */}
        <span className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#e85d04]">
          {facility.subtitle}
        </span>

        {/* Title */}
        <div className="flex items-end justify-between gap-5">

          <div>
            <h3
              className={`font-semibold tracking-[-0.025em] text-white ${
                large
                  ? "text-3xl sm:text-4xl"
                  : "text-2xl"
              }`}
            >
              {facility.title}
            </h3>

            {/* Description only on large cards */}
            {large && (
              <p className="mt-3 max-w-md text-xs leading-6 text-white/55">
                {facility.description}
              </p>
            )}
          </div>

          {/* Arrow */}
          <span className="flex h-11 w-11 shrink-0 translate-y-2 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:bg-[#e85d04] group-hover:text-white group-hover:opacity-100">
            <ArrowUpRight size={18} />
          </span>

        </div>

        {/* Bottom Line */}
        <div className="mt-5 h-px w-full bg-white/20">
          <div className="h-full w-0 bg-[#e85d04] transition-all duration-700 group-hover:w-full" />
        </div>

      </div>

    </Link>
  );
}
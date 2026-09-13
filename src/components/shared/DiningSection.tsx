"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Utensils,
  Clock3,
  Wine,
} from "lucide-react";
import { getDiningVenues, DiningItem } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

export default function DiningSection({
  initialVenues = [],
}: {
  initialVenues?: DiningItem[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const initialVenue = initialVenues.length > 0 ? initialVenues[0] : null;
  const [venue, setVenue] = useState<DiningItem | null>(initialVenue);
  const [isLoading, setIsLoading] = useState(!initialVenue);

  useEffect(() => {
    if (venue) {
      setIsLoading(false);
      return;
    }
    let isMounted = true;
    getDiningVenues()
      .then((venues) => {
        if (isMounted && venues && venues.length > 0) {
          setVenue(venues[0]);
        }
      })
      .catch((err) => {
        console.warn("Failed to load dining venue in DiningSection:", err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [venue]);

  useEffect(() => {
    if (!venue) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.from(".dining-label", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      })
        .from(
          ".dining-title-line",
          {
            y: 80,
            opacity: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power4.out",
          },
          "-=0.35"
        )
        .from(
          ".dining-image",
          {
            scale: 1.15,
            opacity: 0,
            duration: 1.3,
            ease: "power3.out",
          },
          "-=0.55"
        )
        .from(
          ".dining-content",
          {
            x: 70,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.8"
        )
        .from(
          ".dining-info",
          {
            y: 25,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.55"
        )
        .from(
          ".dining-cta",
          {
            y: 25,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [venue]);

  if (!isLoading && !venue) {
    return null;
  }

  if (!venue) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-black py-8 sm:py-14 lg:py-20"
    >
      {/* BG IMAGE */}
      {venue.image && (
        <div
          className="absolute inset-x-0 top-0 h-[35%] bg-cover bg-center bg-no-repeat opacity-25 sm:h-[50%] lg:h-[55%]"
          style={{ backgroundImage: `url('${venue.image}')` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">

        {/* TOP LABEL */}
        <div className="dining-label mb-4 flex items-center border-b border-white/10 pb-2.5 sm:mb-8 sm:pb-3 lg:mb-10">
          <span className="h-[2px] w-8 bg-[#ff784e] sm:w-10" />
        </div>

        {/* BIG TITLE */}
        <div className="mb-5 sm:mb-8 lg:mb-12">
          <div className="overflow-hidden pb-1 sm:pb-2">
            <h2 className="dining-title-line text-[36px] font-light leading-[1] tracking-[-0.04em] text-white sm:text-6xl lg:text-[100px]">
              Taste something
            </h2>
          </div>
          <div className="overflow-hidden pb-1 sm:pb-2">
            <h2 className="dining-title-line text-[36px] font-semibold leading-[1] tracking-[-0.04em] text-white sm:text-6xl lg:text-[100px]">
              unforgettable<span className="text-[#ff784e]">.</span>
            </h2>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 gap-5 sm:gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">

          {/* IMAGE */}
          <div className="relative">
            <div className="dining-image group relative aspect-[4/3] overflow-hidden bg-white/5 sm:aspect-[5/3] lg:aspect-[2/1]">
              {venue.image ? (
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="h-full w-full object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#141414] to-black" />
              )}
              <div className="absolute inset-0 bg-black/15 transition-all duration-500 group-hover:bg-black/25" />
              <div className="absolute bottom-0 left-0 h-[3px] w-1/3 bg-[#ff784e] transition-all duration-700 group-hover:w-full sm:h-1" />
            </div>
          </div>

          {/* CONTENT */}
          <div className="dining-content">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#ff784e] sm:text-[10px] sm:tracking-[0.25em]">
              {venue.label || "Signature Restaurant"}
            </p>

            <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.02em] text-white sm:mt-5 sm:text-3xl lg:text-5xl">
              {venue.name}
            </h3>

            <div className="mt-4 h-[2px] w-10 bg-[#ff784e] sm:mt-6 sm:w-12" />

            <p className="mt-4 text-[13px] leading-6 text-white/55 sm:mt-6 sm:text-sm sm:leading-7 lg:text-base">
              {venue.description}
            </p>

            {/* INFO */}
            <div className="mt-5 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-3">
              <div className="dining-info rounded-lg border border-white/10 p-2.5 sm:p-4">
                <Utensils size={15} strokeWidth={1.5} className="text-[#ff784e] sm:size-[18px]" />
                <p className="mt-2 text-[7px] font-semibold uppercase tracking-[0.12em] text-white/40 sm:mt-3 sm:text-[9px] sm:tracking-[0.15em]">Cuisine</p>
                <p className="mt-0.5 text-[10px] font-medium text-white sm:text-sm truncate">{venue.details?.serves || venue.serves || "International"}</p>
              </div>
              <div className="dining-info rounded-lg border border-white/10 p-2.5 sm:p-4">
                <Clock3 size={15} strokeWidth={1.5} className="text-[#ff784e] sm:size-[18px]" />
                <p className="mt-2 text-[7px] font-semibold uppercase tracking-[0.12em] text-white/40 sm:mt-3 sm:text-[9px] sm:tracking-[0.15em]">Open</p>
                <p className="mt-0.5 text-[10px] font-medium text-white sm:text-sm truncate">{venue.details?.hours || venue.hours || "07:00 — 23:00"}</p>
              </div>
              <div className="dining-info rounded-lg border border-white/10 p-2.5 sm:p-4">
                <Wine size={15} strokeWidth={1.5} className="text-[#ff784e] sm:size-[18px]" />
                <p className="mt-2 text-[7px] font-semibold uppercase tracking-[0.12em] text-white/40 sm:mt-3 sm:text-[9px] sm:tracking-[0.15em]">Location</p>
                <p className="mt-0.5 text-[10px] font-medium text-white sm:text-sm truncate">{venue.details?.location || venue.location || "Lobby Level"}</p>
              </div>
            </div>

            {/* CTA */}
            <div className="dining-cta mt-6 sm:mt-8">
              <Link
                href="/dining"
                className="group flex w-full items-center justify-center gap-3 rounded-lg bg-white px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.13em] text-black transition-all duration-300 hover:bg-[#ff784e] hover:text-white sm:inline-flex sm:w-auto sm:justify-start sm:px-6 sm:gap-4"
              >
                Explore Dining
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff784e] text-white transition-all duration-300 group-hover:bg-white group-hover:text-[#ff784e] sm:h-7 sm:w-7">
                  <ArrowUpRight size={13} />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM MARQUEE */}
        <div className="mt-8 border-y border-white/10 py-3 sm:mt-14 sm:py-4 lg:mt-20">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:flex-nowrap sm:justify-between sm:gap-6 lg:gap-8">
            <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-white/40 sm:text-[9px] sm:tracking-[0.2em] lg:text-[10px] lg:tracking-[0.3em]">Fresh Ingredients</span>
            <span className="hidden h-[3px] w-[3px] shrink-0 rounded-full bg-[#ff784e] sm:block sm:h-1 sm:w-1" />
            <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-white/40 sm:text-[9px] sm:tracking-[0.2em] lg:text-[10px] lg:tracking-[0.3em]">Crafted With Care</span>
            <span className="hidden h-[3px] w-[3px] shrink-0 rounded-full bg-[#ff784e] sm:block sm:h-1 sm:w-1" />
            <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-white/40 sm:text-[9px] sm:tracking-[0.2em] lg:text-[10px] lg:tracking-[0.3em]">Exceptional Taste</span>
            <span className="hidden h-[3px] w-[3px] shrink-0 rounded-full bg-[#ff784e] sm:block sm:h-1 sm:w-1" />
            <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-white/40 sm:text-[9px] sm:tracking-[0.2em] lg:text-[10px] lg:tracking-[0.3em]">Memorable Moments</span>
          </div>
        </div>

      </div>
    </section>
  );
}

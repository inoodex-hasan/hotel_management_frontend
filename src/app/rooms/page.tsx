"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Users,
  Maximize2,
  Star,
  Sparkles,
  Phone,
} from "lucide-react";

import { roomsData } from "@/lib/roomsData";
import { getRoomTypes, RoomType } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

function RoomsPageInner() {
  const pageRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const bp = `checkin=${searchParams.get("checkin") || ""}&checkout=${searchParams.get("checkout") || ""}&adults=${searchParams.get("adults") || "2"}&children=${searchParams.get("children") || "0"}&rooms=${searchParams.get("rooms") || "1"}`;
  const [rooms, setRooms] = useState<RoomType[]>(() => roomsData as unknown as RoomType[]);

  useEffect(() => {
    getRoomTypes().then((data) => {
      if (data && data.length > 0) {
        setRooms(data);
      }
    });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".rooms-hero-text", {
        y: 50, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2,
      });

      gsap.utils.toArray<HTMLElement>(".room-block").forEach((block) => {
        gsap.fromTo(block, { y: 60, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: block, start: "top 85%", toggleActions: "play none none none" },
        });
      });

      gsap.from(".stat-item", {
        y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".stats-strip", start: "top 90%", once: true },
      });

      gsap.from(".cta-block", {
        y: 30, opacity: 0, duration: 0.8,
        scrollTrigger: { trigger: ".cta-section", start: "top 90%", once: true },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} className="bg-white text-black overflow-hidden">

      {/* HERO */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden pt-[86px] lg:min-h-[65vh]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: "url('/images/room1.avif')" }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

        <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 lg:px-10 pb-14 sm:pb-20">
          <div className="rooms-hero-text max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <Sparkles size={14} className="text-[#ff784e]" />
              <span className="text-[#ff784e] text-[10px] font-bold uppercase tracking-[0.3em]">The Azura Collection</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[76px] font-serif font-light leading-[0.95] text-white">
              Rooms &{" "}
              <span className="italic text-[#ff784e]">Suites</span>
            </h1>
            <p className="mt-5 max-w-lg text-white/60 text-[15px] leading-7">
              Discover our collection of beautifully designed rooms and suites, each crafted to deliver an unforgettable stay at The Azura.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a href="#rooms" className="group inline-flex items-center gap-3 bg-[#ff784e] text-white px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] hover:bg-white hover:text-[#1a1a1a] transition-all duration-300 rounded-lg">
                View Rooms <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a href="tel:+8801401777888" className="inline-flex items-center gap-2 border border-white/25 text-white px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] hover:border-[#ff784e] hover:text-[#ff784e] transition-all duration-300 rounded-lg">
                <Phone size={14} /> Call to Book
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="stats-strip border-b border-black/5 bg-white">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {[
              { value: "6", label: "Room Types" },
              { value: "320+", label: "Sq Ft to 1200" },
              { value: "24/7", label: "Room Service" },
              { value: "5★", label: "Suite Rating" },
            ].map((stat, i) => (
              <div key={stat.label} className={`stat-item flex items-center gap-4 py-6 lg:py-8 ${i < 3 ? "lg:border-r lg:border-black/5" : ""} ${i === 0 ? "" : "border-l border-black/5 lg:border-l-0"}`}>
                <span className="text-2xl sm:text-3xl font-serif font-light text-[#ff784e]">{stat.value}</span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-black/40 leading-tight">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROOMS LIST */}
      <section id="rooms" className="rooms-list py-16 lg:py-24 bg-[#fafafa]">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-10">
          <div className="mb-14 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-[#ff784e]/40" />
              <span className="text-[#ff784e] text-[10px] font-bold uppercase tracking-[0.3em]">Our Collection</span>
              <span className="h-px w-8 bg-[#ff784e]/40" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-light text-[#1a1a1a]">Explore Every Room</h2>
            <p className="mt-3 max-w-lg mx-auto text-black/40 text-[14px] leading-7">
              From cozy rooms to lavish suites, find the perfect space for your stay.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.slug} id={room.slug} className="room-block scroll-mt-24 group overflow-hidden border border-black/[0.08] bg-white hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-500">
                {/* IMAGE */}
                <div className="relative block aspect-[4/3] overflow-hidden bg-black">
                  <img src={room.image} alt={room.name} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/10 transition-all duration-500 group-hover:bg-black/25" />
                  {room.tag && (
                    <div className="absolute left-2 top-2 sm:left-3 sm:top-3">
                      <span className="px-2 py-1 text-[9px] font-semibold uppercase tracking-wider sm:px-3 sm:py-1.5 sm:text-[10px] bg-[#ff784e] text-white">{room.tag}</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                    <span className="px-2 py-1 text-[8px] font-medium uppercase tracking-wider bg-black/50 text-white backdrop-blur-sm rounded-sm sm:px-3 sm:py-1.5">{room.floor}</span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-sm font-semibold leading-tight text-black sm:text-lg group-hover:text-[#ff784e] transition-colors">{room.name}</h3>
                  <p className="mt-0.5 text-[11px] text-black/40">{room.subtitle}</p>

                  <div className="mt-1.5 flex gap-0.5 sm:mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={`${i < room.stars ? "fill-[#ff784e] text-[#ff784e]" : "text-black/15"} sm:size-3.5`} />
                    ))}
                  </div>

                  <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#ff784e]/10">
                        <Maximize2 size={13} className="text-[#ff784e]" />
                      </span>
                      <span className="text-[12px] font-medium text-black/70 sm:text-[13px]">
                        Room Size: <span className="text-black/90">{room.size}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#ff784e]/10">
                        <BedDouble size={13} className="text-[#ff784e]" />
                      </span>
                      <span className="text-[12px] font-medium text-black/70 sm:text-[13px]">
                        Bed: <span className="text-black/90">{room.bed}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#ff784e]/10">
                        <Users size={13} className="text-[#ff784e]" />
                      </span>
                      <span className="text-[12px] font-medium text-black/70 sm:text-[13px]">
                        Max: <span className="text-black/90">{room.maxGuests}</span>
                      </span>
                    </div>
                  </div>

                  {/* Price + View */}
                  <div className="mt-4 flex items-end justify-between border-t border-black/[0.08] pt-4 sm:mt-5 sm:pt-5">
                    <div>
                      <span className="text-xl font-bold tracking-tight text-black sm:text-2xl">
                        &#x09F3;{room.price}
                      </span>
                      <span className="ml-1 text-[10px] font-medium uppercase tracking-wide text-black/40">
                        /Night (Net)
                      </span>
                    </div>
                    <Link href={`/rooms/${room.slug}?${bp}`}
                      className="group/link flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#ff784e] transition-colors hover:text-black sm:text-[12px]">
                      View Detail
                      <ArrowUpRight size={14} className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section cta-block relative py-20 lg:py-28 bg-[#1a1a1a] overflow-hidden">
        <div className="absolute inset-0 opacity-10"><img src="/images/about/about-hero.jpg" alt="" className="w-full h-full object-cover" /></div>
        <div className="absolute inset-0 bg-[#1a1a1a]/80" />
        <div className="absolute top-8 left-8 h-16 w-16 border-t border-l border-[#ff784e]/20" />
        <div className="absolute bottom-8 right-8 h-16 w-16 border-b border-r border-[#ff784e]/20" />
        <div className="relative z-10 max-w-[1500px] mx-auto px-6 lg:px-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#ff784e]/40" />
            <span className="text-[#ff784e] text-[10px] font-bold uppercase tracking-[0.3em]">Need Help Choosing?</span>
            <span className="h-px w-8 bg-[#ff784e]/40" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-white leading-tight">
            Let Us Help You Find the <span className="italic text-[#ff784e]">Perfect Room</span>
          </h2>
          <p className="mt-5 max-w-lg mx-auto text-white/50 text-[15px] leading-7">
            Our team is available 24/7 to help you choose the best room for your needs. Call us or book online.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:+8801401777888" className="group inline-flex items-center gap-4 bg-[#ff784e] text-white px-10 py-5 text-xs font-bold uppercase tracking-[0.18em] hover:bg-white hover:text-[#1a1a1a] transition-all duration-300">
              Call +880 1401 777 888 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <Link href="/booking" className="inline-flex items-center gap-3 border border-white/20 text-white px-10 py-5 text-xs font-bold uppercase tracking-[0.18em] hover:border-[#ff784e] hover:text-[#ff784e] transition-all duration-300">
              Book Online
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

export default function RoomsPage() {
  return (
    <Suspense fallback={<div />}>
      <RoomsPageInner />
    </Suspense>
  );
}

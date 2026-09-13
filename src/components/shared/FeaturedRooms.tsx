"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Users,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Star,
  Maximize2,
} from "lucide-react";
import { getRoomTypes, RoomType } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

function formatRoomCard(r: any, i: number) {
  return {
    id: i + 1,
    slug: r.slug,
    name: r.name,
    tags: r.tag ? [r.tag] : [],
    image: r.image || r.thumbnail_url || "",
    price: r.price || (r.base_price_per_night ? Number(r.base_price_per_night).toLocaleString() : ""),
    size: r.floor || r.size || "",
    bed: r.bed || r.bed_type || "",
    maxGuests: r.maxGuests || (r.capacity_adults ? `${r.capacity_adults} Adults` : ""),
    stars: r.stars || 5,
  };
}

export default function FeaturedRooms({
  initialRooms = [],
}: {
  initialRooms?: RoomType[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const formattedInitial = initialRooms.length > 0
    ? initialRooms.slice(0, 5).map((r, i) => formatRoomCard(r, i))
    : [];
  const [rooms, setRooms] = useState<any[]>(formattedInitial);
  const [isLoading, setIsLoading] = useState(formattedInitial.length === 0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (rooms.length > 0) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    getRoomTypes()
      .then((data) => {
        setRooms((data || []).slice(0, 5).map((r, i) => formatRoomCard(r, i)));
        setIsLoading(false);
      })
      .catch(() => {
        setRooms([]);
        setIsLoading(false);
      });
  }, [rooms.length]);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
    }
    return () => el?.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const goToSlide = (index: number) => {
    setActiveSlide(index);
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[index] as HTMLElement;
    if (card) {
      el.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const cards = el.children;
      if (!cards.length) return;
      const scrollLeft = el.scrollLeft;
      let closest = 0;
      let minDist = Infinity;
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i] as HTMLElement;
        const dist = Math.abs(card.offsetLeft - scrollLeft);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      }
      setActiveSlide(closest);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".rooms-heading", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      gsap.from(".room-card", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".rooms-grid",
          start: "top 80%",
          once: true,
        },
      });

      gsap.from(".rooms-button", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".rooms-button",
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
      className="relative overflow-hidden bg-white py-16 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1500px] px-4 sm:px-8 lg:px-10">

        {/* HEADER */}
        <div className="rooms-heading mb-8 flex items-center justify-between gap-4 sm:mb-14 lg:mb-16">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-light leading-[1.05] tracking-[-0.035em] text-[#ff784e] sm:text-5xl lg:text-6xl">
              Our Rooms &{" "}
              <span className="font-semibold">Suites</span>
            </h2>
          </div>

          {/* Desktop Arrows */}
          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="flex h-12 w-12 items-center justify-center border border-black/15 text-black transition-all duration-300 hover:border-[#ff784e] hover:text-[#ff784e] disabled:opacity-30 disabled:hover:border-black/15 disabled:hover:text-black"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="flex h-12 w-12 items-center justify-center border border-black/15 text-black transition-all duration-300 hover:border-[#ff784e] hover:text-[#ff784e] disabled:opacity-30 disabled:hover:border-black/15 disabled:hover:text-black"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* ROOMS CARDS / SKELETON / EMPTY */}
        <div className="rooms-grid">
          {isLoading ? (
            <div className="flex gap-4 overflow-hidden pb-4 sm:gap-5">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="w-[85vw] shrink-0 animate-pulse border border-black/[0.08] bg-white sm:w-[calc(25%-15px)]">
                  <div className="aspect-[4/3] bg-black/5" />
                  <div className="p-4 sm:p-6 space-y-3">
                    <div className="h-5 w-3/4 bg-black/10 rounded" />
                    <div className="h-3 w-1/3 bg-black/10 rounded" />
                    <div className="space-y-2 pt-2">
                      <div className="h-3 w-full bg-black/5 rounded" />
                      <div className="h-3 w-full bg-black/5 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-black/15 rounded-2xl bg-white/50 p-8 max-w-xl mx-auto">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ff784e]/10 text-[#ff784e] mb-4">
                <BedDouble size={24} />
              </div>
              <h3 className="font-serif text-xl font-bold text-black mb-2">No Rooms Currently Listed</h3>
              <p className="text-xs text-black/60 max-w-md mx-auto mb-6">
                Our suite inventory is currently being updated. Please check back shortly or reach out to our concierge for special arrangements.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#ff784e] transition-colors">
                Contact Concierge
              </Link>
            </div>
          ) : (
            <div
              ref={scrollRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:gap-5"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {rooms.map((room) => (
                <article
                  key={room.id}
                  className="room-card group w-[85vw] shrink-0 snap-center overflow-hidden border border-black/[0.08] bg-white sm:w-[calc(25%-15px)] sm:snap-none"
                >
                  {/* IMAGE */}
                  <div className="relative block aspect-[4/3] overflow-hidden bg-black">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 transition-all duration-500 group-hover:bg-black/25" />

                    {/* Tags */}
                    <div className="absolute left-2 top-2 flex gap-1.5 sm:left-3 sm:top-3 sm:gap-2">
                      {room.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className={`px-2 py-1 text-[9px] font-semibold uppercase tracking-wider sm:px-3 sm:py-1.5 sm:text-[10px] ${
                            tag === "Featured"
                              ? "bg-[#ff784e] text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-sm font-semibold leading-tight text-black sm:text-lg">
                      {room.name}
                    </h3>

                    {/* Stars */}
                    <div className="mt-1.5 flex gap-0.5 sm:mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={`${i < room.stars ? "fill-[#ff784e] text-[#ff784e]" : "text-black/15"} sm:size-3.5`}
                        />
                      ))}
                    </div>

                    {/* Details */}
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
                          ৳{room.price}
                        </span>
                        <span className="ml-1 text-[10px] font-medium uppercase tracking-wide text-black/40">
                          /Night (Net)
                        </span>
                      </div>
                      <Link
                        href={`/rooms/${room.slug}`}
                        className="group/link flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#ff784e] transition-colors hover:text-black sm:text-[12px]"
                      >
                        View Detail
                        <ArrowUpRight size={14} className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* MOBILE DOTS */}
        {!isLoading && rooms.length > 0 && (
          <div className="mt-6 flex items-center justify-center gap-2 sm:hidden">
            {rooms.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeSlide ? "w-6 bg-[#ff784e]" : "w-2 bg-black/20"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* VIEW ALL */}
        {!isLoading && rooms.length > 0 && (
          <div className="rooms-button mt-8 flex justify-center sm:mt-12">
            <Link
              href="/rooms"
              className="group flex items-center gap-3 border border-black/15 bg-white px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-black transition-all duration-300 hover:border-[#ff784e] hover:bg-[#ff784e] hover:text-white sm:gap-4 sm:px-8 sm:py-4 sm:text-[11px]"
            >
              <span>View All Rooms</span>
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}

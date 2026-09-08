"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { getGalleryItems, GalleryItem } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

const fallbackGallery: GalleryItem[] = [
  { id: 1, title: "Grand Lobby", category: "Interior", image: "/images/room1.avif" },
  { id: 2, title: "Infinity Pool", category: "Experience", image: "/images/room2.avif" },
  { id: 3, title: "Luxury Suite", category: "Rooms", image: "/images/room3.avif" },
  { id: 4, title: "Signature Dining", category: "Dining", image: "/images/dining/restaurant.avif" },
  { id: 5, title: "Wellness & Spa", category: "Wellness", image: "/images/rooms/room-1.avif" },
  { id: 6, title: "Evening Lounge", category: "Lifestyle", image: "/images/rooms/room-2.avif" },
];

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [items, setItems] = useState<GalleryItem[]>(fallbackGallery);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch gallery items from API
  useEffect(() => {
    let isMounted = true;
    async function loadGallery() {
      try {
        const data = await getGalleryItems();
        if (isMounted && data && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        console.warn("Failed to load dynamic gallery items:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadGallery();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
    return ["All", ...cats];
  }, [items]);

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return items;
    return items.filter(
      (item) => item.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [items, activeCategory]);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gallery-heading", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      gsap.from(".gallery-category-tabs", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      gsap.from(".gallery-item", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".gallery-grid",
          start: "top 85%",
          once: true,
        },
      });

      gsap.from(".gallery-bottom", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".gallery-bottom",
          start: "top 90%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading, activeCategory]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : null));
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, filteredItems.length]);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-white py-12 sm:py-20 lg:py-32"
      >
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">

          {/* HEADER */}
          <div className="gallery-heading mb-8 flex flex-col justify-between gap-6 border-b border-black/10 pb-6 sm:mb-10 sm:pb-8 lg:mb-12 lg:flex-row lg:items-end">
            <div>
              <div className="mb-4 flex items-center gap-3 sm:mb-6">
                <span className="h-[2px] w-8 bg-[#ff784e] sm:w-10" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-black sm:text-[10px]">
                  Our Gallery
                </span>
              </div>
              <h2 className="text-4xl font-light leading-[0.95] tracking-[-0.05em] text-black sm:text-5xl lg:text-[82px]">
                See the
                <br />
                <span className="font-semibold">experience.</span>
              </h2>
            </div>
            <div className="max-w-sm lg:pb-2">
              <p className="border-l-2 border-[#ff784e] pl-5 text-[13px] leading-6 text-black/45 sm:text-sm sm:leading-7">
                Take a glimpse into the spaces, details, and
                experiences that make The Azura special.
              </p>
            </div>
          </div>

          {/* CATEGORY TABS (if more than 1 category) */}
          {categories.length > 2 && (
            <div className="gallery-category-tabs mb-8 flex flex-wrap items-center gap-2 sm:mb-10">
              {categories.map((cat) => {
                const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat);
                      setActiveIndex(null);
                    }}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                      isActive
                        ? "bg-black text-white shadow-md"
                        : "bg-black/[0.04] text-black/60 hover:bg-black/10 hover:text-black"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

          {/* GALLERY GRID */}
          <div className="gallery-grid grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {filteredItems.map((item, index) => (
              <button
                key={item.id || index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="gallery-item group relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-900 text-left"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/room1.avif";
                  }}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/35" />

                {/* Category badge */}
                <span className="absolute left-4 top-4 rounded-full bg-black/60 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm opacity-90 transition-opacity group-hover:opacity-100">
                  {item.category}
                </span>

                {/* View Overlay Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center opacity-0 transition-all duration-500 group-hover:opacity-100">
                  <span className="rounded-full bg-white/20 p-2.5 text-white backdrop-blur-md mb-2">
                    <Sparkles size={16} />
                  </span>
                  <span className="text-sm font-semibold uppercase tracking-[0.15em] text-white">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-white/70 mt-0.5">Click to view</span>
                </div>
              </button>
            ))}
          </div>

          {/* BOTTOM */}
          <div className="gallery-bottom mt-8 flex flex-col justify-between gap-4 border-t border-black/10 pt-6 sm:mt-10 sm:flex-row sm:items-center sm:pt-7">
            <p className="text-[9px] uppercase tracking-[0.2em] text-black/35 sm:text-[10px]">
              Showing {filteredItems.length} photos &bull; Click any image to explore
            </p>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#ff784e] sm:w-10" />
              <span className="text-[8px] font-semibold uppercase tracking-[0.25em] text-black/40 sm:text-[9px]">
                The Azura Collection
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* LIGHTBOX */}
      {activeIndex !== null && filteredItems[activeIndex] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md sm:p-8"
          onClick={() => setActiveIndex(null)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:border-[#ff784e] hover:bg-[#ff784e] sm:right-8 sm:top-8 sm:h-11 sm:w-11"
            aria-label="Close gallery"
          >
            <X size={20} />
          </button>

          {/* Prev button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((activeIndex - 1 + filteredItems.length) % filteredItems.length);
            }}
            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:border-[#ff784e] hover:bg-[#ff784e] sm:left-8 sm:h-12 sm:w-12"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Image & details */}
          <div className="relative max-h-[85vh] max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={filteredItems[activeIndex].image}
              alt={filteredItems[activeIndex].title}
              className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain shadow-2xl sm:max-h-[78vh]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/room1.avif";
              }}
            />
            <div className="mt-3 flex items-center justify-between gap-4 text-white sm:mt-5">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#ff784e]">
                  {filteredItems[activeIndex].category}
                </p>
                <h3 className="mt-1 text-base font-semibold sm:text-xl">
                  {filteredItems[activeIndex].title}
                </h3>
              </div>
              <span className="text-[11px] text-white/40 sm:text-xs">
                {String(activeIndex + 1).padStart(2, "0")} / {String(filteredItems.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Next button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((activeIndex + 1) % filteredItems.length);
            }}
            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:border-[#ff784e] hover:bg-[#ff784e] sm:right-8 sm:h-12 sm:w-12"
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </>
  );
}

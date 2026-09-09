"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";
import { getTestimonials, TestimonialItem } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

const fallbackTestimonials: TestimonialItem[] = [
  {
    id: 1,
    quote:
      "The Azura exceeded every expectation. The atmosphere was peaceful, the food was outstanding, and the staff made us feel genuinely welcome.",
    name: "Daniel Morgan",
    location: "New York, United States",
    stay: "Executive Room",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "A beautifully designed hotel with incredible attention to detail. Our weekend escape was exactly what we needed. We will definitely return.",
    name: "Emma Wilson",
    location: "Melbourne, Australia",
    stay: "Deluxe Suite",
    rating: 5,
  },
  {
    id: 3,
    quote:
      "An absolute masterclass in luxury hospitality. The butler service was immaculate, and the sunset views from the terrace are unmatched.",
    name: "Sofia Al-Mansoor",
    location: "Dubai, UAE",
    stay: "Presidential Suite",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<TestimonialItem[]>(fallbackTestimonials);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch dynamic testimonials
  useEffect(() => {
    let isMounted = true;
    getTestimonials().then((data) => {
      if (isMounted && data && data.length > 0) {
        setItems(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const active = items[activeIndex] || items[0] || fallbackTestimonials[0];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".testimonial-heading", {
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

      gsap.from(".testimonial-main", {
        y: 70,
        opacity: 0,
        duration: 1,
        delay: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const animateTo = useCallback(
    (index: number) => {
      if (index === activeIndex || !contentRef.current) {
        if (index !== activeIndex) setActiveIndex(index);
        return;
      }

      gsap.to(contentRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          setActiveIndex(index);
          gsap.fromTo(
            contentRef.current,
            { opacity: 0, y: -30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
          );
        },
      });
    },
    [activeIndex]
  );

  // Auto cycle testimonials
  useEffect(() => {
    if (isPaused || items.length <= 1) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev >= items.length - 1 ? 0 : prev + 1;
        if (contentRef.current) {
          gsap.to(contentRef.current, {
            opacity: 0,
            y: 30,
            duration: 0.35,
            ease: "power2.in",
            onComplete: () => {
              gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: -30 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
              );
            },
          });
        }
        return next;
      });
    }, 6000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, items.length]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#ff784e] pb-6 pt-8 text-black sm:pb-8 sm:pt-10 lg:pb-12 lg:pt-14"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Decorative elements */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-black/10 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-black/10 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-black/10 to-transparent" />

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10">

        {/* HEADER */}
        <div className="testimonial-heading mb-4 text-center sm:mb-6 lg:mb-8">
          <div className="mb-2 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-black/30 sm:w-12" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-black sm:text-[10px]">
              Guest Testimonials
            </span>
            <span className="h-px w-8 bg-black/30 sm:w-12" />
          </div>

          <h2 className="text-2xl font-light leading-[1] tracking-[-0.04em] text-black sm:text-3xl lg:text-5xl font-serif">
            What our guests
            <br />
            <span className="font-normal italic">say about us.</span>
          </h2>
        </div>

        {/* TESTIMONIAL */}
        <div className="testimonial-main relative">
          <div ref={contentRef} className="relative mx-auto max-w-4xl text-center">
            {/* Stars */}
            <div className="mb-3 flex justify-center gap-1 sm:mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  fill={i < (active.rating || 5) ? "#1a1a1a" : "none"}
                  className={i < (active.rating || 5) ? "text-[#1a1a1a]" : "text-black/30"}
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="relative rounded-2xl border-none bg-transparent p-3 sm:p-5 lg:p-6">
              <span className="absolute -left-2 -top-4 text-6xl font-serif leading-none text-black/15 sm:-left-3 sm:-top-6 sm:text-8xl">&ldquo;</span>
              <p className="absolute bottom-1 -right-4 text-5xl font-serif leading-none text-black/15 sm:-bottom-3 sm:-right-5 sm:text-6xl">&rdquo;</p>
              <span className="relative block text-[18px] font-light italic leading-[1.6] tracking-[-0.01em] text-black/80 sm:text-[22px] lg:text-[28px] lg:leading-[1.5]">
                {active.quote}
              </span>
            </blockquote>

            {/* Divider */}
            <div className="mx-auto my-3 flex items-center justify-center gap-3 sm:my-4">
              <span className="h-px w-8 bg-black/20 sm:w-12" />
              <span className="h-1.5 w-1.5 rotate-45 bg-black/40" />
              <span className="h-px w-8 bg-black/20 sm:w-12" />
            </div>

            {/* Guest details */}
            <div className="flex flex-col items-center">
              {active.avatar && (
                <div className="mb-2 h-12 w-12 overflow-hidden rounded-full border-2 border-black/20 shadow-md">
                  <img src={active.avatar} alt={active.name} className="h-full w-full object-cover" />
                </div>
              )}
              <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-black sm:text-sm">
                {active.name}
              </p>
              {active.location && (
                <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-black/60 sm:text-[10px]">
                  {active.location}
                </p>
              )}
              {active.stay && (
                <p className="mt-2 inline-block rounded-full border border-black/20 bg-black/5 px-3 py-0.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-black/70 sm:text-[9px]">
                  {active.stay}
                </p>
              )}
            </div>
          </div>

          {/* Dots */}
          {items.length > 1 && (
            <div className="mt-6 flex items-center justify-center sm:mt-8">
              <div className="flex items-center gap-2.5">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => animateTo(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === activeIndex
                        ? "w-8 bg-black shadow-md"
                        : "w-1.5 bg-black/20 hover:bg-black/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Progress bar */}
          {items.length > 1 && (
            <div className="mx-auto mt-3 max-w-[200px] sm:mt-4">
              <div className="h-0.5 w-full bg-black/10 overflow-hidden rounded-full">
                <div
                  className="h-full bg-black/60 transition-all duration-[6000ms] ease-linear"
                  style={{
                    width: isPaused
                      ? `${((activeIndex + 1) / items.length) * 100}%`
                      : "100%",
                  }}
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

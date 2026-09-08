"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    quote:
      "The Azura exceeded every expectation. The atmosphere was peaceful, the food was outstanding, and the staff made us feel genuinely welcome.",
    name: "Daniel Morgan",
    location: "New York, United States",
    stay: "Executive Room",
  },
  {
    id: 2,
    quote:
      "A beautifully designed hotel with incredible attention to detail. Our weekend escape was exactly what we needed. We will definitely return.",
    name: "Emma Wilson",
    location: "Melbourne, Australia",
    stay: "Deluxe Suite",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const active = testimonials[activeIndex];

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

  const nextTestimonial = useCallback(() => {
    animateTo(activeIndex === testimonials.length - 1 ? 0 : activeIndex + 1);
  }, [activeIndex, animateTo]);

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev === testimonials.length - 1 ? 0 : prev + 1;
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
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  return (
    <section
      ref={sectionRef}
        className="relative overflow-hidden bg-[#ff784e] pb-2 pt-3 text-black sm:pb-3 sm:pt-5 lg:pb-4 lg:pt-7"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Decorative elements */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-black/10 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-black/10 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-black/10 to-transparent" />

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10">

        {/* HEADER */}
        <div className="testimonial-heading mb-1 text-center sm:mb-2 lg:mb-3">
          <div className="mb-1 flex items-center justify-center gap-3 sm:mb-2">
            <span className="h-px w-8 bg-[#ff784e]/50 shadow-[0_0_6px_rgba(255,120,78,0.3)] sm:w-12" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-black sm:text-[10px]">
              Testimonials
            </span>
            <span className="h-px w-8 bg-[#ff784e]/50 shadow-[0_0_6px_rgba(255,120,78,0.3)] sm:w-12" />
          </div>

          <h2 className="text-xl font-light leading-[1] tracking-[-0.04em] text-black sm:text-3xl lg:text-4xl">
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
                  size={13}
                  fill="#ff784e"
                  className="text-[#ff784e] drop-shadow-[0_0_6px_rgba(255,120,78,0.6)] sm:size-[15px]"
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="relative rounded-2xl border-none bg-transparent p-3 sm:p-5 lg:p-8">
              <span className="absolute -left-2 -top-4 text-6xl font-serif leading-none text-black/15 sm:-left-3 sm:-top-6 sm:text-8xl">&ldquo;</span>
              <p className="absolute bottom-1 -right-4 text-5xl font-serif leading-none text-black/15 sm:-bottom-3 sm:-right-5 sm:text-6xl">&rdquo;</p>
              <span className="relative block text-[18px] font-light italic leading-[1.6] tracking-[-0.01em] text-black/70 sm:text-[22px] lg:text-[28px] lg:leading-[1.5]">
                {active.quote}
              </span>
            </blockquote>

            {/* Divider */}
          <div className="mx-auto my-2 flex items-center justify-center gap-3 sm:my-3">
              <span className="h-px w-6 bg-[#ff784e]/25 sm:w-10" />
              <span className="h-1 w-1 rotate-45 bg-[#ff784e]/50 shadow-[0_0_8px_rgba(255,120,78,0.4)]" />
              <span className="h-px w-6 bg-[#ff784e]/25 sm:w-10" />
            </div>

            {/* Guest */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-black sm:text-xs">
                {active.name}
              </p>
              <p className="mt-2 text-[9px] uppercase tracking-[0.22em] text-black/50 sm:text-[10px]">
                {active.location}
              </p>
              <p className="mt-1.5 inline-block rounded-full border border-[#ff784e]/30 bg-[#ff784e]/10 px-3 py-1 text-[7px] uppercase tracking-[0.2em] text-[#ff784e] sm:text-[8px]">
                {active.stay}
              </p>
            </div>
          </div>

          {/* Dots */}
          <div className="mt-3 flex items-center justify-center sm:mt-5 lg:mt-6">
            <div className="flex items-center gap-2.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => animateTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === activeIndex
                      ? "w-8 bg-[#ff784e] shadow-[0_0_10px_rgba(255,120,78,0.5)]"
                      : "w-1.5 bg-black/15 hover:bg-black/30"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mx-auto mt-2 max-w-[200px] sm:mt-3">
              <div className="h-px w-full bg-black/10">
              <div
                className="h-full bg-[#ff784e]/60 shadow-[0_0_8px_rgba(255,120,78,0.3)] transition-all duration-[5000ms] ease-linear"
                style={{
                  width: isPaused
                    ? `${((activeIndex + 1) / testimonials.length) * 100}%`
                    : "100%",
                }}
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

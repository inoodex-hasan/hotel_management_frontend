"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ExperienceBanner() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.from(".experience-bg", {
        scale: 1.12,
        duration: 1.5,
        ease: "power3.out",
      })
        .from(
          ".experience-label",
          {
            y: 25,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.9"
        )
        .from(
          ".experience-title",
          {
            y: 60,
            opacity: 0,
            duration: 0.9,
            ease: "power4.out",
          },
          "-=0.35"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-black"
    >
      {/* ================================================= */}
      {/* MAIN VISUAL */}
      {/* ================================================= */}

      <div className="relative min-h-[200px] sm:min-h-[300px] lg:min-h-[780px]">

        {/* Background Image */}

        <img
          src="/images/room2.avif"
          alt="Luxury hotel room"
          className="experience-bg absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark Overlay */}

        <div className="absolute inset-0 bg-black/35" />

        {/* Bottom Gradient */}

        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Orange Glow */}

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff784e]/10 blur-[120px]" />

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <div className="relative z-10 flex min-h-[200px] items-center justify-center px-5 py-10 sm:min-h-[300px] sm:px-8 lg:min-h-[780px] lg:py-24">

          <div className="mx-auto max-w-5xl text-center">

            {/* Label */}

            <div className="experience-label mb-7 flex items-center justify-center gap-4">

              <span className="h-px w-10 bg-[#ff784e]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#ff784e]">
                The Azura Experience
              </span>

              <span className="h-px w-10 bg-[#ff784e]" />

            </div>

            {/* Heading */}

            <h2 className="experience-title text-4xl font-light leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-[76px]">

              Where every stay
              <br />

              <span className="font-semibold">
                becomes a memory
              </span>
              <span className="text-[#ff784e]">.</span>

            </h2>

          </div>
        </div>
      </div>
    </section>
  );
}
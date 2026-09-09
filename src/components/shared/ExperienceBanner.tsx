"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { getSettings, HotelSettings } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

export default function ExperienceBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const [settings, setSettings] = useState<HotelSettings | null>(null);

  useEffect(() => {
    getSettings().then((data) => {
      if (data) setSettings(data);
    });
  }, []);

  const label = settings?.experience_label || "The Azura Experience";
  const title = settings?.experience_title || "Where every stay becomes a memory.";
  const subtitle = settings?.experience_subtitle;
  const image = settings?.experience_image || "/images/room2.avif";
  const videoUrl = settings?.experience_video_url;
  const buttonText = settings?.experience_button_text || "Explore Suites";
  const buttonLink = settings?.experience_button_link || "/rooms";

  // Split title if it contains line breaks or periods for styled rendering
  const titleParts = title.split("\n");

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
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power4.out",
          },
          "-=0.35"
        )
        .from(
          ".experience-subtitle",
          {
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .from(
          ".experience-cta",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [settings]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-black"
    >
      {/* ================================================= */}
      {/* MAIN VISUAL */}
      {/* ================================================= */}
      <div className="relative min-h-[380px] sm:min-h-[480px] lg:min-h-[720px] flex items-center justify-center">

        {/* Video or Background Image */}
        {videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={image}
            className="experience-bg absolute inset-0 h-full w-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={image}
            alt={title}
            className="experience-bg absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/room2.avif";
            }}
          />
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Bottom Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent" />

        {/* Top Gradient */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/40 to-transparent" />

        {/* Orange Center Glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff784e]/15 blur-[140px]" />

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}
        <div className="relative z-10 mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 lg:py-24">

          {/* Label */}
          <div className="experience-label mb-6 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-[#ff784e]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#ff784e]">
              {label}
            </span>
            <span className="h-px w-10 bg-[#ff784e]" />
          </div>

          {/* Heading */}
          <h2 className="experience-title text-4xl font-light leading-[1.08] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-[72px] font-serif">
            {titleParts.map((line, idx) => (
              <span key={idx} className="block">
                {line}
              </span>
            ))}
          </h2>

          {/* Subtitle if available */}
          {subtitle && (
            <p className="experience-subtitle mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              {subtitle}
            </p>
          )}

          {/* CTA Button */}
          {buttonText && buttonLink && (
            <div className="experience-cta mt-8 flex justify-center sm:mt-10">
              <Link
                href={buttonLink}
                className="group inline-flex items-center gap-3 bg-[#ff784e] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-white hover:text-black shadow-xl"
              >
                <span>{buttonText}</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
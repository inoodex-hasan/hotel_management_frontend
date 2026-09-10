"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Phone, Mail, Sparkles, Utensils, Waves } from "lucide-react";
import {
  getAboutContent,
  AboutContent,
  formatImageUrl,
  getSettings,
  HotelSettings,
  getFacilities,
  FacilityItem,
  getDiningVenues,
  DiningItem,
} from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [settings, setSettings] = useState<HotelSettings | null>(null);
  const [dining, setDining] = useState<DiningItem[]>([]);
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.allSettled([
      getAboutContent(),
      getSettings(),
      getDiningVenues(),
      getFacilities(),
    ]).then(([aboutRes, settingsRes, diningRes, facRes]) => {
      if (!isMounted) return;
      if (aboutRes.status === "fulfilled") setAbout(aboutRes.value);
      if (settingsRes.status === "fulfilled") setSettings(settingsRes.value);
      if (diningRes.status === "fulfilled") setDining(diningRes.value || []);
      if (facRes.status === "fulfilled") setFacilities(facRes.value || []);
      setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fade-up", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".fade-up",
          start: "top 85%",
          once: true,
        },
      });

      gsap.from(".slide-left", {
        x: -60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".slide-left",
          start: "top 80%",
          once: true,
        },
      });

      gsap.from(".slide-right", {
        x: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".slide-right",
          start: "top 80%",
          once: true,
        },
      });

      gsap.from(".stat-item", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".stats-section",
          start: "top 80%",
          once: true,
          onEnter: () => {
            document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
              const target = parseInt(el.dataset.count || "0", 10);
              const suffix = el.dataset.suffix || "";
              const obj = { val: 0 };
              gsap.to(obj, {
                val: target,
                duration: 2,
                ease: "power2.out",
                onUpdate: () => {
                  el.textContent = Math.round(obj.val) + suffix;
                },
              });
            });
          },
        },
      });
    }, pageRef);

    return () => ctx.revert();
  }, [about, dining, facilities]);

  const storyImg1 = formatImageUrl(about?.story_image_1 || about?.main_image || "");
  const storyImg2 = formatImageUrl(about?.story_image_2 || about?.sub_image || "");

  const topDining = dining[0] || null;
  const topFacility1 = facilities[0] || null;
  const topFacility2 = facilities[1] || null;

  return (
    <main ref={pageRef} className="bg-white text-black overflow-hidden">

      {/* =====================================================
          HERO / STORY
      ===================================================== */}
      <section className="relative min-h-[70vh] flex items-center bg-[#f7f4ef] overflow-hidden pt-[86px]">
        <div className="max-w-[1500px] mx-auto w-full px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Text */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[#ff784e] text-[11px] font-bold uppercase tracking-[0.3em]">
                  {about?.since_year || "About Us"}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-serif font-light leading-[1.05] text-[#1a1a1a]">
                {about?.story_title || about?.title || settings?.app_name || "About The Azura"}
              </h1>

              {(about?.story_subtitle || about?.subtitle || settings?.hotel_tagline) && (
                <p className="mt-4 text-base sm:text-lg text-[#ff784e]/80 font-serif italic">
                  {about?.story_subtitle || about?.subtitle || settings?.hotel_tagline}
                </p>
              )}

              <p className="mt-6 text-black/55 leading-8 max-w-xl text-[15px]">
                {about?.story_description || about?.description || settings?.hotel_tagline || "Welcome to The Azura Hotel & Resort. We deliver curated luxury experiences, refined hospitality, and contemporary comfort."}
              </p>

              <div className="mt-8 space-y-3">
                {settings?.contact_phone && (
                  <p className="flex items-center gap-3 text-sm text-black/60">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff784e] text-white text-[10px] font-bold">✓</span>
                    For information: {settings.contact_phone}
                  </p>
                )}
                {settings?.contact_email && (
                  <p className="flex items-center gap-3 text-sm text-black/60">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff784e] text-white text-[10px] font-bold">✓</span>
                    Email: {settings.contact_email}
                  </p>
                )}
                <p className="flex items-center gap-3 text-sm text-black/60">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff784e] text-white text-[10px] font-bold">✓</span>
                  Book Online for guaranteed best rates
                </p>
              </div>
            </div>

            {/* Images or Graphic */}
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px]">
              {storyImg1 ? (
                <div className="absolute top-0 right-0 w-[70%] h-[75%] rounded-sm overflow-hidden shadow-2xl">
                  <img
                    src={storyImg1}
                    alt={about?.title || "Hotel Story"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="absolute top-0 right-0 w-[70%] h-[75%] rounded-2xl bg-gradient-to-br from-[#1c1c1c] to-black shadow-2xl flex items-center justify-center p-8 text-center text-white">
                  <div>
                    <span className="text-[#ff784e] text-[11px] font-bold uppercase tracking-[0.3em]">Hospitality</span>
                    <h3 className="mt-2 text-2xl font-serif">{settings?.app_name || "The Azura"}</h3>
                  </div>
                </div>
              )}

              {storyImg2 ? (
                <div className="absolute bottom-0 left-0 w-[55%] h-[55%] rounded-sm overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src={storyImg2}
                    alt={about?.title || "Experience"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="absolute bottom-0 left-0 w-[55%] h-[55%] rounded-2xl bg-[#ff784e] shadow-2xl border-4 border-white flex items-center justify-center p-6 text-center text-white">
                  <p className="text-xs uppercase font-bold tracking-widest">{about?.since_year || "Est. Luxury"}</p>
                </div>
              )}
              {/* Decorative border frame */}
              <div className="absolute -top-3 -right-3 w-[65%] h-[70%] border border-[#ff784e]/30 rounded-sm pointer-events-none" />
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          DYNAMIC RESTAURANT SECTION
      ===================================================== */}
      {topDining && (
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-[1500px] mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-0 items-stretch">
              <div className="slide-left overflow-hidden">
                {topDining.image ? (
                  <img
                    src={topDining.image}
                    alt={topDining.name}
                    className="w-full h-[400px] sm:h-[500px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[400px] sm:h-[500px] bg-gradient-to-br from-black to-[#222] flex items-center justify-center text-white">
                    <Utensils size={40} className="text-[#ff784e]" />
                  </div>
                )}
              </div>

              <div className="slide-right bg-[#f7f4ef] flex items-center">
                <div className="px-8 py-12 sm:px-14 lg:px-20">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[#ff784e] text-[11px] font-bold uppercase tracking-[0.3em]">
                      {topDining.label || "Dining"}
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#1a1a1a]">
                    {topDining.name}
                  </h2>

                  <div className="mt-6 h-px w-16 bg-[#ff784e]/40" />

                  <p className="mt-6 text-black/55 leading-8 text-[15px] max-w-md">
                    {topDining.description}
                  </p>

                  <Link
                    href="/dining"
                    className="group mt-8 inline-flex items-center gap-3 bg-[#ff784e] text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#e86a3e] transition-all duration-300"
                  >
                    More Details
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          DYNAMIC FACILITIES HIGHLIGHT
      ===================================================== */}
      {topFacility1 && (
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-[1500px] mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-0 items-stretch">
              <div className="slide-left bg-[#f7f4ef] flex items-center order-2 lg:order-1">
                <div className="px-8 py-12 sm:px-14 lg:px-20">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[#ff784e] text-[11px] font-bold uppercase tracking-[0.3em]">
                      {topFacility1.subtitle || "Facility"}
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#1a1a1a]">
                    {topFacility1.title}
                  </h2>

                  <div className="mt-6 h-px w-16 bg-[#ff784e]/40" />

                  <p className="mt-6 text-black/55 leading-8 text-[15px] max-w-md">
                    {topFacility1.description}
                  </p>

                  <Link
                    href="/facilities"
                    className="group mt-8 inline-flex items-center gap-3 border border-[#ff784e] text-[#ff784e] px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#ff784e] hover:text-white transition-all duration-300"
                  >
                    Read More
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="slide-right overflow-hidden order-1 lg:order-2">
                {topFacility1.image ? (
                  <img
                    src={topFacility1.image}
                    alt={topFacility1.title}
                    className="w-full h-[400px] sm:h-[500px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[400px] sm:h-[500px] bg-gradient-to-br from-black to-[#222] flex items-center justify-center text-white">
                    <Waves size={40} className="text-[#ff784e]" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          DYNAMIC FACILITY 2 HIGHLIGHT
      ===================================================== */}
      {topFacility2 && (
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-[1500px] mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-0 items-stretch">
              <div className="slide-left overflow-hidden">
                {topFacility2.image ? (
                  <img
                    src={topFacility2.image}
                    alt={topFacility2.title}
                    className="w-full h-[400px] sm:h-[500px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[400px] sm:h-[500px] bg-gradient-to-br from-black to-[#222] flex items-center justify-center text-white">
                    <Sparkles size={40} className="text-[#ff784e]" />
                  </div>
                )}
              </div>

              <div className="slide-right bg-[#f7f4ef] flex items-center">
                <div className="px-8 py-12 sm:px-14 lg:px-20">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[#ff784e] text-[11px] font-bold uppercase tracking-[0.3em]">
                      {topFacility2.subtitle || "Amenity"}
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#1a1a1a]">
                    {topFacility2.title}
                  </h2>

                  <div className="mt-6 h-px w-16 bg-[#ff784e]/40" />

                  <p className="mt-6 text-black/55 leading-8 text-[15px] max-w-md">
                    {topFacility2.description}
                  </p>

                  <Link
                    href="/facilities"
                    className="group mt-8 inline-flex items-center gap-3 bg-[#ff784e] text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#e86a3e] transition-all duration-300"
                  >
                    Read More
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          STATS SECTION (Render only if stats available)
      ===================================================== */}
      {about?.stats && (
        <section className="stats-section py-20 lg:py-24 bg-[#f7f4ef]">
          <div className="max-w-[1500px] mx-auto px-6 lg:px-10">
            <div className="text-center mb-14">
              <span className="text-[#ff784e] text-[11px] font-bold uppercase tracking-[0.3em]">
                {about?.since_year || "Milestones"}
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#1a1a1a]">
                Experience &amp; Milestones
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {about.stats.years && (
                <div className="stat-item text-center">
                  <span data-count={parseInt(about.stats.years)} data-suffix={about.stats.years.includes("+") ? "+" : ""} className="text-5xl sm:text-6xl lg:text-7xl font-serif font-light text-[#ff784e]/30">0</span>
                  <span className="block mt-1 text-sm font-medium text-black/70">Years Of<br />Experience</span>
                </div>
              )}
              {about.stats.guests && (
                <div className="stat-item text-center">
                  <span data-count={parseInt(about.stats.guests)} data-suffix={about.stats.guests.includes("K") ? "K+" : "+"} className="text-5xl sm:text-6xl lg:text-7xl font-serif font-light text-[#ff784e]/30">0</span>
                  <span className="block mt-1 text-sm font-medium text-black/70">Happy<br />Guests</span>
                </div>
              )}
              {about.stats.rating && (
                <div className="stat-item text-center">
                  <span data-count={parseInt(about.stats.rating)} data-suffix="★" className="text-5xl sm:text-6xl lg:text-7xl font-serif font-light text-[#ff784e]/30">0</span>
                  <span className="block mt-1 text-sm font-medium text-black/70">Star Luxury<br />Rating</span>
                </div>
              )}
              {about.stats.rooms != null && (
                <div className="stat-item text-center">
                  <span data-count={about.stats.rooms} data-suffix="" className="text-5xl sm:text-6xl lg:text-7xl font-serif font-light text-[#ff784e]/30">0</span>
                  <span className="block mt-1 text-sm font-medium text-black/70">Luxury<br />Room Types</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}

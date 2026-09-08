"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Waves, Building2 } from "lucide-react";
import { getAboutContent, AboutContent, formatImageUrl } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [about, setAbout] = useState<AboutContent | null>(null);

  useEffect(() => {
    getAboutContent().then((data) => {
      if (data) setAbout(data);
    });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-img-main", {
        x: -80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      gsap.from(".about-img-sub", {
        x: 80,
        opacity: 0,
        duration: 1.2,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      gsap.from(".about-content", {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.3,
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

  const mainImg = formatImageUrl(about?.main_image || about?.main_image_url || "/images/room1.avif");
  const subImg = formatImageUrl(about?.sub_image || about?.sub_image_url || "/images/room2.avif");

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#121212] to-[#1c1008] py-16 sm:py-24 lg:py-32">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-[#ff784e]/8 to-transparent" />

      <div className="mx-auto max-w-[1500px] px-4 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16 xl:gap-20">

          {/* LEFT — Images */}
          <div className="relative w-full lg:w-1/2">
            <div className="relative">
              <div className="about-img-main overflow-hidden rounded-2xl">
                <img
                  src={mainImg}
                  alt={about?.title || "The Azura Hotel Exterior"}
                  className="h-[300px] w-full object-cover sm:h-[400px] lg:h-[480px]"
                />
              </div>

              <div className="about-img-sub absolute -bottom-6 -right-3 w-[55%] overflow-hidden rounded-2xl border-4 border-[#121212] shadow-xl sm:-bottom-8 sm:-right-5 lg:-bottom-10 lg:-right-6">
                <img
                  src={subImg}
                  alt={about?.title || "The Azura Hotel Interior"}
                  className="h-[160px] w-full object-cover sm:h-[200px] lg:h-[240px]"
                />
              </div>
            </div>
          </div>

          {/* RIGHT — Content */}
          <div className="about-content w-full lg:w-1/2">
            <div className="max-w-xl">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ff784e] sm:text-xs">
                {about?.eyebrow || "Welcome to"}
              </p>

              <div className="mb-4 flex items-center gap-3">
                <span className="h-[2px] w-10 bg-[#ff784e]" />
                <span className="h-[2px] w-5 bg-[#ff784e]/50" />
              </div>

              <h2 className="text-3xl font-light leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
                {about?.title ? (
                  about.title
                ) : (
                  <>The <span className="font-semibold">Azura</span> Hotel & Resort</>
                )}
              </h2>

              <h3 className="mt-3 text-base font-medium leading-snug text-white/80 sm:text-lg">
                {about?.subtitle || "A Luxury Beach View Hotel — A Perfect Combination Of Luxuriousness And Affordability."}
              </h3>

              <p className="mt-5 text-[13px] leading-7 text-white/50 sm:text-sm sm:leading-8">
                {about?.description || "Situated on the picturesque coastline, The Azura Hotel & Resort offers unmatched convenience and accessibility. Our hotel stands as a beacon of comfort and elegance. With well-appointed rooms, each featuring a private balcony with direct sea views — we promise an experience like no other. Our top-tier amenities, including a swimming pool, gym, complimentary buffet breakfast, and free Wi-Fi, are thoughtfully designed to enhance your stay."}
              </p>

              <div className="mt-8 flex flex-wrap gap-6 sm:gap-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ff784e]/20">
                    <Waves size={22} className="text-[#ff784e]" />
                  </span>
                  <div>
                    <p className="text-[12px] font-semibold text-white sm:text-[13px]">
                      {about?.feature_1_title || "Realistic Summer"}
                    </p>
                    <p className="text-[12px] font-semibold text-white sm:text-[13px]">
                      {about?.feature_1_subtitle || "Vacation"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ff784e]/20">
                    <Building2 size={22} className="text-[#ff784e]" />
                  </span>
                  <div>
                    <p className="text-[12px] font-semibold text-white sm:text-[13px]">
                      {about?.feature_2_title || "Luxury Standard"}
                    </p>
                    <p className="text-[12px] font-semibold text-white sm:text-[13px]">
                      {about?.feature_2_subtitle || "Hotel"}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href={about?.button_link || "/about"}
                className="group mt-8 inline-flex items-center gap-3 border border-[#ff784e] bg-[#ff784e] px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black sm:px-8 sm:py-4 sm:text-[11px]"
              >
                <span>{about?.button_text || "Discover More"}</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#ff784e] transition-all duration-300 group-hover:bg-black group-hover:text-white">
                  <ArrowUpRight size={14} />
                </span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

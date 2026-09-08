"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Waves,
  Utensils,
  Sparkles,
  Dumbbell,
  Car,
  Wifi,
  Calendar,
  Coffee,
  ShieldCheck,
} from "lucide-react";
import { getFacilities, FacilityItem } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  Waves,
  Utensils,
  Sparkles,
  Dumbbell,
  Car,
  Wifi,
  Calendar,
  Coffee,
  ShieldCheck,
};

const DEFAULT_FACILITIES: FacilityItem[] = [
  {
    id: 1,
    subtitle: "Relax & Refresh",
    title: "Infinity Pool",
    description:
      "Take a refreshing break and unwind beside our beautifully designed infinity pool. With stunning views and a serene atmosphere, it's the perfect place to soak up the sun and let your worries drift away.",
    image: "/images/facilities/pool.webp",
    icon: "Waves",
    features: ["Heated Pool", "Poolside Bar", "Sun Loungers", "Towel Service"],
  },
  {
    id: 2,
    subtitle: "Taste & Discover",
    title: "Fine Dining",
    description:
      "Enjoy carefully crafted dishes prepared with the freshest local ingredients. Our signature restaurant offers an international menu featuring everything from traditional delicacies to global cuisines.",
    image: "/images/facilities/dining.avif",
    icon: "Utensils",
    features: ["International Menu", "Private Dining", "Wine Collection", "Ocean View"],
  },
  {
    id: 3,
    subtitle: "Relax & Rejuvenate",
    title: "Spa & Wellness",
    description:
      "Restore your body and mind with our world-class wellness experience. Our authentic spa offers the perfect retreat — be it to heal, pamper, rejuvenate or revitalize, rest assured your desires will be met.",
    image: "/images/facilities/spa.avif",
    icon: "Sparkles",
    features: ["Couples Treatment", "Steam Room", "Sauna", "Hot Tub"],
  },
  {
    id: 4,
    subtitle: "Move & Energize",
    title: "Fitness Center",
    description:
      "Stay active with state-of-the-art equipment available throughout your stay. Our modern fitness center features everything you need to maintain your workout routine while enjoying your vacation.",
    image: "/images/facilities/gym.webp",
    icon: "Dumbbell",
    features: ["Modern Equipment", "Personal Trainers", "Yoga Studio", "24/7 Access"],
  },
  {
    id: 5,
    subtitle: "Easy & Convenient",
    title: "Private Parking",
    description:
      "Secure and convenient parking for a worry-free arrival. Our private parking area is monitored 24/7 to ensure your vehicle stays safe throughout your stay at The Azura.",
    image: "/images/facilities/parking.jpg",
    icon: "Car",
    features: ["24/7 Security", "CCTV Monitored", "Covered Parking", "Valet Service"],
  },
  {
    id: 6,
    subtitle: "Always Connected",
    title: "High-Speed Wi-Fi",
    description:
      "Stay connected with reliable high-speed Wi-Fi throughout the hotel. Whether for business or leisure, enjoy seamless internet access in every corner of The Azura.",
    image: "/images/facilities/wifi.avif",
    icon: "Wifi",
    features: ["Fiber Optic", "Room Service", "Business Center", "No Data Limits"],
  },
];

export default function FacilitiesPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [facilities, setFacilities] = useState<FacilityItem[]>(DEFAULT_FACILITIES);

  useEffect(() => {
    getFacilities()
      .then((data) => {
        if (data && data.length > 0) {
          setFacilities(data);
        }
      })
      .catch((err) => {
        console.warn("Failed to load facilities:", err);
      });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-text", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.utils.toArray<HTMLElement>(".fac-card").forEach((card, i) => {
        gsap.fromTo(card, { y: 60, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          delay: i * 0.2,
          scrollTrigger: { trigger: card, start: "top 92%", toggleActions: "play none none none" },
        });
      });

      gsap.utils.toArray<HTMLElement>(".fac-row").forEach((row) => {
        gsap.fromTo(row, { y: 50, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 92%", toggleActions: "play none none none" },
        });
      });

      gsap.utils.toArray<HTMLElement>(".marquee-track").forEach((track) => {
        gsap.fromTo(track, { x: 0 }, {
          x: "-50%",
          duration: 25,
          ease: "none",
          repeat: -1,
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, [facilities]);

  return (
    <main ref={pageRef} className="bg-white text-black overflow-hidden">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative min-h-[55vh] sm:min-h-[60vh] flex items-end overflow-hidden pt-[86px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/facilities/pool.webp')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

        <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 lg:px-10 pb-16 sm:pb-20 lg:pb-24">
          <div className="hero-text max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-px bg-[#ff784e]" />
              <span className="text-[#ff784e] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em]">
                Our Facilities
              </span>
              <span className="w-10 h-px bg-[#ff784e]" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[80px] font-serif font-light leading-[1.0] text-white">
              Experience{" "}
              <span className="italic text-[#ff784e]">Luxury</span>
              <br />
              Amenities
            </h1>

            <p className="mt-5 max-w-lg text-white/60 text-sm sm:text-[15px] leading-7">
              From relaxing spa treatments to exciting recreational activities,
              The Azura offers everything you need for an unforgettable stay.
            </p>

            <div className="flex items-center gap-3 mt-8 text-xs text-white/40">
              <Link href="/" className="hover:text-[#ff784e] transition">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#ff784e]">Facilities</span>
            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          MARQUEE STRIP
      ===================================================== */}
      <section className="bg-[#ff784e] py-3 overflow-hidden">
        <div className="marquee-track flex whitespace-nowrap gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="flex items-center gap-4 text-white text-xs font-bold uppercase tracking-[0.2em]">
              <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
              Infinity Pool
              <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
              Fine Dining
              <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
              Spa & Wellness
              <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
              Fitness Center
              <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
              Private Parking
              <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
              High-Speed Wi-Fi
              <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
            </span>
          ))}
        </div>
      </section>


      {/* =====================================================
          FEATURE CARDS — Grid
      ===================================================== */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <span className="text-[#ff784e] text-[11px] font-bold uppercase tracking-[0.3em]">
              What We Offer
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#1a1a1a]">
              Premium Facilities
            </h2>
            <div className="mt-4 mx-auto h-px w-16 bg-[#ff784e]/40" />
          </div>

          <div className="fac-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((item) => {
              const Icon = iconMap[item.icon] || Sparkles;
              return (
                <div
                  key={item.title}
                  className="fac-card group relative overflow-hidden bg-[#f7f4ef] cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-[260px] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* Icon badge */}
                    <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center bg-[#ff784e] text-white">
                      <Icon size={18} />
                    </div>

                  </div>

                  {/* Content */}
                  <div className="p-6 lg:p-8">
                    <span className="text-[#ff784e] text-[10px] font-bold uppercase tracking-[0.25em]">
                      {item.subtitle}
                    </span>

                    <h3 className="mt-2 text-xl sm:text-2xl font-serif font-light text-[#1a1a1a]">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-black/50 text-[13px] leading-6 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Features list */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.features.map((f) => (
                        <span
                          key={f}
                          className="px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-[#ff784e] bg-[#ff784e]/8 border border-[#ff784e]/15"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* =====================================================
          DETAILED SECTIONS — Alternating
      ===================================================== */}
      {facilities.slice(0, 3).map((item, i) => {
        const isReversed = i % 2 !== 0;
        const Icon = iconMap[item.icon] || Sparkles;
        return (
          <section key={item.title} className="py-16 lg:py-24 bg-white">
            <div className="max-w-[1500px] mx-auto px-6 lg:px-10">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-0 items-stretch">

                {/* Image */}
                <div
                  className={`overflow-hidden relative ${
                    isReversed ? "order-2" : "order-1"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-[350px] sm:h-[420px] lg:h-[500px] object-cover"
                  />
                  {/* Number overlay */}
                  <div className="absolute bottom-6 left-6 flex h-14 w-14 items-center justify-center bg-[#ff784e] text-white font-serif text-xl font-light">
                    0{i + 1}
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`bg-[#f7f4ef] flex items-center ${
                    isReversed ? "order-1" : "order-2"
                  }`}
                >
                  <div className="px-8 py-12 sm:px-14 lg:px-20">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon size={18} className="text-[#ff784e]" />
                      <span className="text-[#ff784e] text-[10px] font-bold uppercase tracking-[0.3em]">
                        {item.subtitle}
                      </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-light text-[#1a1a1a] leading-tight">
                      {item.title}
                    </h2>

                    <div className="mt-5 h-px w-12 bg-[#ff784e]/50" />

                    <p className="mt-6 text-black/50 leading-8 text-[15px] max-w-md">
                      {item.description}
                    </p>

                    {/* Features */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      {item.features.map((f) => (
                        <div key={f} className="flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-[#ff784e]" />
                          <span className="text-xs text-black/60 font-medium">
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        );
      })}


      {/* CTA SECTION */}
      <section className="relative py-20 lg:py-28 bg-[#1a1a1a] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#1e1e1e] to-[#1a1a1a]" />
        <div className="absolute top-8 left-8 h-16 w-16 border-t border-l border-[#ff784e]/20" />
        <div className="absolute bottom-8 right-8 h-16 w-16 border-b border-r border-[#ff784e]/20" />
        <div className="relative z-10 max-w-[1500px] mx-auto px-6 lg:px-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#ff784e]/40" />
            <span className="text-[#ff784e] text-[10px] font-bold uppercase tracking-[0.3em]">Ready to Experience?</span>
            <span className="h-px w-8 bg-[#ff784e]/40" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-white leading-tight">
            Book Your Stay <span className="italic text-[#ff784e]">Today</span>
          </h2>
          <p className="mt-5 max-w-lg mx-auto text-white/50 text-[15px] leading-7">
            Experience world-class amenities and exceptional hospitality at The Azura.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
           
            <a href="tel:+8801401777888" className="inline-flex items-center gap-3 border border-white/20 text-white px-10 py-5 text-xs font-bold uppercase tracking-[0.18em] hover:border-[#ff784e] hover:text-[#ff784e] transition-all duration-300">
              Call +880 1401 777 888
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}

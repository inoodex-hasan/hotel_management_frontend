"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Phone,
  Clock,
  MapPin,
  UtensilsCrossed,
} from "lucide-react";
import { getDiningVenues, DiningItem } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_RESTAURANTS: DiningItem[] = [
  {
    id: 1,
    slug: "the-restaurant",
    name: "The Restaurant",
    title: "Experience exquisite cuisine at The Restaurant",
    label: "BON APPÉTIT DURING VACATIONS AND TRIPS",
    description:
      "Our experienced chefs create international specialties with unique flavors. Relax with gourmet cuisine and signature cocktails, all enhanced by beautiful music and gorgeous views. From seasonal menus to dining experiences to satisfy any craving, see what our chefs are preparing for you.",
    image: "/images/dining/restaurant.avif",
    details: {
      location: "Lobby Level",
      serves: "Breakfast, Brunch, Lunch, Dinner, Dessert",
      phone: "+880 1401 777 888",
      hours: "7:00 AM - 10:00 PM",
    },
    features: ["International Menu", "Private Dining", "Wine Collection", "Ocean View"],
  },
  {
    id: 2,
    slug: "the-rooftop-restaurant-bar",
    name: "The Rooftop Restaurant & Bar",
    title: "The Rooftop Restaurant & Bar",
    label: "BON APPÉTIT DURING VACATIONS AND TRIPS",
    description:
      "Enjoy the stunning rooftop views from The Azura's Rooftop Bar. Relax with gourmet cuisine and signature cocktails or homemade tonics, all enhanced by beautiful music and gorgeous views. Perfect for evening cocktails and starlit dinners.",
    image: "/images/dining/hotel-experience.avif",
    details: {
      location: "Rooftop",
      serves: "Brunch, Lunch, Dinner, Wines",
      phone: "+880 1401 777 888",
      hours: "11:00 AM - Midnight",
    },
    features: ["Skyline Views", "Craft Cocktails", "Live Music", "Lounge Seating"],
  },
];

const menuCategories = [
  { name: "Breakfast", icon: "☀", time: "7:00 AM - 10:30 AM" },
  { name: "Lunch", icon: "🍽", time: "12:00 PM - 3:00 PM" },
  { name: "Dinner", icon: "🌙", time: "6:00 PM - 10:30 PM" },
  { name: "Room Service", icon: "🛎", time: "24 Hours" },
];

export default function DiningPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [restaurants, setRestaurants] = useState<DiningItem[]>(DEFAULT_RESTAURANTS);

  useEffect(() => {
    getDiningVenues()
      .then((data) => {
        if (data && data.length > 0) {
          setRestaurants(data);
        }
      })
      .catch((err) => {
        console.warn("Failed to load dining venues:", err);
      });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".dining-hero-text", { y: 50, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2 });

      gsap.utils.toArray<HTMLElement>(".restaurant-section").forEach((section) => {
        const img = section.querySelector(".rest-img");
        const content = section.querySelector(".rest-content");
        if (img) {
          gsap.fromTo(img, { x: -60, opacity: 0 }, {
            x: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none none" },
          });
        }
        if (content) {
          gsap.fromTo(content, { x: 60, opacity: 0 }, {
            x: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2,
            scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none none" },
          });
        }
      });

      gsap.utils.toArray<HTMLElement>(".menu-card").forEach((card, i) => {
        gsap.fromTo(card, { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
          delay: i * 0.1,
          scrollTrigger: { trigger: card, start: "top 92%", toggleActions: "play none none none" },
        });
      });
    }, pageRef);
    return () => ctx.revert();
  }, [restaurants]);

  return (
    <main ref={pageRef} className="bg-white text-[#1a1a1a] overflow-hidden">

      {/* HERO */}
      <section className="relative min-h-[70vh] lg:min-h-[85vh] flex items-center overflow-hidden pt-[86px]">
        <div className="absolute inset-0">
          <img src="/images/dining/restaurant.avif" alt="Dining" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
        </div>
        <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 lg:px-10 py-20 lg:py-0">
          <div className="dining-hero-text max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-[#ff784e]/40" />
              <span className="text-[#ff784e] text-[10px] font-bold uppercase tracking-[0.3em]">Dining & Culinary</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-serif font-light leading-[1.05] text-white">
              Dining <span className="italic text-[#ff784e]">Experience</span>
            </h1>
            <p className="mt-5 max-w-lg text-white/60 text-[15px] leading-[1.8]">
              Enjoy a various amount of dining options from around the world. From gourmet restaurants to relaxed rooftop bars, every meal becomes a memorable experience at The Azura.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/booking" className="group inline-flex items-center gap-3 bg-[#ff784e] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-white hover:bg-white hover:text-[#1a1a1a] transition-all duration-300">
                Reserve a Table <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <a href="tel:+8801401777888" className="inline-flex items-center gap-3 border border-white/25 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-white hover:border-[#ff784e] hover:text-[#ff784e] transition-all duration-300">
                <Phone size={14} /> Call to Order
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MENU HOURS STRIP */}
      <section className="relative -mt-1 z-10 bg-[#f7f4ef] border-b border-black/5">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {menuCategories.map((cat) => (
              <div key={cat.name} className="menu-card group flex items-center gap-4 border-r border-black/[0.06] px-6 py-6 last:border-r-0 hover:bg-white/60 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center bg-[#ff784e]/10 text-lg rounded-lg shrink-0">
                  {cat.icon}
                </div>
                <div>
                  <span className="block text-[13px] font-semibold text-[#1a1a1a]">{cat.name}</span>
                  <span className="text-[11px] text-black/40">{cat.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESTAURANT SECTIONS */}
      {restaurants.map((rest, idx) => {
        const isReversed = idx % 2 === 1;
        const details = rest.details || {
          location: (rest as any).location || "Lobby Level",
          serves: (rest as any).serves || "International",
          phone: (rest as any).phone || "+880 1401 777 888",
          hours: (rest as any).hours || "7:00 AM - 10:00 PM",
        };
        const features = rest.features || [];

        return (
          <section key={rest.id || idx} className="restaurant-section py-20 lg:py-28 border-b border-black/[0.04] last:border-b-0">
            <div className={`max-w-[1500px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center`}>
              <div className={`rest-img overflow-hidden rounded-2xl ${isReversed ? "lg:order-2" : ""}`}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl group bg-black/5">
                  <img
                    src={rest.image || "/images/dining/restaurant.avif"}
                    alt={rest.title || rest.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/dining/restaurant.avif";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>
              <div className={`rest-content ${isReversed ? "lg:order-1" : ""}`}>
                <span className="text-[#ff784e] text-[10px] font-bold uppercase tracking-[0.25em]">{rest.label || "Dining Venue"}</span>
                <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[42px] font-serif font-light leading-[1.15] text-[#1a1a1a]">
                  {rest.title || rest.name}
                </h2>
                <p className="mt-5 text-black/50 text-[14px] leading-[1.8]">{rest.description}</p>

                <div className="mt-7 space-y-3">
                  {details.location && (
                    <div className="flex items-center gap-3 text-[13px]">
                      <MapPin size={15} className="text-[#ff784e] shrink-0" />
                      <span className="text-black/40">Location:</span>
                      <span className="text-[#1a1a1a] font-medium">{details.location}</span>
                    </div>
                  )}
                  {details.serves && (
                    <div className="flex items-center gap-3 text-[13px]">
                      <UtensilsCrossed size={15} className="text-[#ff784e] shrink-0" />
                      <span className="text-black/40">Serves:</span>
                      <span className="text-[#1a1a1a] font-medium">{details.serves}</span>
                    </div>
                  )}
                  {details.phone && (
                    <div className="flex items-center gap-3 text-[13px]">
                      <Phone size={15} className="text-[#ff784e] shrink-0" />
                      <span className="text-black/40">Phone:</span>
                      <span className="text-[#1a1a1a] font-medium">{details.phone}</span>
                    </div>
                  )}
                  {details.hours && (
                    <div className="flex items-center gap-3 text-[13px]">
                      <Clock size={15} className="text-[#ff784e] shrink-0" />
                      <span className="text-black/40">Hours:</span>
                      <span className="text-[#1a1a1a] font-medium">{details.hours}</span>
                    </div>
                  )}
                </div>

                {features.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {features.map((f) => (
                      <span key={f} className="px-3 py-1.5 text-[10px] font-medium text-[#ff784e] bg-[#ff784e]/[0.06] border border-[#ff784e]/10 rounded-full">
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}

      {/* IN-ROOM DINING */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/rooms/room-1.avif" alt="In-Room Dining" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
        </div>
        <div className="relative z-10 max-w-[1500px] mx-auto px-6 lg:px-10">
          <div className="max-w-xl">
            <span className="text-[#ff784e] text-[10px] font-bold uppercase tracking-[0.25em]">In-Room Dining</span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[46px] font-serif font-light leading-[1.1] text-white">
              Refuel on Your <span className="italic text-[#ff784e]">Own Schedule</span>
            </h2>
            <p className="mt-5 text-white/55 text-[15px] leading-[1.8]">
              Seasonal, locally fresh items delivered to your door. Enjoy gourmet meals in the comfort of your room with our 24-hour in-room dining service.
            </p>

            <div className="mt-7 space-y-3">
              <div className="flex items-center gap-3 text-[13px]">
                <UtensilsCrossed size={15} className="text-[#ff784e] shrink-0" />
                <span className="text-white/50">Serves:</span>
                <span className="text-white font-medium">Breakfast, Brunch, Lunch, Dinner, Dessert</span>
              </div>
              <div className="flex items-center gap-3 text-[13px]">
                <Phone size={15} className="text-[#ff784e] shrink-0" />
                <span className="text-white/50">Phone:</span>
                <span className="text-white font-medium">+880 1401 777 888</span>
              </div>
              <div className="flex items-center gap-3 text-[13px]">
                <Clock size={15} className="text-[#ff784e] shrink-0" />
                <span className="text-white/50">Hours:</span>
                <span className="text-white font-medium">24 Hours</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="tel:+8801401777888" className="group inline-flex items-center gap-3 bg-[#ff784e] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-white hover:bg-white hover:text-[#1a1a1a] transition-all duration-300">
                Order Now <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION + BOOKING SPLIT */}
      <section className="border-t border-black/5">
        <div className="grid lg:grid-cols-2">
          <div className="relative py-20 lg:py-24 overflow-hidden bg-[#fafafa]">
            <div className="relative z-10 px-6 lg:px-16">
              <span className="text-[#ff784e] text-[10px] font-bold uppercase tracking-[0.25em]">Our Location</span>
              <h3 className="mt-4 text-3xl lg:text-4xl font-serif font-light text-[#1a1a1a]">Getting Here</h3>
              <p className="mt-4 text-black/50 text-[13px] leading-relaxed max-w-sm">
                Cox&apos;s Bazar, Bangladesh<br />
                Near Labonee Beach, Kolatoli Road
              </p>
              <div className="mt-3 space-y-1.5">
                <p className="text-black/40 text-[12px]">Tel: +880 1401 777 888</p>
                <p className="text-black/40 text-[12px]">Email: info@theazura.com</p>
              </div>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-3 border border-black/10 px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#1a1a1a] hover:border-[#ff784e] hover:text-[#ff784e] transition-all duration-300">
                Get Directions <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          <div className="relative py-20 lg:py-24 overflow-hidden border-t border-black/5 lg:border-t-0 lg:border-l lg:border-black/5 bg-[#ff784e]">
            <div className="relative z-10 px-6 lg:px-16">
              <span className="text-[#ff784e] text-[10px] font-bold uppercase tracking-[0.25em]">Book a Table</span>
              <h3 className="mt-4 text-3xl lg:text-4xl font-serif font-light text-[#1a1a1a]">Spend Your Time With Us</h3>
              <p className="mt-4 text-black/50 text-[13px] leading-relaxed max-w-sm">
                Everything at The Azura, in its restaurants, bar and spa is designed to make your stay, lunch or dinner unforgettable.
              </p>
              <div className="mt-3 space-y-1.5">
                <p className="text-black/40 text-[12px]">Tel: +880 1401 777 888</p>
                <p className="text-black/40 text-[12px]">Email: reservation@theazura.com</p>
              </div>
              <Link href="/booking" className="mt-7 inline-flex items-center gap-3 border border-black/10 px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#1a1a1a] hover:border-black hover:text-white transition-all duration-300">
                Reserve Your Stay <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      {/* <section className="py-20 lg:py-24 border-t border-black/5 bg-white">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="text-[#ff784e] text-[10px] font-bold uppercase tracking-[0.25em]">Stay Tuned with The Azura</span>
            <h3 className="mt-4 text-3xl sm:text-4xl font-serif font-light text-[#1a1a1a] leading-tight">
              Sign up for our newsletter to receive our news, deals and special offers.
            </h3>
          </div>
          <div>
            <div className="flex items-center gap-0 border-b border-black/15">
              <input type="email" placeholder="Your Email Address" className="flex-1 bg-transparent py-4 text-[14px] text-[#1a1a1a] outline-none placeholder:text-black/30" />
              <button type="button" className="flex items-center gap-2 px-2 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[#ff784e] hover:text-[#1a1a1a] transition-colors">
                Subscribe <ChevronRight size={16} />
              </button>
            </div>
            <label className="mt-4 flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="h-3.5 w-3.5 accent-[#ff784e]" />
              <span className="text-[12px] text-black/40">I agree to the Privacy Policy</span>
            </label>
          </div>
        </div>
      </section> */}

    </main>
  );
}

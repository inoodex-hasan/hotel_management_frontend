"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  MapPin,
  Phone,
  Mail,
  ArrowUp,
  Check,
} from "lucide-react";
import { subscribeNewsletter, getSettings, HotelSettings } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

const footerLinks = {
  explore: [
    { name: "Home", href: "/" },
    { name: "Rooms & Suites", href: "/rooms" },
    { name: "Facilities", href: "/facilities" },
    { name: "Dining", href: "/dining" },
  ],
  hotel: [
    { name: "About Us", href: "/about" },
    { name: "Gallery", href: "/#gallery" },
    { name: "Contact", href: "/contact" },
    { name: "Book Now", href: "/booking" },
  ],
};

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "submitting" | "subscribed">("idle");
  const [settings, setSettings] = useState<HotelSettings>({
    app_name: "The Azura",
    hotel_tagline: "A place where thoughtful design, genuine hospitality and unforgettable experiences come together.",
    contact_email: "reservation.theazura@gmail.com",
    contact_phone: "+880 1401 777 888",
    address: "Marine Drive Road, Cox's Bazar, Bangladesh",
    facebook_url: "https://facebook.com",
    instagram_url: "https://instagram.com",
    twitter_url: "https://twitter.com",
    youtube_url: "https://youtube.com",
  });

  useEffect(() => {
    getSettings().then((res) => {
      if (res) setSettings(res);
    });
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || newsletterStatus === "submitting") return;
    setNewsletterStatus("submitting");
    try {
      await subscribeNewsletter(newsletterEmail);
      setNewsletterStatus("subscribed");
      setNewsletterEmail("");
    } catch {
      setNewsletterStatus("subscribed");
      setNewsletterEmail("");
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".footer-reveal").forEach((el) => {
        gsap.fromTo(el, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 95%", toggleActions: "play none none none" },
        });
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-black text-white"
    >
      {/* ===================================================== */}
      {/* MAIN FOOTER */}
      {/* ===================================================== */}

      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-10">

        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 sm:gap-14 sm:py-16 lg:grid-cols-[1.4fr_0.7fr_0.7fr_1fr] lg:gap-12 lg:py-20">

          {/* ================================================= */}
          {/* BRAND */}
          {/* ================================================= */}

          <div className="footer-reveal">

            <Link
              href="/"
              className="inline-block"
            >

              <h3 className="text-3xl font-light tracking-[0.12em] text-white">
                THE
                <span className="ml-2 font-semibold">
                  AZURA
                </span>
              </h3>

              <div className="mt-2 flex items-center gap-3">

                <span className="h-px w-7 bg-[#ff784e]" />

                <span className="text-[8px] uppercase tracking-[0.35em] text-white/40">
                  Boutique Hotel & Resort
                </span>

                <span className="h-px w-7 bg-[#ff784e]" />

              </div>

            </Link>

            <p className="mt-7 max-w-sm text-sm leading-7 text-white/40">
              {settings.hotel_tagline}
            </p>

            {/* Social */}

            <div className="mt-7 flex items-center gap-3">

              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center border border-white/10 text-white/50 transition-all duration-300 hover:border-[#ff784e] hover:bg-[#ff784e] hover:text-white"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              )}

              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center border border-white/10 text-white/50 transition-all duration-300 hover:border-[#ff784e] hover:bg-[#ff784e] hover:text-white"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}

              {settings.twitter_url && (
                <a
                  href={settings.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="flex h-10 w-10 items-center justify-center border border-white/10 text-white/50 transition-all duration-300 hover:border-[#ff784e] hover:bg-[#ff784e] hover:text-white"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              )}

            </div>

          </div>

          {/* ================================================= */}
          {/* EXPLORE */}
          {/* ================================================= */}

          <div className="footer-reveal">

            <h4 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#ff784e]">
              Explore
            </h4>

            <ul className="mt-6 space-y-4">

              {footerLinks.explore.map((link) => (
                <li key={link.name}>

                  <Link
                    href={link.href}
                    className="group flex w-fit items-center gap-2 text-sm text-white/50 visited:text-white/50 no-underline transition-colors duration-150 hover:text-white"
                  >
                    <span className="h-px w-0 bg-[#ff784e] transition-all duration-150 group-hover:w-4" />

                    {link.name}
                  </Link>

                </li>
              ))}

            </ul>

          </div>

          {/* ================================================= */}
          {/* HOTEL */}
          {/* ================================================= */}

          <div className="footer-reveal">

            <h4 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#ff784e]">
              The Hotel
            </h4>

            <ul className="mt-6 space-y-4">

              {footerLinks.hotel.map((link) => (
                <li key={link.name}>

                  <Link
                    href={link.href}
                    className="group flex w-fit items-center gap-2 text-sm text-white/50 visited:text-white/50 no-underline transition-colors duration-150 hover:text-white"
                  >
                    <span className="h-px w-0 bg-[#ff784e] transition-all duration-150 group-hover:w-4" />

                    {link.name}
                  </Link>

                </li>
              ))}

            </ul>

          </div>

          {/* ================================================= */}
          {/* CONTACT */}
          {/* ================================================= */}

          <div className="footer-reveal">

            <h4 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#ff784e]">
              Get In Touch
            </h4>

            <div className="mt-6 space-y-5">

              {/* Address */}

              <div className="flex gap-4">

                <MapPin
                  size={18}
                  strokeWidth={1.4}
                  className="mt-1 shrink-0 text-[#ff784e]"
                />

                <p className="text-sm leading-6 text-white/50">
                  {settings.address}
                </p>

              </div>

              {/* Phone */}

              <a
                href={`tel:${settings.contact_phone.replace(/\s+/g, "")}`}
                className="flex gap-4 text-sm text-white/50 visited:text-white/50 no-underline transition-colors duration-150 hover:text-white"
              >

                <Phone
                  size={17}
                  strokeWidth={1.4}
                  className="shrink-0 text-[#ff784e]"
                />

                {settings.contact_phone}

              </a>

              {/* Email */}

              <a
                href={`mailto:${settings.contact_email}`}
                className="flex gap-4 text-sm text-white/50 visited:text-white/50 no-underline transition-colors duration-150 hover:text-white"
              >

                <Mail
                  size={17}
                  strokeWidth={1.4}
                  className="shrink-0 text-[#ff784e]"
                />

                {settings.contact_email}

              </a>

            </div>

          </div>

        </div>

        {/* ===================================================== */}
        {/* NEWSLETTER */}
        {/* ===================================================== */}

        <div className="footer-reveal border-y border-white/10 py-5 sm:py-8">

          <div className="flex flex-col justify-between gap-4 sm:gap-6 lg:flex-row lg:items-center">

            <div>

              <p className="text-xs font-medium text-white sm:text-sm">
                Stay in the know.
              </p>

              <p className="mt-0.5 text-[10px] text-white/35 sm:mt-1 sm:text-xs">
                Receive our latest offers and hotel updates.
              </p>

            </div>

            <form onSubmit={handleNewsletterSubmit} className="flex w-full flex-row sm:max-w-md">

              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={newsletterStatus === "subscribed" ? "Thank you for subscribing!" : "Your email address"}
                className="min-w-0 flex-1 border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-white outline-none placeholder:text-white/25 focus:border-[#ff784e] sm:px-5 sm:py-3.5 sm:text-sm"
              />

              <button
                type="submit"
                disabled={newsletterStatus === "submitting"}
                className="flex shrink-0 items-center gap-1 bg-[#ff784e] px-2.5 py-2.5 text-[7px] font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-white hover:text-black sm:gap-2 sm:px-5 sm:py-3.5 sm:text-[9px] disabled:opacity-50"
              >
                {newsletterStatus === "subscribed" ? "Subscribed!" : "Subscribe"}
                {newsletterStatus === "subscribed" ? <Check size={10} className="sm:size-[14px] text-green-300" /> : <ArrowUpRight size={10} className="sm:size-[14px]" />}
              </button>

            </form>

          </div>

        </div>

        {/* ===================================================== */}
        {/* BOTTOM */}
        {/* ===================================================== */}

        <div className="flex flex-col justify-between gap-5 py-7 sm:flex-row sm:items-center">

          <p className="text-[9px] uppercase tracking-[0.16em] text-white/25">
            © {new Date().getFullYear()} {settings.app_name}. All rights reserved.
          </p>

          <div className="flex items-center gap-6">

            {/* Back To Top */}

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/50 transition-all duration-300 hover:border-[#ff784e] hover:bg-[#ff784e] hover:text-white"
            >
              <ArrowUp size={15} />
            </button>

          </div>

        </div>

      </div>
    </footer>
  );
}
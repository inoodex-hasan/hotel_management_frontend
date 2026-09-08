"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MapPin,
  Phone,
  Mail,
  Clock3,
  ArrowRight,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { submitContactMessage, getSettings, HotelSettings } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await submitContactMessage({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Contact message submit error", err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.from(".hero-item", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
      });

      // Information cards
      gsap.from(".info-card", {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".info-section",
          start: "top 80%",
          once: true,
        },
      });

      // Contact section
      gsap.from(".contact-copy", {
        x: -50,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".message-section",
          start: "top 80%",
          once: true,
        },
      });

      gsap.from(".contact-form", {
        x: 50,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".message-section",
          start: "top 80%",
          once: true,
        },
      });

      // Map
      gsap.from(".map-card", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".map-section",
          start: "top 85%",
          once: true,
        },
      });

      // CTA
      gsap.from(".cta-content", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 85%",
          once: true,
        },
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={pageRef}
      className="min-h-screen bg-white text-black"
    >
      {/* HERO */}
      <section className="relative min-h-[650px] overflow-hidden bg-black pt-[86px] lg:min-h-[720px]">
        {/* Background */}
        <img
          src="/images/contact/hero.jpg"
          alt={settings.app_name}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/75" />

        {/* HERO CONTENT */}
        <div className="relative z-10 mx-auto flex min-h-[550px] max-w-[1500px] items-center px-5 pb-16 pt-24 sm:px-8 lg:min-h-[580px] lg:px-10">
          <div className="max-w-[680px]">
            <div className="hero-item mb-5 flex items-center gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#F7580F]">
                Contact Us
              </span>
              <span className="h-px w-9 bg-[#F7580F]" />
            </div>

            <h1 className="hero-item font-serif text-6xl font-light leading-[0.94] tracking-[-0.045em] text-white sm:text-7xl lg:text-[88px]">
              We&apos;d love to
              <br />
              hear from you
              <span className="text-[#F7580F]">.</span>
            </h1>

            <p className="hero-item mt-7 max-w-[560px] text-sm leading-7 text-white/70 sm:text-[15px]">
              Whether you are planning your next stay, hosting
              an event, or simply have a question, our team is
              here to help.
            </p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="absolute bottom-7 left-5 z-10 sm:left-8 lg:left-10">
          <div className="flex items-center gap-3 text-[10px] text-white/70">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>›</span>
            <span className="text-[#F7580F]">
              Contact
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT INFORMATION
      ===================================================== */}
      <section className="info-section border-b border-black/10 bg-white">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

          {/* Location */}
          <div className="info-card group border-b border-black/10 p-8 sm:p-10 lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#F7580F] transition-all duration-300 group-hover:bg-[#F7580F] group-hover:text-white">
                <MapPin size={19} />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                  Our Location
                </p>
              </div>
            </div>

            <p className="mt-5 pl-16 text-sm leading-6 text-black/55 whitespace-pre-line">
              {settings.address}
            </p>

            <Link
              href="#map"
              className="mt-4 flex items-center gap-2 pl-16 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#F7580F]"
            >
              Get Directions
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Phone */}
          <div className="info-card group border-b border-black/10 p-8 sm:p-10 lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#F7580F] transition-all duration-300 group-hover:bg-[#F7580F] group-hover:text-white">
                <Phone size={18} />
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                Call Us
              </p>
            </div>

            <a
              href={`tel:${settings.contact_phone.replace(/\s+/g, "")}`}
              className="mt-5 block pl-16 text-sm text-black/60 transition-colors hover:text-[#F7580F]"
            >
              {settings.contact_phone}
            </a>

            <p className="mt-2 pl-16 text-xs text-[#F7580F]">
              Available 24/7
            </p>
          </div>

          {/* Email */}
          <div className="info-card group border-b border-black/10 p-8 sm:p-10 md:border-r lg:border-b-0">
            <div className="flex items-center gap-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#F7580F] transition-all duration-300 group-hover:bg-[#F7580F] group-hover:text-white">
                <Mail size={18} />
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                Email Us
              </p>
            </div>

            <a
              href={`mailto:${settings.contact_email}`}
              className="mt-5 block pl-16 text-sm text-black/60 transition-colors hover:text-[#F7580F]"
            >
              {settings.contact_email}
            </a>

            <p className="mt-2 pl-16 text-xs text-[#F7580F]">
              We reply within 24 hours
            </p>
          </div>

          {/* Front Desk */}
          <div className="info-card group p-8 sm:p-10">
            <div className="flex items-center gap-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#F7580F] transition-all duration-300 group-hover:bg-[#F7580F] group-hover:text-white">
                <Clock3 size={18} />
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                Front Desk
              </p>
            </div>

            <p className="mt-5 pl-16 text-sm leading-6 text-black/60">
              Monday — Sunday
              <br />
              Open 24 Hours
            </p>

            <p className="mt-2 pl-16 text-xs text-[#F7580F]">
              Always here for you
            </p>
          </div>

        </div>
      </section>

      {/* =====================================================
          MESSAGE SECTION
      ===================================================== */}
      <section className="message-section relative overflow-hidden bg-white py-24 sm:py-28 lg:py-32">
        {/* Decorative line */}
        <div className="absolute bottom-0 left-0 h-[300px] w-[180px] opacity-[0.08]">
          <div className="h-full w-full rounded-tr-[100%] border-t border-r border-[#F7580F]" />
        </div>

        <div className="mx-auto grid max-w-[1380px] grid-cols-1 gap-16 px-5 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24 lg:px-10">
          {/* LEFT */}
          <div className="contact-copy">
            <div className="mb-7 flex items-center gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#F7580F]">
                Send A Message
              </span>
              <span className="h-px w-8 bg-[#F7580F]" />
            </div>

            <h2 className="font-serif text-5xl font-light leading-[1.02] tracking-[-0.04em] sm:text-6xl">
              Let&apos;s start a
              <br />
              conversation
              <span className="text-[#F7580F]">.</span>
            </h2>

            <p className="mt-7 max-w-[330px] text-sm leading-7 text-black/50">
              Have a special request or need help planning
              your stay? Send us a message and our team will
              get back to you shortly.
            </p>

            {/* Social */}
            <div className="mt-10 space-y-4">
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-fit items-center gap-4 text-xs text-black/60 transition-colors hover:text-[#F7580F]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </span>
                  Instagram
                </a>
              )}

              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-fit items-center gap-4 text-xs text-black/60 transition-colors hover:text-[#F7580F]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </span>
                  Facebook
                </a>
              )}
            </div>
          </div>

          {/* FORM */}
          {submitted ? (
            <div className="contact-form bg-[#f9f9f9] border border-black/10 p-8 sm:p-12 rounded-xl text-center">
              <div className="flex h-16 w-16 items-center justify-center bg-green-50 rounded-full mx-auto mb-4">
                <Check size={32} className="text-green-500" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-serif font-light text-[#1a1a1a]">Message Sent Successfully!</h3>
              <p className="mt-3 text-sm text-black/60 max-w-md mx-auto leading-relaxed">
                Thank you for contacting {settings.app_name}. Our concierge team has received your message and will get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
                }}
                className="mt-6 inline-flex items-center gap-2 bg-[#F7580F] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-white hover:bg-black transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form
              className="contact-form"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 gap-x-7 gap-y-6 sm:grid-cols-2">
                {/* First Name */}
                <div>
                  <label className="mb-3 block text-[12px] font-medium">
                    First Name <span className="text-[#F7580F]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                    placeholder="First Name"
                    className="h-12 w-full border border-black/15 bg-white px-4 text-sm outline-none transition-colors placeholder:text-black/25 focus:border-[#F7580F]"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="mb-3 block text-[12px] font-medium">
                    Last Name <span className="text-[#F7580F]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
                    placeholder="Last Name"
                    className="h-12 w-full border border-black/15 bg-white px-4 text-sm outline-none transition-colors placeholder:text-black/25 focus:border-[#F7580F]"
                  />
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <label className="mb-3 block text-[12px] font-medium">
                    Email Address{" "}
                    <span className="text-[#F7580F]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="Your email address"
                    className="h-12 w-full border border-black/15 bg-white px-4 text-sm outline-none transition-colors placeholder:text-black/25 focus:border-[#F7580F]"
                  />
                </div>

                {/* Phone */}
                <div className="sm:col-span-2">
                  <label className="mb-3 w-full block text-[12px] font-medium">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="Your phone number"
                    className="h-12 w-full border border-black/15 bg-white px-4 text-sm outline-none transition-colors placeholder:text-black/25 focus:border-[#F7580F]"
                  />
                </div>

                {/* Message */}
                <div className="sm:col-span-2">
                  <label className="mb-3 block text-[12px] font-medium">
                    Your Message{" "}
                    <span className="text-[#F7580F]">*</span>
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                    placeholder="Write your message here..."
                    className="w-full resize-none border border-black/15 bg-white px-4 py-4 text-sm outline-none transition-colors placeholder:text-black/25 focus:border-[#F7580F]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group mt-7 inline-flex items-center gap-5 bg-[#F7580F] px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-white hover:text-black disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Submit Message"}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight size={16} />
                </span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* =====================================================
          MAP
      ===================================================== */}
      <section
        id="map"
        className="map-section relative h-[500px] overflow-hidden bg-[#ff784e] sm:h-[560px]"
      >
        {/* Map background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(30deg,transparent_48%,rgba(0,0,0,0.06)_49%,rgba(0,0,0,0.06)_51%,transparent_52%),linear-gradient(120deg,transparent_48%,rgba(0,0,0,0.05)_49%,rgba(0,0,0,0.05)_51%,transparent_52%)] bg-[size:110px_90px]" />
          <div className="absolute left-[10%] top-[20%] h-1/2 w-[18%] rotate-12 rounded-full bg-[#d6e6e8]" />
          <div className="absolute right-[8%] top-[10%] h-[70%] w-[30%] -rotate-12 rounded-full bg-[#dce8dc]" />
        </div>

        {/* Roads */}
        <div className="absolute left-0 top-[48%] h-3 w-full rotate-[-8deg] bg-white/90" />
        <div className="absolute left-[20%] top-0 h-full w-2 rotate-[18deg] bg-white/90" />
        <div className="absolute right-[25%] top-0 h-full w-3 rotate-[30deg] bg-white/90" />

        {/* Center marker */}
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#F7580F] text-white shadow-2xl shadow-black/20">
            <MapPin size={27} />
            <span className="absolute inset-[-12px] rounded-full border border-[#F7580F]/30" />
          </div>
        </div>

        {/* Map info card */}
        <div className="map-card absolute bottom-7 left-5 z-20 w-[290px] bg-black p-7 text-white shadow-2xl sm:bottom-10 sm:left-10">
          <div className="mb-5">
            <MapPin
              size={25}
              className="text-[#F7580F]"
            />
          </div>

          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#F7580F]">
            {settings.app_name}
          </p>

          <p className="mt-3 text-sm leading-6 text-white/70 whitespace-pre-line">
            {settings.address}
          </p>

          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-3 border border-white/30 px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.15em] transition-colors hover:border-[#F7580F] hover:bg-[#F7580F]"
          >
            Open In Google Maps
            <ArrowUpRight size={13} />
          </a>
        </div>

        {/* Zoom */}
        <div className="absolute bottom-8 right-5 z-20 flex flex-col bg-white shadow-md sm:right-10">
          <button className="flex h-10 w-10 items-center justify-center text-xl text-black/60 hover:bg-black hover:text-white">
            +
          </button>
          <div className="h-px bg-black/10" />
          <button className="flex h-10 w-10 items-center justify-center text-xl text-black/60 hover:bg-black hover:text-white">
            −
          </button>
        </div>
      </section>

      {/* BOOKING CTA */}
      <section className="cta-section relative py-20 lg:py-28 bg-[#1a1a1a] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#1e1e1e] to-[#1a1a1a]" />
        <div className="absolute top-8 left-8 h-16 w-16 border-t border-l border-[#ff784e]/20" />
        <div className="absolute bottom-8 right-8 h-16 w-16 border-b border-r border-[#ff784e]/20" />
        <div className="cta-content relative z-10 max-w-[1500px] mx-auto px-6 lg:px-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#ff784e]/40" />
            <span className="text-[#ff784e] text-[10px] font-bold uppercase tracking-[0.3em]">Ready to Book?</span>
            <span className="h-px w-8 bg-[#ff784e]/40" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-white leading-tight">
            Experience <span className="italic text-[#ff784e]">{settings.app_name}</span> Today
          </h2>
          <p className="mt-5 max-w-lg mx-auto text-white/50 text-[15px] leading-7">
            Book your stay now and enjoy luxury at its finest. Special rates available for extended stays.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking" className="group inline-flex items-center gap-2 bg-[#ff784e] text-white px-10 py-5 text-xs font-bold uppercase tracking-[0.18em] hover:bg-white hover:text-[#1a1a1a] transition-all duration-300">
              Book Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href={`tel:${settings.contact_phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-3 border border-white/20 text-white px-10 py-5 text-xs font-bold uppercase tracking-[0.18em] hover:border-[#ff784e] hover:text-[#ff784e] transition-all duration-300">
              Call {settings.contact_phone}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

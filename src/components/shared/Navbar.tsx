"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  BedDouble,
  Search,
} from "lucide-react";
import { getRoomTypes, RoomType } from "@/lib/api";

interface NavRoomItem {
  name: string;
  href: string;
  image?: string;
  children?: {
    name: string;
    href: string;
  }[];
}

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Dining", href: "/dining" },
  { name: "Facilities", href: "/facilities" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [rooms, setRooms] = useState<NavRoomItem[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileRoomsOpen, setMobileRoomsOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getRoomTypes()
      .then((data: RoomType[]) => {
        if (isMounted && data && data.length > 0) {
          setRooms(
            data.map((r) => ({
              name: r.name,
              href: `/rooms/${r.slug}`,
              image: r.image,
            }))
          );
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch room types for Navbar:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileRoomsOpen(false);
    setMobileSubmenu(null);
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white">

      <nav className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">
          <div className="flex h-[80px] items-center justify-between sm:h-[80px] lg:h-[86px]">

            {/* LOGO */}
            <Link href="/" onClick={closeMobileMenu} className="group flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-black transition-all duration-500 group-hover:bg-[#ff784e] sm:h-11 sm:w-11">
                <BedDouble size={18} strokeWidth={1.5} className="relative z-10 text-white sm:size-[22px]" />
              </div>
              <div className="leading-none">
                <h1 className="text-[16px] font-bold tracking-[0.18em] text-black sm:text-[21px]">
                  THE<span className="ml-1 text-[#ff784e]">AZURA</span>
                </h1>
                <p className="mt-1 text-[7px] font-medium uppercase tracking-[0.34em] text-black/45 sm:mt-1.5 sm:text-[8px]">
                  Hotel & Resort
                </p>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden h-full items-center xl:flex lg:flex">
              <Link href="/" className="group relative flex h-full items-center px-3 xl:px-4 text-[11px] xl:text-[12px] font-semibold uppercase tracking-[0.06em] text-black transition-colors duration-300 hover:text-[#ff784e]">
                Home
                <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-[#ff784e] transition-all duration-300 group-hover:w-5" />
              </Link>
              
              {rooms.length > 0 ? (
                <div className="group relative h-full flex items-center gap-0.5 px-3 xl:px-4 cursor-pointer">
                  <span className="text-[11px] xl:text-[13px] font-semibold uppercase tracking-[0.06em] text-black transition-colors duration-300 group-hover:text-[#ff784e] whitespace-nowrap">
                    Rooms & Suites
                  </span>
                  <ChevronDown size={13} strokeWidth={1.8} className="text-black/50 transition-transform duration-300 group-hover:rotate-180 group-hover:text-[#ff784e]" />
                  {/* Invisible bridge between trigger and dropdown */}
                  <div className="absolute left-0 top-full h-2 w-full" />
                  <div className="pointer-events-none invisible absolute left-0 top-full z-50 w-[240px] translate-y-0 bg-black opacity-0 shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                    <div className="h-[3px] bg-[#ff784e]" />
                    {rooms.map((room) => (
                      <div key={room.name} className="group/room relative">
                        {room.children ? (
                          <>
                            <Link href={room.href} className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3 text-[11px] font-medium text-white transition-all duration-200 hover:bg-[#ff784e]">
                              <span>{room.name}</span>
                              <ChevronRight size={13} strokeWidth={1.7} className="text-white/50 transition-all duration-200 group-hover/room:translate-x-1 group-hover/room:text-white" />
                            </Link>
                            <div className="pointer-events-none invisible absolute left-full top-0 z-50 w-[230px] bg-black opacity-0 shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover/room:pointer-events-auto group-hover/room:visible group-hover/room:opacity-100">
                              <div className="h-[3px] bg-[#ff784e]" />
                              {room.children.map((child) => (
                                <Link key={child.name} href={child.href} className="block border-b border-white/[0.07] px-5 py-3 text-[11px] font-medium text-white transition-colors duration-200 hover:bg-[#ff784e]">
                                  {child.name}
                                </Link>
                              ))}
                            </div>
                          </>
                        ) : (
                          <Link href={room.href} className="block border-b border-white/[0.07] px-5 py-3 text-[11px] font-medium text-white transition-colors duration-200 hover:bg-[#ff784e]">
                            {room.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                  <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-[#ff784e] transition-all duration-300 group-hover:w-5" />
                </div>
              ) : (
                <Link href="/rooms" className="group relative flex h-full items-center px-3 xl:px-4 text-[11px] xl:text-[13px] font-semibold uppercase tracking-[0.06em] text-black transition-colors duration-300 hover:text-[#ff784e]">
                  Rooms & Suites
                  <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-[#ff784e] transition-all duration-300 group-hover:w-5" />
                </Link>
              )}

              {navItems.filter((item) => item.name !== "Home").map((item) => (
                <Link key={item.name} href={item.href} className="group relative flex h-full items-center px-3 xl:px-4 text-[11px] xl:text-[13px] font-semibold uppercase tracking-[0.06em] text-black transition-colors duration-300 hover:text-[#ff784e]">
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-[#ff784e] transition-all duration-300 group-hover:w-5" />
                </Link>
              ))}
            </div>

            {/* RIGHT ACTIONS */}
            <div className="hidden items-center gap-2 xl:gap-4 lg:flex">
              <button type="button" onClick={() => setSearchOpen(true)} className="flex h-8 w-8 xl:h-10 xl:w-10 items-center justify-center rounded-full border border-black/10 text-black transition-all duration-300 hover:border-[#ff784e] hover:text-[#ff784e]" aria-label="Search">
                <Search size={15} strokeWidth={1.8} />
              </button>

              <Link href="/booking" className="group flex items-center gap-2 xl:gap-3 bg-black py-1.5 xl:py-2 pl-3 xl:pl-5 pr-1 xl:pr-1.5 text-[9px] xl:text-[10px] font-semibold uppercase tracking-[0.06em] text-white transition-all duration-300 hover:bg-[#ff784e] sm:text-[11px]">
                <span>Book Now</span>
                <span className="flex h-6 w-6 xl:h-7 xl:w-7 items-center justify-center bg-[#ff784e] text-white transition-all duration-300 group-hover:bg-white group-hover:text-[#ff784e]">
                  <ArrowUpRight size={13} strokeWidth={2} />
                </span>
              </Link>
            </div>

            {/* MOBILE BUTTON */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-all duration-300 hover:bg-[#ff784e] lg:hidden"
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} strokeWidth={1.8} /> : <Menu size={20} strokeWidth={1.8} />}
            </button>
          </div>
        </div>

        {/* MOBILE NAV */}
        <div
          data-lenis-prevent
          className={`border-t border-black/10 bg-white transition-all duration-500 lg:hidden custom-scrollbar ${mobileOpen ? "max-h-[80vh] overflow-y-auto opacity-100" : "max-h-0 overflow-hidden opacity-0"}`}
        >
          <div className="mx-auto max-w-[1500px] px-3 py-3 sm:px-6 sm:py-5">

            <Link href="/" onClick={closeMobileMenu} className="flex items-center border-b border-black/[0.07] px-2 py-3 text-[12px] font-semibold uppercase tracking-wide text-black transition-colors hover:text-[#ff784e] sm:py-4 sm:text-[13px]">
              Home
            </Link>

            {/* MOBILE ROOMS */}
            {rooms.length > 0 ? (
              <div className="border-b border-black/[0.07]">
                <button type="button" onClick={() => setMobileRoomsOpen(!mobileRoomsOpen)} className="flex w-full items-center justify-between px-2 py-3 sm:py-4">
                  <span className="text-[12px] font-semibold uppercase tracking-wide text-black sm:text-[13px]">Rooms & Suites</span>
                  <ChevronDown size={16} className={`text-black transition-transform duration-300 ${mobileRoomsOpen ? "rotate-180 text-[#ff784e]" : ""}`} />
                </button>

                <div className={`overflow-hidden transition-all duration-500 ${mobileRoomsOpen ? "max-h-[800px] pb-3" : "max-h-0"}`}>
                  <div className="flex flex-col px-1 pt-1">
                    {rooms.map((room) => (
                      <div key={room.name}>
                        <Link href={room.href} onClick={closeMobileMenu} className="flex items-center justify-between border-b border-black/[0.05] px-2 py-2.5 text-[11px] font-medium text-black/70 transition-colors hover:text-[#ff784e]">
                          <span>{room.name}</span>
                          <ChevronRight size={13} className="text-black/30" />
                        </Link>
                        {room.children && (
                          <div className={`ml-4 overflow-hidden transition-all duration-300 ${mobileSubmenu === room.name ? "max-h-40 opacity-100 pb-1" : "max-h-0 opacity-0"}`}>
                            <button type="button" onClick={() => setMobileSubmenu(mobileSubmenu === room.name ? null : room.name)} className="flex w-full items-center justify-between px-1 py-1 text-[10px] text-black/40 transition-colors hover:text-[#ff784e]">
                              <span>View All</span>
                              <ChevronDown size={12} className={`transition-transform duration-300 ${mobileSubmenu === room.name ? "rotate-180 text-[#ff784e]" : ""}`} />
                            </button>
                            <div className="ml-1 border-l-2 border-[#ff784e] pl-2">
                              {room.children.map((child) => (
                                <Link key={child.name} href={child.href} onClick={closeMobileMenu} className="block py-1 text-[10px] text-black/50 transition-colors hover:text-[#ff784e]">
                                  {child.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/rooms" onClick={closeMobileMenu} className="flex items-center border-b border-black/[0.07] px-2 py-3 text-[12px] font-semibold uppercase tracking-wide text-black transition-colors hover:text-[#ff784e] sm:py-4 sm:text-[13px]">
                Rooms & Suites
              </Link>
            )}


            {["About", "Dining", "Facilities", "Contact"].map((name) => (
              <Link key={name} href={`/${name.toLowerCase()}`} onClick={closeMobileMenu} className="flex items-center border-b border-black/[0.07] px-2 py-3 text-[12px] font-semibold uppercase tracking-wide text-black transition-colors hover:text-[#ff784e] sm:py-4 sm:text-[13px]">
                {name}
              </Link>
            ))}

            

            <Link href="/booking" onClick={closeMobileMenu} className="mt-2.5 flex items-center justify-center gap-2 rounded-xl bg-[#ff784e] px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-white transition-all hover:bg-black sm:mt-3 sm:py-3.5 sm:text-[13px]">
              Book Your Stay
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* SEARCH OVERLAY */}
      <div className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-all duration-300 ${searchOpen ? "visible opacity-100" : "invisible opacity-0"}`} onClick={() => setSearchOpen(false)}>
        <div className={`mx-auto max-w-2xl px-4 pt-[100px] transition-all duration-500 sm:px-5 sm:pt-[120px] ${searchOpen ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`} onClick={(e) => e.stopPropagation()}>

          {/* Search Input */}
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-1.5 backdrop-blur-xl sm:p-2">
            <div className="relative flex items-center">
              <Search size={20} strokeWidth={1.5} className="absolute left-4 text-white/50 sm:left-5" />
              <input
                type="text"
                placeholder="Search rooms, amenities, services..."
                autoFocus={searchOpen}
                className="w-full bg-transparent py-4 pl-12 pr-4 text-[14px] text-white outline-none placeholder:text-white/40 sm:py-5 sm:pl-14 sm:text-[16px]"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-2 flex h-9 shrink-0 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 text-[10px] font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:border-[#ff784e] hover:bg-[#ff784e] sm:h-10 sm:px-5 sm:text-[11px]"
              >
                Close
              </button>
            </div>
          </div>

          {/* Popular Tags */}
          <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 sm:text-[11px]">
              Popular:
            </span>
            {["Presidential Suite", "Honeymoon Suite", "Pool & Spa", "Restaurant"].map((tag) => (
              <button
                key={tag}
                type="button"
                className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-medium text-white/60 backdrop-blur-sm transition-all duration-300 hover:border-[#ff784e] hover:bg-[#ff784e]/10 hover:text-[#ff784e] sm:text-[12px]"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Divider line */}
          <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        </div>
      </div>
    </header>
  );
}

# The Azura Hotel Management - Changelog

## Color Palette
- Primary Accent: `#e85d04` (deep orange)
- Foreground: `#121212`
- Background: `#f9f9f9`

---

## 1. Smooth Scroll + GSAP Setup
**Problem:** Page scroll was jarring, no smooth transitions between sections.
**Solution:**
- Created `SmoothScrollProvider.tsx` using Lenis (`autoRaf: true`, `lerp: 0.1`)
- Created `GsapProvider.tsx` for GSAP + ScrollTrigger
- `overflow-x: removed` from html/body — Lenis root mode manages overflow
- Layout order: `<SmoothScrollProvider>` → `<GsapProvider>` → `<Navbar />` + `{children}`

---

## 2. Navbar
**Problem:** Needed fixed sticky navbar with mobile menu, search overlay, dropdowns.
**Solution:**
- `fixed top-0 left-0 z-50 w-full bg-white` with orange accent bar
- Desktop nav: Home, Rooms & Suites (dropdown), About, Facilities, Contact
- Mobile hamburger menu with Rooms submenu expand
- Search overlay with popular tags
- Font size fix: All desktop nav items now same size `text-[12px]` (Rooms was `10px`, fixed to match)

---

## 3. Hero Section
**Problem:** Needed hero with image slider, booking bar, responsive text, smooth animations.
**Solution:**
- GSAP image slider (room1-3.avif), auto-play 4s
- Entrance animations: label → title → description → actions → booking bar
- Slider arrows hidden on mobile (`hidden sm:flex`), shown on desktop at vertical center
- Dots at bottom center

### 3a. Booking Bar
**Problem:** Booking bar overlapping hero content, dropdowns getting clipped.
**Solution:**
- Booking bar inside hero `<section>` at `absolute bottom-0 left-0 z-20`
- All dropdowns (Calendar, Guests, Rooms) use `createPortal` to `document.body` with `position: fixed` + `z-index: 100`
- `overflow-hidden` moved from hero `<section>` to slider container div only — allows dropdowns to overflow

### 3b. Responsive Fixes (858x775 tablet + 366x850 phone)
**Problem:** Hero content overlapping booking bar at tablet/phone sizes, button too wide, poor spacing.

#### Tailwind Breakpoint System Used:
- Default (no prefix): 0px — phone
- `sm:`: 640px — small tablets / large phones landscape
- `md:`: 768px — tablets
- `lg:`: 1024px — desktop / landscape tablets
- `xl:`: 1280px — large desktop

#### What was the problem at 858x775 (tablet):
- 858px falls between `sm` (640px) and `lg` (1024px), so `sm:` classes active
- Booking bar grid was `sm:grid-cols-2` — 4 fields in 2 rows + button in separate row
- Check Availability button got full width of its grid cell (too wide, looked bad)
- Hero content text sat too low, overlapping the booking bar at bottom
- Slider dots were at `bottom-20` — hidden behind booking bar

#### What was the problem at 366x850 (phone):
- All 5 booking fields stacked in 1 column (`grid-cols-1`)
- Booking bar became very tall (~280px) because fields stack vertically
- Hero content had `pb-48` (192px) — not enough, content overlapped booking bar
- Text too large for narrow screen, overflowing horizontally
- Icons and padding too bulky for small screen

#### Solution — Code Changes:

**Hero content padding (prevents overlap with booking bar):**
```
Phone:  pb-72 (288px)  — booking bar tall on phone (stacked fields)
sm:     pb-56 (224px)  — booking bar shorter (2-col grid)
lg:     pb-60 (240px)  — booking bar 5-col row
```
Effect: Content pushes up, no overlap with booking bar on any screen size.

**Slider dots position (must match content bottom padding):**
```
Phone:  bottom-72
sm:     bottom-56
lg:     bottom-60
```
Effect: Dots sit right above the booking bar, not behind it.

**Check Availability button:**
```
Phone:    full width (default grid-cols-1)
sm:       sm:col-span-2  — spans both columns in 2-col grid (full width)
lg:       lg:col-span-1  — back to single column in 5-col grid
```
Effect: On tablet the button gets its own full-width row; on desktop it sits inline with other fields.

**Hero heading font size:**
```
Phone:  text-[32px]       — small enough for 366px width
sm:     sm:text-5xl       — 48px
md:     md:text-6xl       — 60px
lg:     lg:text-7xl       — 72px
xl:     xl:text-[88px]    — largest
```
Effect: Title doesn't overflow horizontally on narrow screens.

**Hero label (Welcome to The Azura):**
```
Phone:  text-[9px], w-6 lines, gap-2
sm:     sm:text-[11px], sm:w-10 lines, sm:gap-3
```
Effect: Label stays compact on phone, readable on larger screens.

**Hero description:**
```
Phone:  text-[11px], max-w-[300px], px-1, leading-5
sm:     sm:text-sm, sm:max-w-2xl, sm:leading-7
```
Effect: Text wraps nicely within 366px width without horizontal scroll.

**Hero action buttons:**
```
Phone:  flex-col, gap-3, max-w-xs (stacked vertically)
sm:     sm:flex-row, sm:justify-center, sm:gap-3 (side by side)
```
Effect: Buttons stack on phone, sit side by side on tablet+.

**Booking bar container:**
```
Phone:  px-3, pb-3, rounded-xl, p-2.5 inner
sm:     sm:px-6, sm:pb-5, sm:rounded-2xl, sm:p-4 inner
lg:     lg:px-10, lg:pb-8, lg:rounded-3xl, lg:p-5 inner
```
Effect: Less padding on phone = more space for content. Rounded corners scale up.

**Booking bar grid:**
```
Phone:  grid-cols-1, gap-2.5  (all fields stacked)
sm:     sm:grid-cols-2, sm:gap-2  (2 fields per row)
lg:     lg:grid-cols-[1.1fr_1.1fr_0.9fr_0.9fr_auto]  (5 fields in row)
```
Effect: Stacked on phone → 2-col on tablet → full row on desktop.

**Individual booking field buttons:**
```
Phone:  gap-2, px-3, py-2.5, rounded-lg
sm:     sm:gap-3, sm:px-5, sm:py-3.5, sm:rounded-xl
```
Effect: Compact fields on phone, spacious on desktop.

**Field icons (CalendarDays, Users, BedDouble):**
```
Phone:  size={16}  (via className="sm:hidden" on 16px, "hidden sm:block" on 18px)
sm:     size={18}
```
Effect: Smaller icons fit better in compact phone fields.

**Field labels (Check-in, Guests, etc.):**
```
Phone:  text-[7px], tracking-[0.12em]
sm:     sm:text-[9px], sm:tracking-[0.18em]
```
Effect: Tiny labels on phone to save space, normal on desktop.

**Field values ("Select date", "2 Adults"):**
```
Phone:  text-[11px]
sm:     sm:text-sm (14px)
```
Effect: Values readable but not too large on phone.

**Dropdown chevrons:**
```
Phone:  size={12}  (via className="sm:hidden" on 12px, "hidden sm:block" on 14px)
sm:     size={14}
```
Effect: Smaller chevrons in compact phone fields.

**Check Availability button:**
```
Phone:  py-3, text-[10px], gap-2, rounded-lg
sm:     sm:py-4, sm:text-[11px], sm:gap-2.5, sm:rounded-xl
```
Effect: Shorter button on phone, taller on desktop.

---

## 4. Custom DatePicker
**Problem:** Needed dual-month calendar for check-in/check-out selection.
**Solution:**
- `DatePicker.tsx` — dual-month calendar view with orange accent highlights
- Past dates disabled
- Uses portal positioning via `getBoundingClientRect()`

---

## 5. Guests & Rooms Dropdowns
**Problem:** Dropdowns clipped by hero section overflow.
**Solution:**
- Both use `createPortal` to `document.body`
- `position: fixed` + `z-index: 100`
- Position calculated via `getBoundingClientRect()` from button ref
- Click outside to close (invisible overlay `z-[99]`)

---

## 6. Featured Rooms Section
**Problem:** Needed responsive room cards with images, tags, ratings, prices.
**Solution:**
- 5 room cards with real images from `public/room and suites/`
- Desktop: horizontal scroll with arrow buttons
- Mobile: snap carousel with dots navigation
- Tags, star ratings, price, "View Detail" link
- Responsive layout across all breakpoints

---

## 7. About Section
**Problem:** Needed dark luxury about section with overlapping images and GSAP scroll animations.
**Solution:**
- Dark gradient bg: `from-[#1a1a1a] via-[#121212] to-[#1c1008]`
- Orange gradient overlay on left: `from-[#e85d04]/8`
- Overlapping images (room1.avif + room2.avif) with `ring-2 ring-[#e85d04]/20`
- Feature badges with `bg-[#e85d04]/20` icons
- Double orange accent line under "Welcome to"
- Decorative orange border corner + vertical accent bar
- "Discover More" button with arrow icon

---

## 8. Facilities Section
**Problem:** Needed facilities grid with cards, header, and CTA.
**Solution:**
- Orange background `bg-[#e85d04]` with white text (not dark bg)
- Header: "Hotel Facilities" label + "Everything you need, all in one place."
- Heading + description side by side on desktop
- 2 large cards (Pool, Dining) + 4 small cards (Spa, Gym, Parking, WiFi)
- Cards with hover effects, icons, number labels, bottom line animation
- "Explore All Facilities" button centered with `sm:col-span-2`
- Color fixed from `#F7580F` → `#e85d04` throughout

---

## Known Issues / Notes
- `npm` commands must use `cmd /c "npm ..."` prefix (PowerShell blocks npm directly)
- Next.js 16.3.3 with Turbopack default
- Shell: Windows PowerShell 5.1
- All images use `<Image>` with `unoptimized` prop (no next/image optimization configured yet)

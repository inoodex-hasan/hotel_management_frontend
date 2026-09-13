import AboutSection from "@/components/shared/AboutSection";
import FeaturedRooms from "@/components/shared/FeaturedRooms";
import Hero from "@/components/shared/Hero";
import FacilitiesSection from "@/components/shared/FacilitiesSection";
import DiningSection from "@/components/shared/DiningSection";
import GallerySection from "@/components/shared/GallerySection";
import TestimonialsSection from "@/components/shared/TestimonialsSection";
import ExperienceBanner from "@/components/shared/ExperienceBanner";
import {
  getHeroSlides,
  getSettings,
  getAboutContent,
  getRoomTypes,
  getFacilities,
  getDiningVenues,
  getGalleryItems,
  getTestimonials,
} from "@/lib/api";

export default async function Home() {
  const [
    slides,
    settings,
    about,
    rooms,
    facilities,
    diningVenues,
    galleryItems,
    testimonials,
  ] = await Promise.all([
    getHeroSlides(),
    getSettings(),
    getAboutContent(),
    getRoomTypes(),
    getFacilities(),
    getDiningVenues(),
    getGalleryItems(),
    getTestimonials(),
  ]);

  return (
    <>
      <Hero initialSlides={slides} initialSettings={settings} />
      <AboutSection initialAbout={about} />
      <FeaturedRooms initialRooms={rooms} />
      <FacilitiesSection initialFacilities={facilities} />
      <DiningSection initialVenues={diningVenues} />
      <GallerySection initialItems={galleryItems} />
      <ExperienceBanner initialSettings={settings} />
      <TestimonialsSection initialTestimonials={testimonials} />
    </>
  );
}

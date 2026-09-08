import AboutSection from "@/components/shared/AboutSection";
import FeaturedRooms from "@/components/shared/FeaturedRooms";
import Hero from "@/components/shared/Hero";
import FacilitiesSection from "@/components/shared/FacilitiesSection";
import DiningSection from "@/components/shared/DiningSection";
import GallerySection from "@/components/shared/GallerySection";
import TestimonialsSection from "@/components/shared/TestimonialsSection";
import ExperienceBanner from "@/components/shared/ExperienceBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection/>
      <FeaturedRooms />
      
       <FacilitiesSection />
       <DiningSection/>
       <GallerySection/>
        <ExperienceBanner />
    
       <TestimonialsSection/>
      

       
    </>
  );
}

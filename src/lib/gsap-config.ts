import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.defaults({
  ease: "power2.out",
  duration: 0.8,
});

ScrollTrigger.defaults({
  markers: process.env.NODE_ENV === "development",
});

export { gsap, ScrollTrigger };

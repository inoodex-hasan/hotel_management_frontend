import {
  getAboutContent,
  getSettings,
  getDiningVenues,
  getFacilities,
} from "@/lib/api";
import AboutClient from "./AboutClient";

export default async function AboutPage() {
  const [about, settings, dining, facilities] = await Promise.all([
    getAboutContent(),
    getSettings(),
    getDiningVenues(),
    getFacilities(),
  ]);

  return (
    <AboutClient
      initialAbout={about}
      initialSettings={settings}
      initialDining={dining}
      initialFacilities={facilities}
    />
  );
}

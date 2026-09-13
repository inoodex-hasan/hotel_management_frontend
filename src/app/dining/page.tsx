import { getDiningVenues, getSettings } from "@/lib/api";
import DiningClient from "./DiningClient";

export default async function DiningPage() {
  const [restaurants, settings] = await Promise.all([
    getDiningVenues(),
    getSettings(),
  ]);

  return <DiningClient initialRestaurants={restaurants} initialSettings={settings} />;
}

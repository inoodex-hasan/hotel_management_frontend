import { getRoomTypes, getSettings } from "@/lib/api";
import RoomsClient from "./RoomsClient";

export default async function RoomsPage() {
  const [rooms, settings] = await Promise.all([
    getRoomTypes(),
    getSettings(),
  ]);

  return <RoomsClient initialRooms={rooms} initialSettings={settings} />;
}

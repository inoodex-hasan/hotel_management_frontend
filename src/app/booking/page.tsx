import { getRoomTypes, getSettings } from "@/lib/api";
import BookingClient from "./BookingClient";

export default async function BookingPage() {
  const [rooms, settings] = await Promise.all([
    getRoomTypes(),
    getSettings(),
  ]);

  return <BookingClient initialRooms={rooms} initialSettings={settings} />;
}

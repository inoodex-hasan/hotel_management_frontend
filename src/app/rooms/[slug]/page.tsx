import { getRoomTypeBySlug, getRoomTypes, getSettings } from "@/lib/api";
import RoomDetailClient from "./RoomDetailClient";

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [room, allRooms, settings] = await Promise.all([
    getRoomTypeBySlug(slug),
    getRoomTypes(),
    getSettings(),
  ]);

  const otherRooms = (allRooms || [])
    .filter((r) => r.slug !== slug)
    .slice(0, 3);

  return (
    <RoomDetailClient
      initialRoom={room}
      initialOtherRooms={otherRooms}
      initialSettings={settings}
    />
  );
}

import { getFacilities } from "@/lib/api";
import FacilitiesClient from "./FacilitiesClient";

export default async function FacilitiesPage() {
  const facilities = await getFacilities();

  return <FacilitiesClient initialFacilities={facilities} />;
}

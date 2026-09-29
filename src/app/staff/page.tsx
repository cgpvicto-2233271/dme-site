import type { Metadata } from "next";
import { StaffClient } from "./staff-client";

export const metadata: Metadata = {
  title: "Direction | DME",
};

export default function StaffPage() {
  return <StaffClient />;
}

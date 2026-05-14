import type { Metadata } from "next";
import { StaffClient } from "./staff-client";

export const metadata: Metadata = {
  title: "Staff | DeathMark E-Sports",
};

export default function StaffPage() {
  return <StaffClient />;
}

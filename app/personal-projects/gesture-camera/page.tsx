import type { Metadata } from "next";
import { GestureCameraExperience } from "@/components/gesture-camera-experience";

export const metadata: Metadata = {
  title: "Turning Anime Into Interaction — Hamza Ayaz",
  description: "Hand gesture camera interaction — Hollow Purple ritual demo.",
};

export default function GestureCameraProjectPage() {
  return (
    <div className="relative h-svh overflow-hidden bg-[#02030A] text-[#F5F7FF]" style={{ color: "#F5F7FF" }}>
      <div className="relative z-20 isolate h-svh w-full">
        <GestureCameraExperience />
      </div>
    </div>
  );
}

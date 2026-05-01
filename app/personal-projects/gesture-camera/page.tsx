import type { Metadata } from "next";
import { GestureCameraExperience } from "@/components/gesture-camera-experience";

export const metadata: Metadata = {
  title: "Turning Anime Into UX — Hamza Ayaz",
  description: "Hand gesture camera interaction — Hollow Purple ritual demo.",
};

export default function GestureCameraProjectPage() {
  const cityBg = `url("/Images/${encodeURIComponent("image 9326.png")}")`;
  return (
    <div className="relative min-h-svh bg-[#04070f] text-white" style={{ color: "white" }}>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-neutral-950 bg-cover bg-center bg-no-repeat opacity-[0.38]"
        style={{ backgroundImage: cityBg }}
      />
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-black/70 via-black/35 to-black/88" />
      <div className="relative z-20 isolate min-h-svh w-full">
        <GestureCameraExperience />
      </div>
    </div>
  );
}

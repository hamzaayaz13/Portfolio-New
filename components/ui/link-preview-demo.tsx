"use client";
import React from "react";
import { LinkPreview } from "@/components/ui/link-preview";

export function LinkPreviewDemo() {
  return (
    <div className="flex justify-center items-start min-h-[30rem] md:h-[40rem] flex-col px-4">
      <p className="text-neutral-500 dark:text-neutral-400 text-3xl md:text-[40px] text-left mb-6 md:mb-10 w-full leading-tight">
        Product Designer for{" "}
        <LinkPreview
          url="https://www.dubizzlegroup.com/"
          className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500"
        >
          Dubizzle Group
        </LinkPreview>
      </p>
      <p className="text-neutral-500 dark:text-neutral-400 text-3xl md:text-[40px] text-left w-full leading-relaxed md:leading-relaxed">
        Experience across{" "}
        <span className="font-bold text-white">B2C</span>,{" "}
        <span className="font-bold text-white">B2B</span>, and enterprise{" "}
        <span className="font-bold text-white">SaaS</span> — used by millions,
        trusted by Fortune 500s, and currently integrating{" "}
        <span className="font-bold text-white">AI-driven</span> design systems to
        create consistent, scalable designs 70% faster
      </p>
    </div>
  );
}

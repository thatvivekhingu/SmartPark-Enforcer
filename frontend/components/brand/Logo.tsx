"use client";

import React from "react";

export function Logo({
  size = 36,
  showText = true,
}: {
  size?: number;
  showText?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      {/* Official Ashoka Stambh / State Police Badge Emblem */}
      <div 
        className="shrink-0 flex items-center justify-center rounded-lg bg-gradient-to-b from-[#1E293B] to-[#0F172A] border border-[#334155] p-1.5 shadow-sm"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[#F59E0B]"
        >
          {/* Ashoka Stambh / National Emblem Stylized Vectors */}
          <path
            d="M50 8 C40 8 36 18 36 28 C36 34 40 40 46 42 C34 44 24 54 24 68 C24 82 38 88 50 88 C62 88 76 82 76 68 C76 54 66 44 54 42 C60 40 64 34 64 28 C64 18 60 8 50 8 Z"
            fill="currentColor"
          />
          <circle cx="50" cy="98" r="9" stroke="currentColor" strokeWidth="2.5" />
          <path d="M50 89 V107 M41 98 H59" stroke="currentColor" strokeWidth="1.5" />
          <rect x="18" y="110" width="64" height="6" rx="2" fill="currentColor" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-black tracking-wider text-[#F8FAFC] uppercase font-sans">
            City Enforcement Dashboard
          </span>
          <span className="text-[10px] font-bold text-[#94A3B8] tracking-widest uppercase mt-0.5">
            Nagaland Traffic Unit · ICCC
          </span>
        </div>
      )}
    </div>
  );
}

export default Logo;

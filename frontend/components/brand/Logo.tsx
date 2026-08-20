"use client";

import React from "react";

export function Logo({
  size = 32,
  showText = true,
}: {
  size?: number;
  showText?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      {/* SmartPark Enforcer Geometric Monogram */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="SmartPark Enforcer logo"
        className="shrink-0"
      >
        {/* S vertical stem */}
        <rect x="4" y="7" width="4" height="18" rx="1.5" fill="#0071E3" />
        {/* S top bar */}
        <rect x="4" y="7" width="13" height="4" rx="1.5" fill="#0071E3" />
        {/* S middle bar */}
        <rect x="4" y="14" width="11" height="4" rx="1.5" fill="#0071E3" />
        {/* S bottom bar */}
        <rect x="4" y="21" width="13" height="4" rx="1.5" fill="#0071E3" />
        {/* P scan arc – outer */}
        <path
          d="M19 9 Q30 16 19 23"
          stroke="#0071E3"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* P scan arc – inner radar accent */}
        <path
          d="M22 12.5 Q28 16 22 19.5"
          stroke="#34C759"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold text-[#1d1d1f] tracking-tight">
            SmartPark
          </span>
          <span className="text-[10px] font-semibold text-[#86868b] tracking-[0.16em] uppercase mt-0.5">
            Enforcer
          </span>
        </div>
      )}
    </div>
  );
}

export default Logo;

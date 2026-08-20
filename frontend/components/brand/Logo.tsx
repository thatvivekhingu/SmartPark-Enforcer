export function Logo({
  size = 32,
  showText = true,
}: {
  size?: number;
  showText?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="SmartPark Enforcer logo"
      >
        {/* S stem – vertical lane marker */}
        <rect x="4" y="8" width="4" height="16" rx="1.5" fill="#4C6FFF" />
        {/* S top bar */}
        <rect x="4" y="8" width="12" height="4" rx="1.5" fill="#4C6FFF" />
        {/* S middle bar */}
        <rect x="4" y="14" width="10" height="4" rx="1.5" fill="#4C6FFF" />
        {/* S bottom bar */}
        <rect x="4" y="20" width="12" height="4" rx="1.5" fill="#4C6FFF" />
        {/* P scan arc – outer */}
        <path
          d="M19 10 Q29 16 19 22"
          stroke="#4C6FFF"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* P scan arc – inner (success accent) */}
        <path
          d="M22 13 Q27 16 22 19"
          stroke="#22C55E"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-sm font-bold text-[#EDEEF1] tracking-tight">
            SmartPark
          </span>
          <span className="text-[10px] font-semibold text-[#5B6070] tracking-[0.18em] uppercase mt-0.5">
            Enforcer
          </span>
        </div>
      )}
    </div>
  );
}

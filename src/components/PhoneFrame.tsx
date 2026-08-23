"use client";

/**
 * A phone, not a drawing of one — ported from agent-test-drive's
 * PhoneDrawer.tsx StatusBar/HomeIndicator (hand-drawn signal/wifi/battery
 * SVGs, hardcoded 9:41, bezel-less rounded rectangle with a soft shadow).
 * The Dynamic Island is new — modeled on the user's own real screenshot
 * (app-screenshot/IMG_1408.PNG), not present in the reference codebase.
 *
 * Wraps the entire rep app persistently: every screen from Home through
 * Profile renders inside this one frame, per direct instruction. `dark`
 * flips status-bar/home-indicator tone for the one dark screen (Live Call).
 */
// Real iPhone 14/15 logical point size. Fixed at every breakpoint on
// purpose — a device doesn't get shorter because the screen inside it has
// less content. (Previously `md:h-[unset]` removed the height constraint on
// desktop, which let the whole frame shrink-to-fit its children — that bug
// also silently broke every internal `overflow-y-auto` scroll region, since
// nothing upstream had a definite height left to clip against.)
const FRAME_WIDTH = 402;
const FRAME_HEIGHT = 874;

export function PhoneFrame({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#e9e6f4]">
      <div
        className="relative flex shrink-0 flex-col overflow-hidden"
        style={{
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT,
          borderRadius: 52,
          boxShadow: "0 48px 90px -20px rgba(8,10,18,0.35), 0 12px 30px -12px rgba(8,10,18,0.25)",
          background: dark ? "#0a0a10" : "#ffffff",
        }}
      >
        <StatusBar dark={dark} />
        <DynamicIsland />
        <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
        <HomeIndicator dark={dark} />
      </div>
    </div>
  );
}

function StatusBar({ dark = false }: { dark?: boolean }) {
  const tone = dark ? "#fff" : "#000";
  return (
    <div
      className="relative z-10 flex shrink-0 items-center justify-between px-8 pt-4 text-[15px] font-semibold"
      style={{ color: tone }}
    >
      <span className="tabular-nums tracking-tight">9:41</span>
      <span className="flex items-center gap-[5px]">
        {/* signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill={tone}>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 4.6} y={9 - i * 2.7} width="3" height={3 + i * 2.7} rx="0.8" />
          ))}
        </svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path
            d="M1 4.2a10.5 10.5 0 0 1 14 0M3.6 6.9a6.8 6.8 0 0 1 8.8 0M6.2 9.5a3 3 0 0 1 3.6 0"
            stroke={tone}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        {/* battery */}
        <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
          <rect x="0.6" y="0.6" width="22" height="11.8" rx="3.4" stroke={tone} strokeOpacity="0.4" strokeWidth="1.1" />
          <rect x="2.4" y="2.4" width="15" height="8.2" rx="2" fill={tone} />
          <path d="M24.4 4.6v3.8a2 2 0 0 0 0-3.8Z" fill={tone} fillOpacity="0.4" />
        </svg>
      </span>
    </div>
  );
}

function DynamicIsland() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[11px] z-20 h-[32px] w-[104px] -translate-x-1/2 rounded-full bg-black" />
  );
}

function HomeIndicator({ dark = false }: { dark?: boolean }) {
  return (
    <div className="relative z-10 flex shrink-0 justify-center pb-[9px] pt-2">
      <span
        className="h-[5px] w-[138px] rounded-full"
        style={{ background: dark ? "#ffffff" : "#0d0d0d", opacity: 0.9 }}
      />
    </div>
  );
}

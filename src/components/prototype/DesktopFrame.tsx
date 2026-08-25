/**
 * A desktop console at real size, scaled to sit in the phone's slot. Rendered at
 * 1180x800 and scaled rather than laid out narrow, so the manager view reflows
 * exactly as it would on a GM's monitor — a squeezed desktop layout would be a
 * different screen, and the point is to show the real one.
 */
export function DesktopFrame({ children }: { children: React.ReactNode }) {
  const W = 1180;
  const H = 800;
  const scale = 0.42;
  return (
    <div
      className="overflow-hidden rounded-[10px] border border-rule bg-paper shadow-[0_24px_60px_-30px_rgba(20,19,26,0.4)]"
      style={{ width: W * scale, height: H * scale }}
    >
      <div
        style={{
          width: W,
          height: H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}

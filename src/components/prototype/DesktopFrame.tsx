/**
 * A desktop console at real size, scaled to sit in the phone's slot. Rendered at
 * 1180x800 and scaled rather than laid out narrow, so the manager view reflows
 * exactly as it would on a GM's monitor — a squeezed desktop layout would be a
 * different screen, and the point is to show the real one.
 */
export function DesktopFrame({ children }: { children: React.ReactNode }) {
  const W = 1180;
  const H = 800;
  /**
   * What bounds this: the reserved slot above it, not the column.
   *
   * The phone column reserves 874px of height so the stepper below never moves
   * between steps. At 0.42 the console rendered 496x336 inside that slot — using
   * 38% of the height already set aside for it, which made the one screen a GM
   * would actually open read as a thumbnail. 0.72 puts it at 850x576, still
   * comfortably inside 874, so the stepper invariant holds.
   *
   * The cost is horizontal: this column is `shrink-0`, so a wider console takes
   * its width out of the annotation beside it. That's affordable here only
   * because the manager step is the lightest one — five short bullets — and its
   * comparison stacks 1-up to suit the narrower column. Raising this further
   * starts squeezing copy, not whitespace.
   */
  const scale = 0.72;
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

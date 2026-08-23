/**
 * Generated art for v2.
 *
 * v1 substituted letters for pictures in two places — `{vehicle.make[0]}{vehicle.model[0]}`
 * as a vehicle thumbnail and `{brand.name[0]}` as a partner logo. Both read as
 * "asset missing", which is the single loudest wireframe tell in the build.
 *
 * These are hand-authored SVG rather than photography: the prototype ships with
 * no licensed image assets, and a drawn silhouette that is deliberately a
 * drawing reads as a design decision, where a letter in a box reads as a
 * placeholder. Everything here is self-contained, themeable, and weightless.
 *
 * Note on body style: this repo's `Vehicle` type carries no body field (unlike
 * the agent-test-drive reference), so it is derived from the model name below
 * rather than by widening the shared data layer, which `/` also reads.
 */
import type { Vehicle } from "@/data/vehicles";

type Body = "suv" | "sedan";

const SUV_MODELS = new Set(["RAV4", "CR-V", "Wrangler", "Tucson"]);

export function bodyFor(model: string): Body {
  return SUV_MODELS.has(model) ? "suv" : "sedan";
}

/** Real manufacturer paint names, mapped to something close enough to read as
 *  that colour on a 56px plate. Falls back to a neutral silver. */
const PAINT: Record<string, string> = {
  "Silver Sky": "#c9ccd1",
  "Modern Steel": "#6b7280",
  "Celestial Silver": "#c2c5c9",
  "Sarge Green": "#6b7a4f",
  "Aegean Blue": "#2f4f6f",
  "Crystal Black": "#20202a",
  "Fresh Powder": "#e9ebee",
  "Gun Metallic": "#55585e",
  "Amazon Grey": "#7a7f78",
};

export const paintHex = (color: string) => PAINT[color] ?? "#c2c5c9";

/**
 * Side profile, drawn to read at 56px wide. The two bodies differ where it
 * actually matters for recognition: roof height, greenhouse rake, and ride
 * height — not in decorative detail that vanishes at this size.
 */
export function CarSilhouette({
  body,
  fill,
  className = "",
}: {
  body: Body;
  fill: string;
  className?: string;
}) {
  const suv = body === "suv";
  return (
    <svg viewBox="0 0 68 30" className={className} fill="none" aria-hidden="true">
      <path
        d={
          suv
            ? "M3.5 22.5 L4.4 13.6 C4.9 11.2 6.4 10.2 9.2 10.2 L16.2 10.2 L20.4 4.6 C21.4 3.5 22.8 3.1 24.3 3.1 L45.6 3.1 C47.6 3.1 49 3.7 50 5.1 L53.6 10.4 L59.8 11 C62.8 11.4 64.8 12.9 65.1 15.6 L65.4 22.5 Z"
            : "M3.5 22.5 L5.3 16.2 C6 14.1 7.9 13.4 10.8 13.4 L18.2 13.4 L24 7.4 C25 6.4 26.4 6 27.9 6 L42.1 6 C44.1 6 45.6 6.6 46.6 7.9 L51.1 13.5 L58.2 14.1 C61.2 14.5 64 15.7 64.6 18.1 L65.4 22.5 Z"
        }
        fill={fill}
      />
      {/* Glass, one shade darker than the paint so the greenhouse reads. */}
      <path
        d={
          suv
            ? "M21.8 10.2 L24.8 5.9 C25.3 5.3 26 5.1 26.8 5.1 L44.8 5.1 C45.9 5.1 46.6 5.4 47.2 6.2 L50.2 10.2 Z"
            : "M25.4 13.4 L29.2 8.6 C29.7 8 30.4 7.8 31.2 7.8 L41.4 7.8 C42.5 7.8 43.2 8.1 43.8 8.8 L47.4 13.4 Z"
        }
        fill="currentColor"
        opacity="0.28"
      />
      {[suv ? 17.5 : 18.5, suv ? 51 : 51.5].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="22.5" r="5.2" fill="currentColor" opacity="0.9" />
          <circle cx={cx} cy="22.5" r="2.1" fill={fill} />
        </g>
      ))}
    </svg>
  );
}

/**
 * The thumbnail itself: a tinted plate carrying the silhouette, sized to drop
 * straight into the ground-truth card where the two-letter box used to sit.
 */
export function VehiclePlate({
  vehicle,
  w = 60,
  h = 44,
  dark = false,
}: {
  vehicle: Vehicle;
  w?: number;
  h?: number;
  dark?: boolean;
}) {
  const paint = paintHex(vehicle.color);
  return (
    <span
      className={`relative flex shrink-0 items-end justify-center overflow-hidden rounded-[10px] ${
        dark ? "text-black/70" : "text-black/45"
      }`}
      style={{
        width: w,
        height: h,
        background: dark
          ? "linear-gradient(160deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))"
          : "linear-gradient(160deg, #f3f1fa, #e6e2f4)",
      }}
      aria-label={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
    >
      <CarSilhouette
        body={bodyFor(vehicle.model)}
        fill={paint}
        className="mb-[3px] w-[86%]"
      />
    </span>
  );
}

/**
 * RockED's brand motif is a rocket, not a brain — it carries the "Launch"
 * naming through the real app and sits in a white disc on every dark card
 * (app-screenshot/IMG_1408.PNG). v1 reached for lucide's generic Brain and
 * Rocket icons instead. Drawn from the screenshots; swap for the real asset
 * when it's supplied.
 */
export function RocketMark({
  size = 24,
  className = "",
  strokeWidth = 1.9,
}: {
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Fuselage: a pointed teardrop, tapering to the nose. */}
      <path
        d="M12 2.6c2.9 3 4.3 6.3 4.3 9.5 0 3.5-1.6 6.4-4.3 8.6-2.7-2.2-4.3-5.1-4.3-8.6 0-3.2 1.4-6.5 4.3-9.5Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* Fins. */}
      <path
        d="M7.9 13.4 4.6 16.7c-.5.5-.6 1.1-.3 1.7l1.4 2.7M16.1 13.4l3.3 3.3c.5.5.6 1.1.3 1.7l-1.4 2.7"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* The flame, which is what makes it read as a rocket and not a leaf. */}
      <path
        d="M12 9.4c1 1 1.5 2 1.5 2.9 0 1.1-.6 1.9-1.5 2.5-.9-.6-1.5-1.4-1.5-2.5 0-.9.5-1.9 1.5-2.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Partner logotypes. Real marks aren't available, so this is a monogram
 * *system* rather than `name[0]` in a box: a fixed-width tile, the brand's own
 * colour, and the wordmark set beneath it — the anatomy a real logo row has.
 */
export function BrandMark({
  name,
  color,
  size = 34,
}: {
  name: string;
  color: string;
  size?: number;
}) {
  const mono = name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-[10px] font-extrabold tracking-[-0.04em] text-white"
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.38,
        boxShadow: `0 2px 8px -2px ${color}80`,
      }}
      aria-hidden="true"
    >
      {mono}
    </span>
  );
}

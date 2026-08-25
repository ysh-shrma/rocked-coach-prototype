/**
 * The submission's typographic primitives, shared by every slide.
 *
 * Lifted verbatim out of the old single-page write-up rather than rewritten —
 * they already encode the two rules the whole submission is held to:
 *
 * 1. Every number carries its provenance. `Cite` is the only way a figure gets
 *    onto a slide, and it forces a choice between first-party, App Store
 *    verbatim, and vendor-published. Passing a vendor's own number off as
 *    audited is the fastest way to lose this audience.
 * 2. Purple means RockED's. `Rk` is the only component allowed to spend it;
 *    `Em` is the same emphasis in the candidate's own voice and is always ink.
 *    If purple ever appears in his own voice the rule stops carrying meaning.
 */

export function Label({ children }: { children: React.ReactNode }) {
  return <p className="mono text-doc-label uppercase text-r-ink-4">{children}</p>;
}

/** Emphasis in the author's own voice — ink, never purple. */
export function Em({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-r-ink">{children}</strong>;
}

/** Something that belongs to RockED. The only place purple is allowed. */
export function Rk({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-r-brand">{children}</span>;
}

export function Assumed({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-r-ink-3">
      <span className="mono mr-[6px] text-doc-label uppercase text-r-ink-4">
        assumption
      </span>
      {children}
    </span>
  );
}

export function Cite({
  kind,
  inline,
  children,
}: {
  kind: "first-party" | "vendor" | "app-store" | "audited";
  inline?: boolean;
  children: React.ReactNode;
}) {
  const label =
    kind === "first-party"
      ? "first-party"
      : kind === "vendor"
        ? "vendor-published"
        : kind === "audited"
          ? "audited"
          : "app store, verbatim";
  const body = (
    <>
      <span className="mono mr-[6px] text-doc-label uppercase text-r-ink-4">
        {label}
      </span>
      <span className="text-r-ink-3">{children}</span>
    </>
  );
  if (inline) return <span className="text-doc-small">{body}</span>;
  return (
    <p data-cite className="mt-5 text-doc-small">
      {body}
    </p>
  );
}

export function Fact({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="py-3">
      <dt className="text-doc-small font-semibold text-r-ink">{term}</dt>
      <dd className="mt-1 text-doc-small text-r-ink-2">{children}</dd>
    </div>
  );
}

export function Speaker({ children, rocked }: { children: React.ReactNode; rocked?: boolean }) {
  return (
    <span
      className={`mono mr-2 text-doc-label uppercase ${
        rocked ? "text-r-brand" : "text-r-ink-4"
      }`}
    >
      {children}
    </span>
  );
}

/**
 * The eleven-item list on slide 2, and the same shape reused wherever a slide
 * needs an ordered set of short items. Numbering is legitimate here because these
 * genuinely are a sequence — they happened in this order, and the order is the
 * argument.
 */
export function Ordered({
  items,
}: {
  items: { id: string; did: string; said?: string }[];
}) {
  return (
    <ol className="divide-y divide-rule-2 border-y border-rule">
      {items.map((it, i) => (
        <li key={it.id} className="flex gap-4 py-[6px]">
          <span className="mono w-4 shrink-0 pt-[3px] text-doc-mono text-r-ink-4">
            {i + 1}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-doc-small text-r-ink">{it.did}</span>
            {it.said && (
              <span className="mt-[3px] block text-doc-small text-r-ink-3">{it.said}</span>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}

/**
 * A quote given the weight of a claim. `theirs` marks it as RockED's own words,
 * which is the one case where purple on a rule is correct.
 */
export function Pull({
  theirs,
  children,
}: {
  theirs?: boolean;
  children: React.ReactNode;
}) {
  return (
    <p
      data-quote
      className={`border-l-2 pl-5 text-doc-h3 ${
        theirs ? "border-r-brand text-r-brand" : "border-r-ink text-r-ink"
      }`}
    >
      {children}
    </p>
  );
}

/* ---------- The two drawn artifacts ---------- */

/**
 * Trust across the eleven turns, twice: as the product scores it, and as it would
 * have to work.
 *
 * This is the whole finding, and it was previously a sentence. Drawing it is not
 * decoration — the flat line is the bug, and no paragraph makes "nothing
 * accumulates" land the way a line that doesn't move does.
 *
 * The floor is crossed at item eight because that is where it actually happened:
 * item eight is the $18,000-then-$28,000 jump, and the first of the two times she
 * said she was going to keep looking. The decay line stops there rather than
 * running to eleven, because in a model with cumulative state there is no turn
 * nine — which is the point.
 */
function Plot({
  label,
  ys,
  floor,
  tone,
}: {
  label: string;
  /** One y per turn, in viewBox units. Fewer than 11 ends the call early. */
  ys: number[];
  floor?: number;
  tone: "flat" | "decay";
}) {
  const x = (i: number) => 16 + i * 30;
  const stroke = tone === "flat" ? "var(--color-r-ink-4)" : "var(--color-bad-500)";
  const pts = ys.map((y, i) => `${x(i)},${y}`).join(" ");
  return (
    <figure>
      <p className="mono text-doc-label uppercase text-r-ink-4">{label}</p>
      <svg
        viewBox="0 0 340 96"
        className="mt-3 block w-full"
        role="img"
        aria-label={label}
      >
        {/* the eleven turns */}
        {Array.from({ length: 11 }, (_, i) => (
          <line
            key={i}
            x1={x(i)}
            y1={8}
            x2={x(i)}
            y2={88}
            stroke="var(--color-rule-2)"
            strokeWidth="1"
          />
        ))}
        {floor !== undefined && (
          <>
            <line
              x1={8}
              y1={floor}
              x2={332}
              y2={floor}
              stroke="var(--color-bad-300)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <text
              x={332}
              y={floor - 6}
              textAnchor="end"
              className="mono"
              fontSize="8"
              fill="var(--color-bad-500)"
            >
              WALKS AWAY
            </text>
          </>
        )}
        <polyline points={pts} fill="none" stroke={stroke} strokeWidth="2" />
        {ys.map((y, i) => (
          <circle key={i} cx={x(i)} cy={y} r="3.2" fill={stroke} />
        ))}
      </svg>
    </figure>
  );
}

export function TrustLine() {
  return (
    <div className="max-w-[600px] rounded-[14px] border border-rule bg-paper-2 p-5">
      <div className="space-y-4">
        <Plot
          label="Today — every turn judged fresh"
          ys={Array.from({ length: 11 }, () => 44)}
          tone="flat"
        />
        <div className="border-t border-rule-2 pt-4">
          <Plot
            label="What it needs — damage that compounds"
            ys={[16, 21, 28, 42, 49, 62, 69, 80]}
            floor={80}
            tone="decay"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * The two tiers. Named systems, because "it integrates with your CRM" is what
 * somebody says who has never had to negotiate one.
 *
 * Base first and deliberately: a product that only works once a data agreement is
 * signed doesn't ship. Those systems are the dealer's, so they stay ink — purple
 * is reserved for RockED's own things.
 */
export function Layers() {
  return (
    <div>
      <div className="rounded-[14px] border border-rule bg-paper-2 p-6">
        <Label>Base &middot; every rooftop, day one</Label>
        <p className="mt-3 text-doc-body text-r-ink">
          Practice alone. Nothing to connect, nothing to negotiate.
        </p>
        <p className="mt-3 text-doc-small text-r-ink-3">
          Answers: which move is he worst at?
        </p>
      </div>

      <p className="py-3 pl-6 text-doc-small text-r-ink-4">
        &darr;&nbsp;&nbsp;same profile, more truth in it
      </p>

      <div className="rounded-[14px] border-2 border-r-ink bg-paper p-6">
        <Label>Enhanced &middot; connected</Label>
        <div className="mt-3 flex flex-wrap gap-2">
          {["VinSolutions", "DealerSocket", "Elead", "Recorded calls"].map((s) => (
            <span
              key={s}
              className="mono rounded-full border border-rule px-3 py-[6px] text-doc-label uppercase text-r-ink"
            >
              {s}
            </span>
          ))}
        </div>
        <p className="mt-4 text-doc-body text-r-ink">
          His own close and upsell numbers, on that same profile.
        </p>
        <p className="mt-3 text-doc-small text-r-ink-3">
          Answers: did fixing it change what he sold?
        </p>
      </div>

      <p className="mt-5 border-t border-rule pt-4 text-doc-small text-r-ink-3">
        Certified write-back is a commercial negotiation with each provider, not an
        engineering sprint. I negotiate those for a living.
      </p>
    </div>
  );
}

/**
 * Who's writing this. Lives on slide 1 as a byline and slide 14 in full.
 *
 * The framing is provenance, never a boast: "here's what I build, which is why I
 * recognised this." Scope and category only — no revenue, pricing, contract
 * values, customer names, or any comparison between employers. Those are
 * confidential and they're also not what makes the argument land.
 */
export function Who({ full }: { full?: boolean }) {
  if (!full) {
    return (
      <p className="mt-5 text-doc-small text-r-ink-3">
        Yash Sharma &middot; I build the voice and SMS agents that make these calls,
        for US dealership rooftops.
      </p>
    );
  }
  return (
    <>
      <p className="text-doc-body text-r-ink-2">
        I&rsquo;m a product manager at Spyne. I build the voice and SMS sales agents
        that call and text customers for US dealership rooftops — the same
        conversation this deck is about.
      </p>
      <p className="mt-4 text-doc-body text-r-ink-2">
        Which is why I wasn&rsquo;t auditing a UI. I was listening for whether the
        customer had a state.
      </p>
    </>
  );
}

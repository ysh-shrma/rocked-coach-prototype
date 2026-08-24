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
  return <p className="mt-5 text-doc-small">{body}</p>;
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

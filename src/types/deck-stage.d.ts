import type { DetailedHTMLProps, HTMLAttributes } from "react";

/**
 * `<deck-stage>` is a vendored web component (public/deck-stage.js), not a React
 * one, so TypeScript needs telling it exists. Declared here rather than cast at
 * the call site: a cast would also silence a typo in `width`/`height`, and those
 * two attributes are the component's whole contract.
 */
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "deck-stage": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        width?: string;
        height?: string;
        noscale?: boolean;
        "no-rail"?: boolean;
      };
    }
  }
}

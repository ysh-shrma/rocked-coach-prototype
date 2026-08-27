import { PrototypeShell } from "@/components/prototype/PrototypeShell";

/**
 * The live app. Opens on the guided walkthrough, same as /tour: a reviewer who
 * lands cold does better being shown than being handed an unlabelled phone.
 * Same screen as /tour — the mode switch in the header is the only
 * difference between the two URLs, and flipping it rewrites the address bar
 * rather than navigating.
 */
export default function PrototypePage() {
  return <PrototypeShell initialMode="guided" />;
}

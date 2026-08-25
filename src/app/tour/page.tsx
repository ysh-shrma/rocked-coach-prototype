import { PrototypeShell } from "@/components/prototype/PrototypeShell";

/**
 * The guided walkthrough. Kept as a real route rather than a redirect so every
 * link already shared still resolves, and so "the walkthrough" has a URL of its
 * own — it renders the same shell as /prototype, opened on the other mode.
 */
export default function TourPage() {
  return <PrototypeShell initialMode="guided" />;
}

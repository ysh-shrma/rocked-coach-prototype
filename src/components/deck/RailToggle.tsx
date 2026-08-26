"use client";

import { useEffect, useState } from "react";

/**
 * Show/hide the deck's thumbnail rail.
 *
 * `deck-stage` already implements this properly, so this is a button and nothing
 * else. Posting `{type: "__deck_rail_visible", on}` is the component's own
 * documented extension point ("driven by the TweaksPanel's auto-injected
 * 'Thumbnail rail' toggle, or any author script") and it does the three things
 * that would be tedious to reimplement: it slides the rail rather than snapping
 * it, marks it `inert` while hidden so it can't be tabbed into, and re-fits the
 * canvas afterwards. That last one is the real prize: with the rail away the
 * stage scales from 0.69 to 0.79, so the slides render 14% larger.
 *
 * The component also persists the choice to `localStorage` under
 * `deck-stage.railVisible` and reads it back on connect, so this only mirrors
 * that key rather than owning any state of its own. Hence the read in an effect
 * instead of during render: on the server there is no localStorage, and guessing
 * would flash the wrong label on a reviewer who had hidden the rail last visit.
 *
 * Hidden below 640px, which is where deck-stage drops the rail regardless.
 */
export function RailToggle() {
  // deck-stage's own default: only a stored "0" hides the rail.
  const [shown, setShown] = useState(true);

  useEffect(() => {
    try {
      setShown(localStorage.getItem("deck-stage.railVisible") !== "0");
    } catch {
      /* private mode, or storage disabled. The default stands. */
    }
  }, []);

  function toggle() {
    const next = !shown;
    setShown(next);
    window.postMessage({ type: "__deck_rail_visible", on: next }, "*");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={shown}
      title={shown ? "Hide the slide thumbnails" : "Show the slide thumbnails"}
      className="rail-toggle"
    >
      <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true">
        <rect x="1" y="1.5" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
        {/* the rail itself: filled while shown, hollow while hidden */}
        <rect x="1" y="1.5" width="4.2" height="12" rx="2" fill={shown ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4" />
      </svg>
      {shown ? "Hide slides" : "Show slides"}
    </button>
  );
}

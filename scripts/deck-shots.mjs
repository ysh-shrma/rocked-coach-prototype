/**
 * Captures the prototype screens the deck shows as its "after" side.
 *
 * Drives /tour rather than /prototype: the tour already pins each of the five
 * changes to the right screen in the right state (its `seedSession` walks the
 * real dialogue graph with the real reducers), so the deck's screenshots are the
 * same states the walkthrough shows. Clicking through /prototype instead would
 * mean scripting a play-through and hoping it lands on the same beat.
 *
 * Playwright is resolved from career-ops, the only project in the workspace that
 * installs it — same as scripts/shot.mjs.
 *
 * Usage:  node scripts/deck-shots.mjs [port]
 */
import { chromium } from "/Users/yash/Documents/playground/career-ops/node_modules/playwright/index.mjs";

const port = process.argv[2] ?? "3012";
const base = `http://localhost:${port}`;
const out = "public/after";

/** Tour change index -> filename. Change 5 is the desktop manager view and is
 *  captured from its own route instead, at real desktop size. */
const PHONE = ["call", "report", "hub", "profile"];

/** The dev overlay renders into its own portal and ends up baked into any
 *  screenshot taken against `next dev`. Hidden rather than worked around by
 *  building for production, which would mean a second server just for shots. */
const HIDE_DEV_OVERLAY = "nextjs-portal { display: none !important; }";

const browser = await chromium.launch();

// Tall viewport on purpose: `.proto-phone` carries a scale transform under
// max-height 1010px, and a scaled frame screenshots soft.
const page = await browser.newPage({
  viewport: { width: 1500, height: 1200 },
  deviceScaleFactor: 2,
});

for (let k = 0; k < PHONE.length; k++) {
  await page.goto(`${base}/tour`, { waitUntil: "load", timeout: 20000 });
  await page.addStyleTag({ content: HIDE_DEV_OVERLAY });
  await page.waitForTimeout(900);
  for (let c = 0; c < k; c++) {
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.waitForTimeout(500);
  }
  await page.waitForTimeout(900);
  // The device only. `.proto-phone` is the whole sticky column and now includes
  // the walkthrough stepper below the frame, which bled into the shot; `.v3` is
  // the slot that holds nothing but the phone.
  await page.locator(".proto-phone .v3").screenshot({ path: `${out}/${PHONE[k]}.png` });
  console.log(`  ${PHONE[k].padEnd(10)} tour change ${k + 1}`);
}

await page.setViewportSize({ width: 1280, height: 900 });
await page.goto(`${base}/prototype/manager`, { waitUntil: "load", timeout: 20000 });
await page.addStyleTag({ content: HIDE_DEV_OVERLAY });
await page.waitForTimeout(1600);
await page.screenshot({ path: `${out}/manager.png` });
console.log("  manager    /prototype/manager");

// The deck's opening slide shows one screen as proof the prototype exists. The
// report is the one that carries the argument in a single glance.
await browser.close();

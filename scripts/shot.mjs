// Screenshot runner. Invoked by scripts/shot.sh -- see usage there.
// Playwright is resolved from career-ops, the only project in the workspace that installs it.
import { chromium } from "/Users/yash/Documents/playground/career-ops/node_modules/playwright/index.mjs";

const [port, out, json] = process.argv.slice(2);
const targets = JSON.parse(json);

const browser = await chromium.launch();
for (const [route, label, w, h, full] of targets) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await page.goto(`http://localhost:${port}${route}`, { waitUntil: "load", timeout: 20000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${out}/${label}.png`, fullPage: !!full });
  console.log(`  ${label.padEnd(16)} ${route}`);
  await page.close();
}
await browser.close();

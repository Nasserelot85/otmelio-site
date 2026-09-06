import { readFile, readdir } from "node:fs/promises";

const expectedOrigin = "https://otmelio.com/";
const expectedCheckout = "https://elotmani58.gumroad.com/l/oaglw";
const failures = [];

const read = (path) => readFile(path, "utf8");
const requireMatch = (value, pattern, message) => {
  if (!pattern.test(value)) failures.push(message);
};

const [index, script, robots, sitemap, cname] = await Promise.all([
  read("index.html"),
  read("script.js"),
  read("robots.txt"),
  read("sitemap.xml"),
  read("CNAME"),
]);

if (cname.trim() !== "otmelio.com") failures.push("CNAME must remain otmelio.com.");

requireMatch(index, /<html\s+lang=["']en["']/i, "Homepage must declare English as its language.");
requireMatch(index, /<meta\s+name=["']description["'][^>]+content=["'][^"']+["']/i, "Homepage meta description is missing.");
requireMatch(index, /<link\s+rel=["']canonical["']\s+href=["']https:\/\/otmelio\.com\/["']/i, "Canonical URL is missing or incorrect.");
requireMatch(index, /<meta\s+name=["']google-site-verification["']\s+content=["'][^"']+["']/i, "Search Console verification tag is missing.");
requireMatch(index, /id=["']buy-cck["'][^>]+href=["']https:\/\/elotmani58\.gumroad\.com\/l\/oaglw\?[^"']+["']/i, "CCK-001 CTA must retain the approved Gumroad destination and attribution query.");
requireMatch(index, /"@type"\s*:\s*"Product"/, "Product structured data is missing.");
requireMatch(index, /"price"\s*:\s*"9\.00"/, "Structured product price must remain USD 9.00.");
requireMatch(script, /event:\s*["']cck_cta_click["']/, "CTA event name changed or is missing.");
requireMatch(script, /product_id:\s*["']CCK-001["']/, "CTA product identifier changed or is missing.");
requireMatch(robots, /^User-agent:\s*\*/mi, "robots.txt must address all crawlers.");
requireMatch(robots, /^Allow:\s*\/$/mi, "robots.txt must allow the site root.");
requireMatch(robots, /^Sitemap:\s*https:\/\/otmelio\.com\/sitemap\.xml$/mi, "robots.txt sitemap URL is missing or incorrect.");
requireMatch(sitemap, /<loc>https:\/\/otmelio\.com\/<\/loc>/, "sitemap.xml must contain the canonical homepage.");

const rootEntries = await readdir(".", { withFileTypes: true });
const forbiddenNames = /^(\.env(?:\..+)?|.*\.(?:pem|key|p12|pfx)|credentials?\.json|secrets?\.json)$/i;
for (const entry of rootEntries) {
  if (entry.isFile() && forbiddenNames.test(entry.name)) {
    failures.push(`Potential credential file must not be committed: ${entry.name}`);
  }
}

if (!index.includes(expectedOrigin)) failures.push(`Homepage does not reference ${expectedOrigin}.`);
if (!index.includes(expectedCheckout)) failures.push(`Homepage does not reference ${expectedCheckout}.`);

if (failures.length) {
  console.error("OTMELIO validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("OTMELIO validation passed: deployment, SEO, CTA, and indexing invariants are intact.");

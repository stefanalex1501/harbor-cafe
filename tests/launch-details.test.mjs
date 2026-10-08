import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { formatReviewSummary, googleReviewSummary } from "../app/review-summary.ts";

const html = await readFile(new URL("../public/404.html", import.meta.url), "utf8");
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1]);

function render404({ hostname = "localhost", savedLanguage = null, blockedStorage = false } = {}) {
  const copy = Object.fromEntries(["eyebrow", "title", "description", "home", "menu", "footer"].map((key) => [key, { dataset: { copy: key } }]));
  const element = () => ({ attributes: {}, setAttribute(key, value) { this.attributes[key] = value; } });
  const button = { ...element(), addEventListener(type, callback) { this[type] = callback; } };
  const actions = element();
  const wordmark = element();
  const document = {
    documentElement: {},
    head: { append(base) { document.base = base; } },
    createElement: () => ({}),
    querySelector: (selector) => ({ ".language": button, ".actions": actions, ".wordmark": wordmark })[selector],
    querySelectorAll: () => Object.values(copy),
  };
  const storage = new Map(savedLanguage ? [["harbor-cafe-language", savedLanguage]] : []);
  const context = { document, location: { hostname }, localStorage: {
    getItem(key) { if (blockedStorage) throw new Error("Storage denied"); return storage.get(key) ?? null; },
    setItem(key, value) { if (blockedStorage) throw new Error("Storage denied"); storage.set(key, value); },
  } };
  runInNewContext(scripts.join("\n"), context);
  return { document, button, copy, storage, actions };
}

test("verified Google summary is formatted consistently in both languages", () => {
  assert.equal(googleReviewSummary.rating, 4.9);
  assert.equal(googleReviewSummary.reviewCount, 68);
  assert.equal(googleReviewSummary.verifiedAt, "2026-10-08");
  assert.match(googleReviewSummary.sourceUrl, /maps\/place\/Harbor\+Cafe/);
  assert.deepEqual(formatReviewSummary("ro"), { score: "4,9 pe Google", count: "68 de recenzii", date: "8 octombrie 2026" });
  assert.deepEqual(formatReviewSummary("en"), { score: "4.9 on Google", count: "68 reviews", date: "8 October 2026" });
});

test("404 page is copied unchanged to the GitHub Pages publishing root", async () => {
  assert.equal(await readFile(new URL("../dist-pages/404.html", import.meta.url), "utf8"), html);
  assert.match(html, /name="robots" content="noindex"/);
  assert.match(html, /href="\.\/#menu"/);
  assert.match(html, /href="\.\/"/);
  assert.match(html, /prefers-reduced-motion: reduce/);
});

test("404 assets and return links resolve at the correct site root, including nested missing URLs", () => {
  for (const [hostname, base] of [["stefanalex1501.github.io", "/harbor-cafe/"], ["harborcafe.ro", "/"], ["localhost", "/"]]) {
    const page = render404({ hostname });
    assert.equal(page.document.base.href, base);
    const origin = `https://${hostname}`;
    const baseURL = new URL(base, `${origin}/does/not/exist`);
    assert.equal(new URL("./#menu", baseURL).href, `${origin}${base}#menu`);
    assert.equal(new URL("harbor-cafe-round-512.png", baseURL).href, `${origin}${base}harbor-cafe-round-512.png`);
  }
});

test("404 respects, toggles and saves the selected language", () => {
  const page = render404({ savedLanguage: "en" });
  assert.equal(page.document.documentElement.lang, "en");
  assert.equal(page.copy.menu.textContent, "Discover the menu");
  assert.equal(page.button.textContent, "RO");
  page.button.click();
  assert.equal(page.document.documentElement.lang, "ro");
  assert.equal(page.storage.get("harbor-cafe-language"), "ro");
  assert.equal(page.copy.menu.textContent, "Descoperă meniul");
});

test("404 works when browser storage is unavailable or contains an invalid language", () => {
  for (const options of [{ blockedStorage: true }, { savedLanguage: "invalid" }]) {
    const page = render404(options);
    assert.equal(page.document.documentElement.lang, "ro");
    page.button.click();
    assert.equal(page.document.documentElement.lang, "en");
  }
});

test("visiting a 404 does not overwrite the cached offline homepage", async () => {
  const source = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");
  const handlers = {};
  const root = "https://stefanalex1501.github.io/harbor-cafe/";
  const writes = [];
  let response;
  runInNewContext(source, {
    URL,
    self: { location: { href: `${root}sw.js`, origin: new URL(root).origin }, addEventListener(type, callback) { handlers[type] = callback; } },
    caches: { open: async () => ({ put: async (url) => { writes.push(url); } }) },
    fetch: async () => response,
  });
  for (const [url, status] of [[`${root}missing/nested`, 404], [`${root}404.html`, 200], [root, 200], [`${root}index.html`, 200]]) {
    response = new Response("page", { status });
    const tasks = [];
    let result;
    handlers.fetch({ request: { url, method: "GET", mode: "navigate" }, respondWith(promise) { result = promise; }, waitUntil(promise) { tasks.push(promise); } });
    assert.equal((await result).status, status);
    await Promise.all(tasks);
  }
  assert.deepEqual(writes, [root, root]);
});

import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Harbor Cafe homepage and visit details", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Harbor Cafe — Cafea bună\. Ritm domol\.<\/title>/i);
  assert.match(html, /Bulevardul Alexandru Ioan Cuza 13, 011051 București/);
  assert.match(html, /<dt>Luni<\/dt><dd>07:00–17:00<\/dd>/);
  assert.match(html, /<dt>Duminică<\/dt><dd>Închis<\/dd>/);
  assert.match(html, /google\.com\/maps\?q=/);
  assert.match(html, /instagram\.com\/harborcafe\.bucuresti/);
  assert.match(html, /\/gallery\/latte-art-pour\.jpg/);
  assert.match(html, /<span class="item-price">14 RON<\/span>/);
  assert.match(html, /aria-controls="story-detail-0"/);
  assert.match(html, /class="mobile-quickbar"/);
  assert.match(html, /aria-haspopup="dialog"/);
  assert.match(html, /class="desktop-navigation"/);
  assert.match(html, /desktop-opening-status/);
  assert.match(html, /aria-current="location"/);
  assert.match(html, /Copiază adresa/);
  assert.match(html, /latte-art-pour-480\.jpg 480w/);
  assert.match(html, /cafea de specialitate prăjită de MABÓ în București/);
  assert.match(html, /aria-controls="food-information-panel"/);
  assert.match(html, /aria-controls="menu-panel"/);
  assert.match(html, /aria-labelledby="menu-tab-coffee"/);
  assert.match(html, /Opțiune vegetală/);
  assert.match(html, /confirmă întotdeauna cu barista/);
  assert.ok(html.indexOf('id="visit"') < html.indexOf('id="gallery"'));
  assert.doesNotMatch(html, /va fi anunțat|to be announced/i);
});

test("keeps the project detached from Sites hosting", async () => {
  const [page, viteConfig, index] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../vite.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
  ]);

  assert.match(page, /mapsEmbedUrl/);
  assert.match(page, /@harborcafe\.bucuresti/);
  assert.match(index, /viewport-fit=cover/);
  assert.match(index, /name="theme-color" content="#051d2d"/);
  assert.match(index, /rel="manifest" href="\.\/manifest\.webmanifest"/);
  assert.match(page, /navigator\.serviceWorker\.register\(assetUrl\("sw\.js"\)\)/);
  assert.doesNotMatch(viteConfig, /sites-vite-plugin|hosting\.json|sites\(\)/);
  await Promise.all([
    access(new URL("../public/manifest.webmanifest", import.meta.url)),
    access(new URL("../public/sw.js", import.meta.url)),
    access(new URL("../public/icon-192.png", import.meta.url)),
    access(new URL("../public/icon-512.png", import.meta.url)),
    access(new URL("../public/apple-touch-icon.png", import.meta.url)),
  ]);
  await assert.rejects(access(new URL("../.openai/hosting.json", import.meta.url)));
});

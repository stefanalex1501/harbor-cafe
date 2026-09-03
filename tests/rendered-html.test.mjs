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
  assert.match(html, /Cuvinte lăsate/);
  assert.match(html, /O cafenea super cozy/);
  assert.match(html, /Cappuccino-ul a fost foarte bun/);
  assert.match(html, /Miriam 18/);
  assert.match(html, /Deschide recenzia/);
  assert.match(html, /Recenzie publicată pe Google/);
  assert.match(html, /Vezi toate recenziile pe Google Maps/);
  assert.match(html, /4,9 pe Google/);
  assert.match(html, /67 de recenzii/);
  assert.match(html, /Arată alte recenzii/);
  assert.match(html, /type="image\/avif"/);
  assert.match(html, /type="image\/webp"/);
  assert.match(html, /href="#reviews"/);
  assert.ok(html.indexOf('id="menu"') < html.indexOf('id="reviews"'));
  assert.ok(html.indexOf('id="reviews"') < html.indexOf('id="visit"'));
  assert.ok(html.indexOf('id="visit"') < html.indexOf('id="gallery"'));
  assert.doesNotMatch(html, /va fi anunțat|to be announced/i);
});

test("keeps the project detached from Sites hosting", async () => {
  const [page, styles, viteConfig, index] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../vite.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
  ]);

  assert.match(page, /mapsEmbedUrl/);
  assert.match(page, /@harborcafe\.bucuresti/);
  assert.match(index, /viewport-fit=cover/);
  assert.match(index, /name="theme-color" content="#051d2d"/);
  assert.match(index, /rel="manifest" href="\.\/manifest\.webmanifest"/);
  assert.match(index, /rel="icon" type="image\/png" sizes="192x192" href="\.\/harbor-cafe-round-192\.png"/);
  assert.match(index, /rel="apple-touch-icon" sizes="180x180" href="\.\/harbor-cafe-round-180\.png"/);
  assert.match(index, /rel="canonical" href="https:\/\/stefanalex1501\.github\.io\/harbor-cafe\/"/);
  assert.match(index, /"@type": "CafeOrCoffeeShop"/);
  assert.match(index, /"acceptsReservations": false/);
  assert.match(page, /navigator\.serviceWorker\.register\(assetUrl\("sw\.js"\)\)/);
  assert.match(page, /maps\.app\.goo\.gl\/T3QEAoutTwmY8DQp6/);
  assert.match(page, /maps\.app\.goo\.gl\/QAcQhoQasSwsH5qH6/);
  assert.match(page, /pickRandomReviews/);
  assert.match(page, /google\.com\/maps\/place\/Harbor\+Cafe/);
  assert.match(page, /scrollToSection/);
  assert.match(page, /window\.scrollTo/);
  assert.match(page, /showOtherReviewSelection/);
  assert.match(styles, /\.menu-tabs \{ position: sticky; top: 0;/);
  assert.match(styles, /\.story-image-wrap picture \{ height: 100%; \}/);
  assert.doesNotMatch(viteConfig, /sites-vite-plugin|hosting\.json|sites\(\)/);
  await Promise.all([
    access(new URL("../public/manifest.webmanifest", import.meta.url)),
    access(new URL("../public/sw.js", import.meta.url)),
    access(new URL("../public/harbor-cafe-round-192.png", import.meta.url)),
    access(new URL("../public/harbor-cafe-round-512.png", import.meta.url)),
    access(new URL("../public/harbor-cafe-round-180.png", import.meta.url)),
    access(new URL("../public/gallery/latte-art-pour-480.avif", import.meta.url)),
    access(new URL("../public/gallery/latte-art-pour-480.webp", import.meta.url)),
    access(new URL("../public/icon-192.png", import.meta.url)),
    access(new URL("../public/icon-512.png", import.meta.url)),
    access(new URL("../public/apple-touch-icon.png", import.meta.url)),
  ]);
  await assert.rejects(access(new URL("../.openai/hosting.json", import.meta.url)));
});

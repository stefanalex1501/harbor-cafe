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
  assert.match(html, /\/gallery\/cafe-counter\.jpg/);
  assert.doesNotMatch(html, /va fi anunțat|to be announced/i);
});

test("keeps the project detached from Sites hosting", async () => {
  const [page, viteConfig] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../vite.config.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /mapsEmbedUrl/);
  assert.match(page, /@harborcafe\.bucuresti/);
  assert.doesNotMatch(viteConfig, /sites-vite-plugin|hosting\.json|sites\(\)/);
  await assert.rejects(access(new URL("../.openai/hosting.json", import.meta.url)));
});

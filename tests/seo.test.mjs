import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const root = "https://harborcafe.ro/";

test("Pages build declares the custom domain consistently for search and sharing", async () => {
  const index = await read("../dist-pages/index.html");
  assert.match(index, /<title>Harbor Cafe București — Cafea de specialitate<\/title>/);
  assert.match(index, /rel="canonical" href="https:\/\/harborcafe\.ro\/"/);
  assert.match(index, /property="og:url" content="https:\/\/harborcafe\.ro\/"/);
  assert.match(index, /property="og:image" content="https:\/\/harborcafe\.ro\/og\.png"/);
  assert.doesNotMatch(index, /stefanalex1501\.github\.io|\bnoindex\b/);

  const json = JSON.parse(index.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1]);
  assert.equal(json.url, root);
  assert.equal(json["@id"], `${root}#cafe`);
  assert.equal(json.hasMenu, `${root}#menu`);
  assert.equal(json.logo, `${root}harbor-cafe-round-512.png`);
  assert.equal(json.address.addressLocality, "București");
});

test("published robots and sitemap allow discovery of the single canonical page", async () => {
  const [robots, sitemap] = await Promise.all([
    read("../dist-pages/robots.txt"),
    read("../dist-pages/sitemap.xml"),
  ]);
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, /^Sitemap: https:\/\/harborcafe\.ro\/sitemap\.xml$/m);
  assert.doesNotMatch(robots, /^Disallow: \/\s*$/m);
  assert.match(sitemap, /xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
  assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]), [root]);
});

test("SSR metadata uses the same custom domain as GitHub Pages", async () => {
  const layout = await read("../app/layout.tsx");
  assert.match(layout, /const siteUrl = "https:\/\/harborcafe\.ro\/"/);
  assert.match(layout, /alternates: \{ canonical: siteUrl \}/);
  assert.doesNotMatch(layout, /stefanalex1501\.github\.io/);
});

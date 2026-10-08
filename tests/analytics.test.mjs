import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const source = await read("../public/analytics.js");

function run(url, existing = false) {
  const appended = [];
  const context = vm.createContext({
    window: { location: new URL(url) },
    document: {
      querySelector: () => existing || appended.length > 0,
      createElement: () => ({ dataset: {} }),
      body: { appendChild: (element) => appended.push(element) },
    },
  });
  vm.runInContext(source, context);
  return { appended, context };
}

test("Cloudflare analytics loads only on the public HTTPS domains", () => {
  for (const url of ["https://harborcafe.ro/", "https://www.harborcafe.ro/"]) {
    const { appended } = run(url);
    assert.equal(appended.length, 1);
    assert.equal(appended[0].type, "module");
    assert.equal(appended[0].src, "https://static.cloudflareinsights.com/beacon.min.js");
    assert.deepEqual(JSON.parse(appended[0].dataset.cfBeacon), {
      token: "eb225d3fa9164ca89c18e4958a79494e",
      spa: false,
    });
  }
  for (const url of ["http://localhost:3000/", "https://localhost/", "http://127.0.0.1:3000/", "http://harborcafe.ro/", "https://stefanalex1501.github.io/harbor-cafe/", "https://harborcafe.ro.example.com/"]) {
    assert.equal(run(url).appended.length, 0, url);
  }
});

test("analytics avoids duplicate beacons, including automatically injected ones", () => {
  assert.equal(run("https://harborcafe.ro/", true).appended.length, 0);
  const { appended, context } = run("https://harborcafe.ro/");
  vm.runInContext(source, context);
  assert.equal(appended.length, 1);
});

test("both published and SSR entry points load the same non-blocking analytics setup", async () => {
  const [index, layout, published] = await Promise.all([
    read("../dist-pages/index.html"),
    read("../app/layout.tsx"),
    read("../dist-pages/analytics.js"),
  ]);
  assert.match(index, /<script type="module" src="\.\/analytics\.js"><\/script>/);
  assert.match(layout, /<script type="module" defer src="\/analytics\.js" \/>/);
  assert.equal(published, source);
  assert.doesNotMatch(index, /static\.cloudflareinsights\.com\/beacon\.min\.js/);
});

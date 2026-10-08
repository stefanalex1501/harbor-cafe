import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";

const source = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");
const root = "https://stefanalex1501.github.io/harbor-cafe/";

function worker({ offline = false, status = 200, cached = "old image" } = {}) {
  const handlers = {};
  const deleted = [];
  const writes = [];
  const fetches = [];
  const storage = {
    match: async () => cached === null ? undefined : new Response(cached),
    put: async (request, response) => writes.push({ url: request.url ?? request, text: await response.text() }),
  };
  runInNewContext(source, {
    URL,
    self: { location: { href: `${root}sw.js`, origin: new URL(root).origin }, clients: { claim: async () => {} }, addEventListener: (type, handler) => { handlers[type] = handler; } },
    caches: {
      keys: async () => ["harbor-cafe-v1", "harbor-cafe-v2", "harbor-cafe-v3", "other-project-offline"],
      open: async () => storage,
      delete: async (name) => { deleted.push(name); },
    },
    fetch: async (request, options) => {
      fetches.push({ request, options });
      if (offline) throw new Error("Offline");
      return new Response("updated image", { status });
    },
  });
  return {
    deleted, writes, fetches,
    async activate() {
      let task;
      handlers.activate({ waitUntil(promise) { task = promise; } });
      await task;
    },
    async request(path, mode = "cors") {
      const tasks = [];
      let result;
      handlers.fetch({ request: { url: `${root}${path}`, method: "GET", mode }, respondWith(promise) { result = promise; }, waitUntil(promise) { tasks.push(promise); } });
      const response = await result;
      await Promise.all(tasks);
      return response;
    },
  };
}

test("activation removes only obsolete Harbor Cafe caches", async () => {
  const env = worker();
  await env.activate();
  assert.deepEqual(env.deleted, ["harbor-cafe-v1", "harbor-cafe-v2"]);
});

test("mutable photos and logos revalidate online and update the cache", async () => {
  for (const path of ["harbor-cafe-logo.png", "gallery/latte-art-pour.jpg", "manifest.webmanifest"]) {
    const env = worker();
    assert.equal(await (await env.request(path)).text(), "updated image");
    assert.equal(env.fetches[0].options.cache, "no-cache");
    assert.deepEqual(env.writes, [{ url: `${root}${path}`, text: "updated image" }]);
  }
});

test("offline images and homepage use only this worker's cache", async () => {
  const env = worker({ offline: true });
  assert.equal(await (await env.request("gallery/latte-art-pour.jpg")).text(), "old image");
  assert.equal(await (await env.request("", "navigate")).text(), "old image");
  assert.equal(env.writes.length, 0);
});

test("fingerprinted bundles remain cache-first", async () => {
  const env = worker();
  assert.equal(await (await env.request("assets/index-aBcD1234.js")).text(), "old image");
  assert.equal(env.fetches.length, 0);
});

test("missing cached bundles are fetched and their writes are awaited", async () => {
  const env = worker({ cached: null });
  assert.equal(await (await env.request("assets/index-aBcD1234.css")).text(), "updated image");
  assert.equal(env.writes.length, 1);
});

test("404 assets never replace a valid cache entry", async () => {
  const env = worker({ status: 404 });
  assert.equal((await env.request("gallery/missing.jpg")).status, 404);
  assert.equal(env.writes.length, 0);
});

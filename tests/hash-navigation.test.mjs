import assert from "node:assert/strict";
import test from "node:test";
import { observeHashNavigation } from "../app/hash-navigation.ts";

function browser(t, { hash = "#menu", loading = false } = {}) {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const viewport = new EventTarget();
  const frames = new Map();
  const calls = [];
  const ids = [];
  let frame = 0;
  Object.assign(viewport, {
    location: { hash }, scrollY: 200,
    scrollTo: (options) => calls.push(options),
    requestAnimationFrame(callback) { frames.set(++frame, callback); return frame; },
    cancelAnimationFrame(id) { frames.delete(id); },
  });
  const document = {
    readyState: loading ? "loading" : "complete",
    fonts: { ready: Promise.resolve() },
    getElementById: (id) => ["menu", "top", "reviews", "opening-hours"].includes(id) ? { getBoundingClientRect: () => ({ top: 800 }) } : null,
  };
  Object.defineProperty(globalThis, "window", { configurable: true, value: viewport });
  Object.defineProperty(globalThis, "document", { configurable: true, value: document });
  const stop = observeHashNavigation((id) => ids.push(id));
  t.after(() => {
    stop();
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else delete globalThis.window;
    if (originalDocument) Object.defineProperty(globalThis, "document", originalDocument);
    else delete globalThis.document;
  });
  return {
    viewport, document, calls, ids, stop,
    emit: (name) => viewport.dispatchEvent(new Event(name)),
    async flush() {
      await Promise.resolve();
      for (const [id, callback] of frames) { frames.delete(id); callback(); }
    },
  };
}

test("direct menu link aligns the section after React has mounted", async (t) => {
  const env = browser(t);
  await env.flush();
  assert.deepEqual(env.calls, [{ top: 1000, behavior: "instant" }]);
  assert.deepEqual(env.ids, ["menu"]);
});

test("initial anchor waits for load and fonts", async (t) => {
  const env = browser(t, { loading: true, hash: "#reviews" });
  await env.flush();
  assert.equal(env.calls.length, 0);
  env.emit("load");
  await env.flush();
  assert.deepEqual(env.ids, ["reviews"]);
});

test("visitor interaction cancels even an already queued initial alignment", async (t) => {
  const env = browser(t);
  await Promise.resolve();
  env.emit("wheel");
  await env.flush();
  assert.equal(env.calls.length, 0);
});

test("hash changes still work after manual interaction", async (t) => {
  const env = browser(t);
  env.emit("pointerdown");
  env.viewport.location.hash = "#opening-hours";
  env.emit("hashchange");
  await env.flush();
  assert.deepEqual(env.ids, ["opening-hours"]);
});

test("empty, unknown and malformed anchors preserve the current scroll position", async (t) => {
  const env = browser(t, { hash: "" });
  await env.flush();
  for (const hash of ["#missing", "#%broken"]) {
    env.viewport.location.hash = hash;
    env.emit("hashchange");
    await env.flush();
  }
  assert.equal(env.calls.length, 0);
});

test("top anchor returns to zero and cleanup prevents delayed scrolling", async (t) => {
  const env = browser(t, { hash: "#top" });
  await env.flush();
  assert.equal(env.calls[0].top, 0);
  env.viewport.location.hash = "#menu";
  env.emit("hashchange");
  env.stop();
  await env.flush();
  assert.equal(env.calls.length, 1);
});

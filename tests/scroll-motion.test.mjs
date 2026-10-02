import assert from "node:assert/strict";
import test from "node:test";
import { animateScrollTo } from "../app/scroll-motion.ts";

function browser(t, { reduced = false, height = 800, pageHeight = 8000, start = 5000 } = {}) {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const viewport = new EventTarget();
  const motion = new EventTarget();
  const timers = new Map();
  const calls = [];
  let timerId = 0;
  let now = 0;
  Object.assign(motion, { matches: reduced });
  Object.assign(viewport, {
    scrollY: start, innerWidth: 390, innerHeight: height,
    matchMedia: () => motion,
    scrollTo: (options) => {
      calls.push(options);
      if (options.behavior === "instant") viewport.scrollY = options.top;
    },
    setTimeout: (callback, delay) => {
      timers.set(++timerId, { callback, due: now + delay });
      return timerId;
    },
    clearTimeout: (id) => timers.delete(id),
    requestAnimationFrame: () => { throw new Error("Scrolling must not be driven by a JS frame loop"); },
  });
  Object.defineProperty(globalThis, "window", { configurable: true, value: viewport });
  Object.defineProperty(globalThis, "document", { configurable: true, value: { documentElement: { scrollHeight: pageHeight } } });
  t.after(() => {
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else delete globalThis.window;
    if (originalDocument) Object.defineProperty(globalThis, "document", originalDocument);
    else delete globalThis.document;
  });
  return {
    viewport, motion, calls, timers,
    emit: (name) => viewport.dispatchEvent(new Event(name)),
    advance: (milliseconds) => {
      now += milliseconds;
      for (const [id, timer] of [...timers]) {
        if (timer.due <= now) { timers.delete(id); timer.callback(); }
      }
    },
  };
}

test("long return to menu measures once and uses a single native smooth scroll", (t) => {
  const env = browser(t);
  let measurements = 0;
  let settled = 0;
  const cancel = animateScrollTo(() => { measurements++; return 1400; }, () => settled++);
  assert.deepEqual(env.calls, [{ top: 1400, behavior: "smooth" }]);
  for (const y of [4900, 4600, 3800, 2900, 1900, 1400]) {
    env.viewport.scrollY = y;
    env.emit("scroll");
  }
  env.emit("scrollend");
  assert.equal(measurements, 1);
  assert.equal(env.calls.length, 1);
  assert.equal(settled, 1);
  assert.equal(env.timers.size, 0);
  cancel();
  env.emit("wheel");
  assert.equal(settled, 1);
  assert.equal(env.calls.length, 1);
});

test("manual interaction stops at the current position without jumping to the target", (t) => {
  const env = browser(t);
  let settled = 0;
  animateScrollTo(() => 1000, () => settled++);
  env.viewport.scrollY = 3500;
  env.emit("touchstart");
  assert.deepEqual(env.calls.at(-1), { top: 3500, behavior: "instant" });
  assert.equal(settled, 1);
  assert.equal(env.timers.size, 0);
});

test("a new navigation click cancels the old animation before starting the next", (t) => {
  const env = browser(t);
  let settled = 0;
  const cancel = animateScrollTo(() => 1000, () => settled++);
  env.viewport.scrollY = 3000;
  cancel();
  animateScrollTo(() => 6500, () => settled++);
  assert.deepEqual(env.calls, [
    { top: 1000, behavior: "smooth" },
    { top: 3000, behavior: "instant" },
    { top: 6500, behavior: "smooth" },
  ]);
  env.viewport.scrollY = 6500;
  env.emit("scrollend");
  assert.equal(settled, 2);
  assert.equal(env.timers.size, 0);
});

test("keyboard input interrupts and changing reduced-motion preference stops animation", (t) => {
  const env = browser(t);
  let settled = 0;
  animateScrollTo(() => 1000, () => settled++);
  const key = new Event("keydown");
  Object.defineProperty(key, "key", { value: "ArrowDown" });
  env.viewport.dispatchEvent(key);
  assert.equal(settled, 1);
  animateScrollTo(() => 1000, () => settled++);
  env.motion.matches = true;
  env.motion.dispatchEvent(new Event("change"));
  assert.equal(settled, 2);
  assert.equal(env.timers.size, 0);
});

test("iPhone toolbar height changes do not interrupt, orientation changes do", (t) => {
  const env = browser(t);
  let settled = 0;
  animateScrollTo(() => 1000, () => settled++);
  env.viewport.innerHeight = 860;
  env.emit("resize");
  assert.equal(settled, 0);
  assert.equal(env.calls.length, 1);
  env.viewport.innerWidth = 844;
  env.emit("resize");
  assert.equal(settled, 1);
});

test("a queued old scrollend cannot finish a new journey", (t) => {
  const env = browser(t);
  let settled = 0;
  animateScrollTo(() => 1000, () => settled++);
  env.emit("scrollend");
  assert.equal(settled, 0);
  env.viewport.scrollY = 1000;
  env.emit("scrollend");
  assert.equal(settled, 1);
});

test("browsers without scrollend settle after scrolling stops, with no corrective jump", (t) => {
  const env = browser(t);
  let settled = 0;
  animateScrollTo(() => 1000, () => settled++);
  env.viewport.scrollY = 4000;
  env.emit("scroll");
  env.advance(100);
  assert.equal(settled, 0);
  env.viewport.scrollY = 1000;
  env.emit("scroll");
  env.advance(179);
  assert.equal(settled, 0);
  env.advance(1);
  assert.equal(settled, 1);
  assert.equal(env.calls.length, 1);
  assert.equal(env.timers.size, 0);
});

test("reduced motion respects accessibility and clamps the target to the page", (t) => {
  const env = browser(t, { reduced: true, pageHeight: 2000, height: 800 });
  let settled = 0;
  animateScrollTo(() => 9000, () => settled++);
  assert.deepEqual(env.calls, [{ top: 1200, behavior: "instant" }]);
  assert.equal(settled, 1);
  assert.equal(env.timers.size, 0);
});

test("a page shorter than the viewport clamps to zero rather than a negative position", (t) => {
  const env = browser(t, { pageHeight: 600, height: 800, start: 0 });
  animateScrollTo(() => 1000);
  assert.deepEqual(env.calls, [{ top: 0, behavior: "instant" }]);
});

test("abandoned background scroll releases navigation state without forcing a jump", (t) => {
  const env = browser(t);
  let settled = 0;
  animateScrollTo(() => 1000, () => settled++);
  env.advance(4000);
  assert.equal(settled, 1);
  assert.equal(env.calls.length, 1);
  assert.equal(env.timers.size, 0);
});

/** One interruptible, time-based scroll instead of competing browser animations. */
export function animateScrollTo(getDestination: () => number, onSettled: () => void = () => {}) {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const start = window.scrollY;
  const destination = () => Math.max(0, Math.min(getDestination(), document.documentElement.scrollHeight - window.innerHeight));
  const distance = Math.abs(destination() - start);
  let frame = 0;
  let finished = false;
  const scrollKeys = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Escape", "Tab"]);
  const cancel = () => {
    if (finished) return;
    finished = true;
    window.cancelAnimationFrame(frame);
    window.removeEventListener("wheel", cancel);
    window.removeEventListener("touchstart", cancel);
    window.removeEventListener("pointerdown", cancel);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("resize", cancel);
    motion.removeEventListener("change", cancel);
    onSettled();
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (scrollKeys.has(event.key)) cancel();
  };
  if (motion.matches || distance < 2) {
    window.scrollTo({ top: destination(), behavior: "instant" });
    cancel();
    return cancel;
  }
  // Short trips remain gentle; long journeys never become a drawn-out wait.
  const duration = Math.min(1900, 650 + Math.sqrt(distance) * 12);
  const startedAt = performance.now();
  const step = (now: number) => {
    if (finished) return;
    const progress = Math.min(1, Math.max(0, (now - startedAt) / duration));
    const eased = progress * progress * (3 - 2 * progress);
    window.scrollTo({ top: start + (destination() - start) * eased, behavior: "instant" });
    if (progress < 1) frame = window.requestAnimationFrame(step);
    else cancel();
  };
  window.addEventListener("wheel", cancel, { passive: true });
  window.addEventListener("touchstart", cancel, { passive: true });
  window.addEventListener("pointerdown", cancel, { passive: true });
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("resize", cancel);
  motion.addEventListener("change", cancel);
  frame = window.requestAnimationFrame(step);
  return cancel;
}

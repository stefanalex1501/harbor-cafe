/** Let the browser animate scrolling; JS only handles completion/interruption. */
export function animateScrollTo(getDestination: () => number, onSettled: () => void = () => {}) {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  // Measure once, before scrolling. Reading layout and writing scroll position
  // every frame made long journeys compete with image decoding and text reveals.
  const destination = Math.max(0, Math.min(getDestination(), Math.max(0, document.documentElement.scrollHeight - window.innerHeight)));
  const distance = Math.abs(destination - window.scrollY);
  const initialWidth = window.innerWidth;
  let settleTimer = 0;
  let deadlineTimer = 0;
  let finished = false;
  const scrollKeys = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Escape", "Tab"]);
  const finish = () => {
    if (finished) return;
    finished = true;
    window.clearTimeout(settleTimer);
    window.clearTimeout(deadlineTimer);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("scrollend", onScrollEnd);
    window.removeEventListener("wheel", cancel);
    window.removeEventListener("touchstart", cancel);
    window.removeEventListener("pointerdown", cancel);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("resize", onResize);
    motion.removeEventListener("change", cancel);
    onSettled();
  };
  const cancel = () => {
    if (finished) return;
    // Stop the native animation too, so a new click/manual gesture takes over.
    window.scrollTo({ top: window.scrollY, behavior: "instant" });
    finish();
  };
  const onScroll = () => {
    window.clearTimeout(settleTimer);
    // Fallback for browsers without scrollend; never snap to the destination.
    settleTimer = window.setTimeout(finish, 180);
  };
  const onScrollEnd = () => {
    // Ignore a queued scrollend from the journey that was just interrupted.
    if (Math.abs(window.scrollY - destination) < 2) finish();
  };
  const onResize = () => {
    // iOS changes the viewport height as its toolbar folds during scrolling.
    // That is not a user interruption; a width change/orientation change is.
    if (window.innerWidth !== initialWidth) cancel();
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (scrollKeys.has(event.key)) cancel();
  };
  if (motion.matches || distance < 2) {
    window.scrollTo({ top: destination, behavior: "instant" });
    finish();
    return cancel;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("scrollend", onScrollEnd);
  window.addEventListener("wheel", cancel, { passive: true });
  window.addEventListener("touchstart", cancel, { passive: true });
  window.addEventListener("pointerdown", cancel, { passive: true });
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("resize", onResize);
  motion.addEventListener("change", cancel);
  // Release navigation state even if a background tab never emits scrollend.
  deadlineTimer = window.setTimeout(finish, 4000);
  window.scrollTo({ top: destination, behavior: "smooth" });
  return cancel;
}

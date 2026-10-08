// React mounts the sections after the browser's initial anchor lookup.
// Align again once fonts and initial assets have settled, unless the visitor
// has already interacted. Ordinary refreshes without a hash keep their position.
export function observeHashNavigation(onNavigate: (id: string) => void) {
  let disposed = false;
  let initialPending = true;
  let frame = 0;
  const interactionEvents = ["pointerdown", "touchstart", "wheel", "keydown"] as const;
  const stopInitial = () => { initialPending = false; };
  const align = () => {
    let id: string;
    try { id = decodeURIComponent(window.location.hash.slice(1)); }
    catch { return; }
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    onNavigate(id);
    window.scrollTo({ top: id === "top" ? 0 : window.scrollY + target.getBoundingClientRect().top, behavior: "instant" });
  };
  const schedule = (requireInitial = false) => {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(() => {
      if (!disposed && (!requireInitial || initialPending)) align();
    });
  };
  const initial = () => {
    void Promise.resolve(document.fonts?.ready).then(() => {
      if (!disposed && initialPending) schedule(true);
    });
  };
  const hashChanged = () => {
    stopInitial();
    schedule();
  };
  interactionEvents.forEach((event) => window.addEventListener(event, stopInitial, { passive: true }));
  window.addEventListener("hashchange", hashChanged);
  if (document.readyState === "complete") initial();
  else window.addEventListener("load", initial, { once: true });
  return () => {
    disposed = true;
    window.cancelAnimationFrame(frame);
    window.removeEventListener("load", initial);
    window.removeEventListener("hashchange", hashChanged);
    interactionEvents.forEach((event) => window.removeEventListener(event, stopInitial));
  };
}

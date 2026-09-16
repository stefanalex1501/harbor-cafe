"use client";

import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type DismissSheet = (afterClose?: () => void) => void;

function SheetContent({ render, dismiss }: { render: (dismiss: DismissSheet) => ReactNode; dismiss: DismissSheet }) {
  return render(dismiss);
}

export function MobileSheet({ title, closeLabel, onClose, children }: {
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: (dismiss: DismissSheet) => ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<number | null>(null);
  const [closing, setClosing] = useState(false);
  const dismiss = useCallback<DismissSheet>((afterClose) => {
    if (timerRef.current !== null) return;
    setClosing(true);
    const finish = () => {
      onClose();
      // Let the body unlock before starting a section transition.
      if (afterClose) window.requestAnimationFrame(afterClose);
    };
    timerRef.current = window.setTimeout(finish, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 260);
  }, [onClose]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const bodyStyle = document.body.style;
    const savedStyles = ["position", "top", "left", "width", "overflow"].map((name) => ({ name, value: bodyStyle.getPropertyValue(name), priority: bodyStyle.getPropertyPriority(name) }));
    // Freeze the page in place on iOS without invoking native dialog layout or
    // autofocus. The portal is a direct body child, outside animated sections.
    bodyStyle.position = "fixed";
    bodyStyle.top = `${-scrollY}px`;
    bodyStyle.left = `${-scrollX}px`;
    bodyStyle.width = "100%";
    bodyStyle.overflow = "hidden";
    const background = Array.from(document.body.children).filter((node): node is HTMLElement => node instanceof HTMLElement && node !== dialog);
    const savedInert = background.map((node) => ({ node, inert: node.inert }));
    background.forEach((node) => { node.inert = true; });
    delete dialog.dataset.sheetReady;
    closeRef.current?.focus({ preventScroll: true });
    dialog.dataset.sheetReady = "true";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
      }
      if (event.key !== "Tab") return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>(".mobile-sheet-panel button:not([disabled]), .mobile-sheet-panel a[href]")).filter((node) => node.getClientRects().length > 0);
      const first = controls[0];
      const last = controls.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    const desktop = window.matchMedia("(min-width: 761px)");
    const onResize = () => { if (desktop.matches) onClose(); };
    desktop.addEventListener("change", onResize);
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      document.removeEventListener("keydown", handleKeyDown);
      desktop.removeEventListener("change", onResize);
      delete dialog.dataset.sheetReady;
      savedInert.forEach(({ node, inert }) => { node.inert = inert; });
      savedStyles.forEach(({ name, value, priority }) => {
        if (value) bodyStyle.setProperty(name, value, priority);
        else bodyStyle.removeProperty(name);
      });
      window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [onClose, dismiss]);

  if (typeof document === "undefined") return null;
  return createPortal(<div ref={dialogRef} role="dialog" aria-modal="true" className={`mobile-sheet ${closing ? "is-closing" : ""}`} aria-labelledby="mobile-sheet-title">
    <button className="mobile-sheet-dismiss" type="button" aria-label={closeLabel} tabIndex={-1} onClick={() => dismiss()} />
    <div className="mobile-sheet-panel">
      <div className="mobile-sheet-handle" aria-hidden="true" />
      <header className="mobile-sheet-heading"><div><span>Harbor Cafe</span><h2 id="mobile-sheet-title">{title}</h2></div><button ref={closeRef} type="button" className="mobile-sheet-close" aria-label={closeLabel} onClick={() => dismiss()}>×</button></header>
      <SheetContent render={children} dismiss={dismiss} />
    </div>
  </div>, document.body);
}

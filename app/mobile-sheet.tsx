"use client";

import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";

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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<number | null>(null);
  const [closing, setClosing] = useState(false);
  const dismiss = useCallback<DismissSheet>((afterClose) => {
    if (timerRef.current !== null) return;
    setClosing(true);
    const finish = () => {
      dialogRef.current?.close();
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
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Native dialog autofocus must run at the final layout position. Focusing
    // a translated panel can scroll the dialog itself, notably on iOS Safari.
    delete dialog.dataset.sheetReady;
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    dialog.scrollTop = 0;
    dialog.dataset.sheetReady = "true";
    const desktop = window.matchMedia("(min-width: 761px)");
    const onResize = () => { if (desktop.matches) onClose(); };
    desktop.addEventListener("change", onResize);
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      desktop.removeEventListener("change", onResize);
      dialog.close();
      delete dialog.dataset.sheetReady;
      document.body.style.overflow = overflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [onClose]);

  return <dialog ref={dialogRef} className={`mobile-sheet ${closing ? "is-closing" : ""}`} aria-labelledby="mobile-sheet-title" onCancel={(event) => { event.preventDefault(); dismiss(); }}>
    <button className="mobile-sheet-dismiss" type="button" aria-label={closeLabel} tabIndex={-1} onClick={() => dismiss()} />
    <div className="mobile-sheet-panel">
      <div className="mobile-sheet-handle" aria-hidden="true" />
      <header className="mobile-sheet-heading"><div><span>Harbor Cafe</span><h2 id="mobile-sheet-title">{title}</h2></div><button ref={closeRef} type="button" className="mobile-sheet-close" aria-label={closeLabel} onClick={() => dismiss()}>×</button></header>
      <SheetContent render={children} dismiss={dismiss} />
    </div>
  </dialog>;
}

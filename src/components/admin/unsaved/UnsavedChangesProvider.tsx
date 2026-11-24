"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminConfirmDialog from "../ui/AdminConfirmDialog";

type UnsavedChangesContextValue = {
  setDirty: (id: string, dirty: boolean) => void;
  /** Runs `action` right away, or after the user confirms leaving when an editor has unsaved changes. */
  confirmLeave: (action: () => void) => void;
};

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(null);

/** Marks the extra same-URL history entry that lets the browser's 上一頁 be intercepted. */
const GUARD_KEY = "__unsavedGuard";
const isOnGuardEntry = () => Boolean((window.history.state as Record<string, unknown> | null)?.[GUARD_KEY]);

/**
 * Warns before leaving an admin page with unsaved changes: closing/reloading the tab (browser prompt),
 * clicking any in-app link, the browser's 上一頁, or actions that navigate away (via `confirmLeave`).
 */
export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [dirtyIds, setDirtyIds] = useState<ReadonlySet<string>>(new Set());
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  // Run when the dialog is dismissed with「留在此頁」(the 上一頁 case re-arms its history guard).
  const onStayRef = useRef<(() => void) | null>(null);
  const isDirty = dirtyIds.size > 0;
  // Read by the document listeners without re-subscribing on every change.
  const isDirtyRef = useRef(isDirty);
  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  const setDirty = useCallback((id: string, dirty: boolean) => {
    setDirtyIds((prev) => {
      if (prev.has(id) === dirty) return prev;
      const next = new Set(prev);
      if (dirty) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const confirmLeave = useCallback((action: () => void) => {
    if (isDirtyRef.current) setPendingAction(() => action);
    else action();
  }, []);

  // Closing or reloading the tab: the browser shows its own confirmation.
  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      // Already confirmed in our own dialog (e.g. 上一頁 to another site): don't ask twice.
      if (!isDirtyRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  // In-app links: caught on the document before Next's <Link> handles them.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!isDirtyRef.current || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page (e.g. an in-page anchor): not leaving.
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      event.preventDefault();
      event.stopPropagation();
      const href = `${url.pathname}${url.search}${url.hash}`;
      setPendingAction(() => () => router.push(href));
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  // Browser 上一頁: popstate can't be cancelled, so while there are unsaved changes an extra entry
  // with the same URL sits on top of the page's own. 上一頁 then only pops that guard (the page stays
  // put) and we ask first:「離開」goes back for real,「留在此頁」puts the guard back.
  const onGuardRef = useRef(false);
  const guardUrlRef = useRef<string | null>(null);
  const pushGuard = useCallback(() => {
    window.history.pushState({ ...(window.history.state ?? {}), [GUARD_KEY]: true }, "", window.location.href);
    onGuardRef.current = true;
    guardUrlRef.current = window.location.href;
  }, []);

  useEffect(() => {
    if (isDirty && !isOnGuardEntry()) pushGuard();
  }, [isDirty, pushGuard]);

  useEffect(() => {
    // After any navigation (router push, back/forward), note whether we landed on a guard entry.
    onGuardRef.current = isOnGuardEntry();
    if (onGuardRef.current) guardUrlRef.current = window.location.href;
  }, [pathname]);

  useEffect(() => {
    const onPopState = () => {
      const leftGuard = onGuardRef.current && !isOnGuardEntry() && window.location.href === guardUrlRef.current;
      onGuardRef.current = isOnGuardEntry();
      if (!leftGuard) return;
      if (isDirtyRef.current) {
        onStayRef.current = pushGuard;
        setPendingAction(() => () => window.history.back());
      } else {
        // Saved since the guard was added: skip the duplicate entry so one 上一頁 is enough.
        window.history.back();
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [pushGuard]);

  // A new page starts clean (its editors register themselves again).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setDirtyIds(new Set());
    setPendingAction(null);
  }

  const value = useMemo(() => ({ setDirty, confirmLeave }), [setDirty, confirmLeave]);

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}
      {pendingAction && (
        <AdminConfirmDialog
          title="尚未儲存變更"
          message={"目前有修改尚未儲存，離開後這些修改將不會保留。\n確定要離開此頁嗎？"}
          confirmLabel="離開"
          cancelLabel="留在此頁"
          onConfirm={() => {
            const action = pendingAction;
            setPendingAction(null);
            onStayRef.current = null;
            // Leaving on purpose: drop the flags so the browser prompt doesn't fire as well.
            isDirtyRef.current = false;
            setDirtyIds(new Set());
            action();
          }}
          onCancel={() => {
            setPendingAction(null);
            onStayRef.current?.();
            onStayRef.current = null;
          }}
        />
      )}
    </UnsavedChangesContext.Provider>
  );
}

function useUnsavedChangesContext(): UnsavedChangesContextValue {
  const context = useContext(UnsavedChangesContext);
  if (!context) throw new Error("UnsavedChangesProvider is missing");
  return context;
}

/** Call in an admin editor: while `isDirty`, leaving the page asks for confirmation first. */
export function useUnsavedChangesWarning(isDirty: boolean) {
  const { setDirty } = useUnsavedChangesContext();
  const id = useId();
  useEffect(() => {
    setDirty(id, isDirty);
  }, [id, isDirty, setDirty]);
  useEffect(() => () => setDirty(id, false), [id, setDirty]);
}

/** For buttons that navigate away without a link (e.g. 新增行程、登出). */
export function useConfirmLeave() {
  return useUnsavedChangesContext().confirmLeave;
}

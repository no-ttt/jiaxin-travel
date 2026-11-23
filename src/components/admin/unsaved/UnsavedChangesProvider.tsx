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

/**
 * Warns before leaving an admin page with unsaved changes: closing/reloading the tab (browser prompt),
 * clicking any in-app link, or actions that navigate away (via `confirmLeave`).
 */
export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [dirtyIds, setDirtyIds] = useState<ReadonlySet<string>>(new Set());
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
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
            // Leaving on purpose: drop the flags so the browser prompt doesn't fire as well.
            isDirtyRef.current = false;
            setDirtyIds(new Set());
            action();
          }}
          onCancel={() => setPendingAction(null)}
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

import { useEffect, useRef } from "react";

export function useDirtyTracking<T>(value: T, onDirtyChange?: (dirty: boolean) => void, resetKey?: unknown) {
  const serialized = JSON.stringify(value);
  const initialRef = useRef(serialized);
  // Latest value/callback, so the reset effect can depend on `resetKey` alone.
  const latestRef = useRef({ serialized, onDirtyChange });

  useEffect(() => {
    latestRef.current = { serialized, onDirtyChange };
  });

  // Resetting (e.g. after save) makes the current value the new clean baseline.
  useEffect(() => {
    initialRef.current = latestRef.current.serialized;
    latestRef.current.onDirtyChange?.(false);
  }, [resetKey]);

  useEffect(() => {
    onDirtyChange?.(serialized !== initialRef.current);
  }, [serialized, onDirtyChange]);
}

import { useEffect, useRef } from "react";

export function useDirtyTracking<T>(value: T, onDirtyChange?: (dirty: boolean) => void, resetKey?: unknown) {
  const initialRef = useRef(JSON.stringify(value));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    initialRef.current = JSON.stringify(value);
    onDirtyChange?.(false);
  }, [resetKey]);

  useEffect(() => {
    onDirtyChange?.(JSON.stringify(value) !== initialRef.current);
  }, [value, onDirtyChange]);
}

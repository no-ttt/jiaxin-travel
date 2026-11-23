/** Centered loading spinner for image boxes while an upload or image load is in progress. */
export default function AdminSpinner({ label = "載入中" }: { label?: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" role="status" aria-label={label}>
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#E0E3E8] border-t-[#0053E0]" />
    </div>
  );
}

/** Loading state for a whole page or section (in flow, not absolutely positioned). */
export function AdminLoading({ fullScreen = false }: { fullScreen?: boolean }) {
  return (
    <div
      role="status"
      aria-label="載入中"
      className={
        fullScreen
          ? "flex min-h-screen items-center justify-center bg-[#FAFAFA]"
          : "flex items-center justify-center py-16"
      }
    >
      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#E0E3E8] border-t-[#0053E0]" />
    </div>
  );
}

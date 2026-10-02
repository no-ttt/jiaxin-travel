import type { ReactNode } from "react";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

/** Signed-in only (media and status lookups are admin APIs), but without the dashboard sidebar. */
export default function TripPreviewLayout({ children }: { children: ReactNode }) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}

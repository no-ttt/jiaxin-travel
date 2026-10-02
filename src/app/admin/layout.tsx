import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/api/auth-context";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {/* `contents` keeps layout unchanged; the attribute scopes admin-only styles in globals.css. */}
      <div data-admin className="contents">
        {children}
      </div>
    </AuthProvider>
  );
}

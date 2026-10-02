"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/api/auth-context";

export default function AdminAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Remember where they were, so logging in again returns to the same page.
    if (!isLoading && !user) router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
  }, [isLoading, user, router, pathname]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] text-sm text-[#535F71]">
        載入中…
      </div>
    );
  }

  return <>{children}</>;
}

import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { UnsavedChangesProvider } from "@/components/admin/unsaved/UnsavedChangesProvider";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthGuard>
      <UnsavedChangesProvider>
        <div className="flex min-h-screen bg-[#FAFAFA]">
          <AdminSidebar />
          <main className="min-w-0 flex-1 px-20 py-9 pb-16">{children}</main>
        </div>
      </UnsavedChangesProvider>
    </AdminAuthGuard>
  );
}

import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-[#FAFAFA]">
        <AdminSidebar />
        <main className="flex-1 px-20 py-9 pb-16">{children}</main>
      </div>
    </AdminAuthGuard>
  );
}

import type { ReactNode } from "react";
import AdminRowActions from "./AdminRowActions";

type RowAction = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

type AdminItemCardProps = {
  badge: string;
  actions: RowAction[];
  children: ReactNode;
};

export default function AdminItemCard({ badge, actions, children }: AdminItemCardProps) {
  return (
    <div className="flex flex-col gap-3.5 rounded-xl border border-[#E0E3E8] bg-white px-6 py-[18px] pb-[22px]">
      <div className="flex items-center gap-3.5">
        <span className="flex h-8 items-center justify-center rounded-2xl bg-[#002366] px-4 text-sm font-bold leading-[1.5em] text-white">
          {badge}
        </span>
        <div className="flex-1" />
        <AdminRowActions actions={actions} />
      </div>
      {children}
    </div>
  );
}

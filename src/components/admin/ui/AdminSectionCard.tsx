import type { ReactNode } from "react";

type AdminSectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function AdminSectionCard({ title, description, children }: AdminSectionCardProps) {
  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-[#E0E3E8] bg-white p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold leading-[1.5em] text-[#090909]">{title}</h2>
        {description && <p className="text-[13px] font-medium leading-[1.5em] text-[#535F71]">{description}</p>}
      </div>
      {children}
    </section>
  );
}

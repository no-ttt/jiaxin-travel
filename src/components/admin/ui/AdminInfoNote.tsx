import Image from "next/image";
import type { ReactNode } from "react";

export default function AdminInfoNote({ children, icon = true }: { children: ReactNode; icon?: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-[10px] bg-[#FAFAFA] px-3.5 py-2.5">
      {icon && <Image src="/images/admin/info-icon.svg" alt="" width={20} height={20} className="shrink-0" />}
      <p className="text-[12.5px] leading-[1.45em] text-[#535F71]">{children}</p>
    </div>
  );
}

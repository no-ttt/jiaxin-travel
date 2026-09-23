import TripsTable from "@/components/admin/trips/TripsTable";

export default function AdminTripsPage() {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex h-24 items-center justify-between">
        <div className="flex flex-col gap-[3px]">
          <h1 className="text-[28px] font-bold leading-[1.45em] text-[#090909]">行程產品管理</h1>
          <p className="text-sm font-medium leading-[1.45em] text-[#535F71]">
            管理所有行程，包含自建行程與外部連結行程
          </p>
        </div>
      </div>
      <TripsTable />
    </div>
  );
}

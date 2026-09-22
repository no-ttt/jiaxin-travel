export default function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-bold text-[#090909]">{title}</h2>
      <p className="text-sm text-[#535F71]">此頁面尚待切版。</p>
    </div>
  );
}

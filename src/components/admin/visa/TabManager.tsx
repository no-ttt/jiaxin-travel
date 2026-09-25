import ToggleSwitch from "../ui/ToggleSwitch";

type Tab = {
  id: string;
  name: string;
  visible: boolean;
};

export default function TabManager({
  title,
  description,
  tabs,
  activeId,
  onSelect,
  onToggleVisible,
  onAdd,
}: {
  title: string;
  description: string;
  tabs: Tab[];
  activeId: string;
  onSelect: (id: string) => void;
  onToggleVisible: (id: string) => void;
  onAdd?: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="text-[13px] font-bold leading-[1.45em] text-[#090909]">{title}</span>
          <span className="text-xs leading-[1.45em] text-[#535F71]">{description}</span>
        </div>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="cursor-pointer whitespace-nowrap text-xs font-medium leading-[1.45em] text-[#0053E0]"
          >
            ＋ 新增項目
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => {
          const active = tab.id === activeId;
          return (
            <div
              key={tab.id}
              className={`flex items-center gap-2 rounded-[10px] border px-3 py-2 ${
                active ? "border-[#0053E0] bg-[#ECF1FA]" : "border-[#E0E3E8] bg-white"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(tab.id)}
                className={`cursor-pointer whitespace-nowrap text-[13px] leading-[1.45em] ${
                  active ? "font-bold text-[#0053E0]" : "font-medium text-[#090909]"
                }`}
              >
                {tab.name || "未命名項目"}
              </button>
              <ToggleSwitch
                size="sm"
                checked={tab.visible}
                onChange={() => onToggleVisible(tab.id)}
                label={`切換${tab.name || "項目"}顯示於前台`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { generateId } from "@/components/admin/ui/generateId";
import AdminSelect from "./AdminSelect";
import AdminDateField from "./AdminDateField";
import TagMultiSelect from "./TagMultiSelect";

type Chip = { id: string; label: string };

const REGION_TAGS = ["日本", "韓國", "中國", "港澳", "東南亞", "紐澳", "歐洲", "美加", "中東非洲"];

function makeChips(labels: string[]): Chip[] {
  return labels.map((label) => ({ id: generateId("chip"), label }));
}

function BadgeAddOption({ placeholder, onAdd }: { placeholder: string; onAdd: (label: string) => void }) {
  const [draft, setDraft] = useState("");

  const submit = () => {
    if (!draft.trim()) return;
    onAdd(draft.trim());
    setDraft("");
  };

  return (
    <div className="ml-auto flex items-center gap-2">
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        placeholder={placeholder}
        className="h-[38px] w-[246px] rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-sm leading-[1.5em] text-[#090909] outline-none placeholder:text-[#535F71] focus:border-[#0053E0]"
      />
      <button
        type="button"
        onClick={submit}
        className="flex h-[38px] shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#E0E3E8] bg-white px-4 text-[13px] font-bold leading-[1.45em] text-[#0053E0] hover:bg-[#ECF1FA]"
      >
        ＋ 新增
      </button>
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex h-7 w-12 cursor-pointer items-center rounded-full p-0.5 transition ${
        checked ? "justify-end bg-[#14D7B6]" : "justify-start bg-[#E0E3E8]"
      }`}
    >
      <span className="h-6 w-6 rounded-full bg-white shadow-[-1px_0.75px_1px_0px_rgba(0,0,0,0.05)]" />
    </button>
  );
}

function ManagedChipList({
  chips,
  onRemove,
  addPlaceholder,
  onAdd,
}: {
  chips: Chip[];
  onRemove: (id: string) => void;
  addPlaceholder: string;
  onAdd: (label: string) => void;
}) {
  const [draft, setDraft] = useState("");

  const submit = () => {
    if (!draft.trim()) return;
    onAdd(draft.trim());
    setDraft("");
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {chips.map((chip) => (
          <div
            key={chip.id}
            className="flex items-center gap-1 rounded-full border border-[#E0E3E8] bg-[#ECF1FA] px-3 py-1.5"
          >
            <span className="text-[13px] font-medium leading-[1.45em] text-[#002366]">{chip.label}</span>
            <button
              type="button"
              onClick={() => onRemove(chip.id)}
              aria-label={`移除 ${chip.label}`}
              className="cursor-pointer text-sm leading-none text-[#535F71] opacity-80 hover:text-[#090909]"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder={addPlaceholder}
          className="h-[38px] w-[246px] rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-sm leading-[1.5em] text-[#090909] outline-none placeholder:text-[#535F71] focus:border-[#0053E0]"
        />
        <button
          type="button"
          onClick={submit}
          className="flex h-[38px] shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#E0E3E8] bg-white px-4 text-[13px] font-bold leading-[1.45em] text-[#0053E0] hover:bg-[#ECF1FA]"
        >
          ＋ 新增
        </button>
      </div>
    </div>
  );
}

export default function BasicInfoSection({
  title,
  description,
  departDate: departDateProp,
  onDepartDateChange,
}: {
  title: string;
  description: string;
  departDate?: string;
  onDepartDateChange?: (value: string) => void;
}) {
  const [tripType, setTripType] = useState<"custom" | "external">("custom");
  const [externalUrl, setExternalUrl] = useState("");
  const [externalAgency, setExternalAgency] = useState("");
  const [pageTitle, setPageTitle] = useState("追尋極光・遇見冰島 10 日｜藍冰洞探險｜冰河湖｜鑽石沙灘");

  const [themeOptions, setThemeOptions] = useState<Chip[]>(makeChips(["賽車主題", "郵輪", "親子"]));
  const [selectedThemes, setSelectedThemes] = useState<string[]>(["賽車主題", "郵輪"]);

  const [selectedRegions, setSelectedRegions] = useState<string[]>(["日本", "關西"]);

  const [statusOptions, setStatusOptions] = useState<Chip[]>(makeChips(["保證出團", "新行程", "即將額滿"]));
  const [tripStatus, setTripStatus] = useState("保證出團");

  const [badgeOptions, setBadgeOptions] = useState<Chip[]>(makeChips(["限定席次", "人氣推薦"]));
  const [cardBadge, setCardBadge] = useState("自動判斷");

  const [listingStatus, setListingStatus] = useState("上架中");

  const [zones, setZones] = useState<string[]>(["國外團體"]);

  const [price, setPrice] = useState("NT$ 168,000");
  const [currency, setCurrency] = useState("元");

  const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
  const [selectedMonths, setSelectedMonths] = useState<string[]>(["1月", "6月", "7月", "8月"]);

  const [departureCity, setDepartureCity] = useState("台北");
  const [deposit, setDeposit] = useState("NT$ 50,000");

  const [metaBadgeVisible, setMetaBadgeVisible] = useState(true);

  const [departDateState, setDepartDateState] = useState("2027-01-13");
  const departDate = departDateProp ?? departDateState;
  const setDepartDate = (value: string) => {
    setDepartDateState(value);
    onDepartDateChange?.(value);
  };
  const [returnDate, setReturnDate] = useState("2027-01-22");

  const toggleInArray = (value: string, arr: string[], setArr: (v: string[]) => void) => {
    setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const generatedDaysSummary = (() => {
    const start = new Date(departDate);
    const end = new Date(returnDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
      return "請選擇有效的出發日與回程日。";
    }
    const days = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
    const format = (d: string) => d.replaceAll("-", "/");
    return `共 ${days} 天行程（${format(departDate)}–${format(returnDate)}），已產生 ${days} 個日卡。`;
  })();

  const isExternal = tripType === "external";

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-[#E0E3E8] bg-white p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold leading-[1.45em] text-[#090909]">{title}</h2>
        <p className="text-[13px] font-medium leading-[1.45em] text-[#535F71]">{description}</p>
      </div>

      {/* Trip Type & External Link */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] p-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-[15px] font-bold leading-[1.45em] text-[#002366]">行程類型與外部連結</h3>
          <p className="w-full text-[13px] leading-[1.45em] text-[#535F71] sm:max-w-[720px]">
            決定本行程是「自建行程」還是「外部連結行程」；類型建議上架後鎖定，若需變更請以刪除重建方式處理，避免資料混淆。
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-[13px] font-bold leading-[1.45em] text-[#002366]">行程類型</span>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setTripType("custom")}
              className={`flex cursor-pointer items-center rounded-[10px] px-5 py-2.5 text-sm font-bold leading-[1.45em] transition ${
                tripType === "custom"
                  ? "bg-[#0053E0] text-white"
                  : "border border-[#E0E3E8] bg-white text-[#002366]"
              }`}
            >
              {tripType === "custom" ? "● " : "○ "}自建行程
            </button>
            <button
              type="button"
              onClick={() => setTripType("external")}
              className={`flex cursor-pointer items-center rounded-[10px] px-5 py-2.5 text-sm font-bold leading-[1.45em] transition ${
                tripType === "external"
                  ? "bg-[#0053E0] text-white"
                  : "border border-[#E0E3E8] bg-white text-[#002366]"
              }`}
            >
              {tripType === "external" ? "● " : "○ "}外部連結行程
            </button>
          </div>
        </div>

        <div className="flex items-center rounded-lg bg-[#ECF1FA] p-3">
          <p className="text-[13px] leading-[1.45em] text-[#002366]">
            動態顯示・非鎖定停用：選擇「自建行程」時，顯示下方外部連結相關欄位隱藏，並顯示 03 行程特色／04
            航程資訊／05 每日行程與站內洽詢 CTA；選擇「外部連結行程」時，顯示外部連結網址與來源旅行社欄位，03～05
            隱藏，CTA 改為外部連結（另開新分頁）。
          </p>
        </div>

        {isExternal && (
          <>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-1 flex-col gap-[7px]">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">外部連結網址</span>
                  <span className="rounded-full bg-[#ECF1FA] px-2 py-[3px] text-[11px] font-bold leading-[1.45em] text-[#0053E0]">
                    僅外部連結行程顯示
                  </span>
                </div>
                <input
                  type="text"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://partner-agency.example.com/trip/12345"
                  className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none placeholder:text-[#535F71] focus:border-[#0053E0]"
                />
              </div>
              <div className="flex flex-1 flex-col gap-[7px]">
                <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">來源旅行社</span>
                <input
                  type="text"
                  value={externalAgency}
                  onChange={(e) => setExternalAgency(e.target.value)}
                  placeholder="○○旅行社"
                  className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none placeholder:text-[#535F71] focus:border-[#0053E0]"
                />
                <p className="text-xs leading-[1.45em] text-[#535F71]">
                  僅後台使用，不顯示於前台；用於內部統計、批次管理與未來合作關係調整時的批次篩選。
                </p>
              </div>
            </div>
            <div className="flex items-center rounded-lg bg-[#ECF1FA] p-3">
              <p className="text-[13px] leading-[1.45em] text-[#002366]">
                CTA 對應：自建行程 → 導向站內洽詢表單；外部連結行程 → 導向「外部連結網址」，於新分頁開啟。
              </p>
            </div>
          </>
        )}
      </div>

      {/* 標題 */}
      <div className="flex flex-col gap-[7px]">
        <span className="text-[13px] font-bold leading-[1.45em] text-[#002366]">標題</span>
        <input
          type="text"
          value={pageTitle}
          onChange={(e) => setPageTitle(e.target.value)}
          className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
        />
        <p className="text-xs leading-[1.4em] text-[#535F71]">
          此為頁面／SEO 標題，用於瀏覽器分頁與搜尋結果；封面大標題請至下方「01 封面設定」維護，前台卡片／集合頁顯示名稱請至下方「行程產品名稱」維護。
        </p>
      </div>

      {/* Frontend Identity */}
      <div className="flex flex-col gap-4 rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] p-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-base font-bold leading-[1.45em] text-[#002366]">前台識別</h3>
          <p className="text-[13px] leading-[1.45em] text-[#535F71]">
            管理產品卡左上角的識別資訊；地區與主題標籤可複選，用於前台篩選，狀態與卡片 Badge 顯示策略彼此獨立。
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex flex-1 flex-col gap-[7px]">
            <span className="text-sm font-bold leading-[1.45em] text-[#090909]">主題標籤</span>
            <TagMultiSelect
              options={themeOptions.map((t) => t.label)}
              selected={selectedThemes}
              onChange={setSelectedThemes}
              placeholder="選擇主題標籤"
            />
          </div>
          <div className="flex flex-1 flex-col gap-[7px]">
            <span className="text-sm font-bold leading-[1.45em] text-[#090909]">地區標籤</span>
            <TagMultiSelect
              options={REGION_TAGS}
              selected={selectedRegions}
              onChange={setSelectedRegions}
              placeholder="選擇地區標籤"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex flex-1 flex-col gap-[7px]">
            <span className="text-sm font-bold leading-[1.45em] text-[#090909]">行程狀態</span>
            <AdminSelect
              options={statusOptions.map((o) => o.label)}
              value={tripStatus}
              onChange={setTripStatus}
            />
          </div>
          <div className="flex flex-1 flex-col gap-[7px]">
            <span className="text-sm font-bold leading-[1.45em] text-[#090909]">卡片 Badge</span>
            <AdminSelect
              options={["自動判斷", ...badgeOptions.map((o) => o.label), "不顯示"]}
              value={cardBadge}
              onChange={setCardBadge}
            />
          </div>
          <div className="flex flex-1 flex-col gap-[7px]">
            <span className="text-sm font-bold leading-[1.45em] text-[#090909]">上架狀態</span>
            <AdminSelect
              options={["上架中", "下架", "草稿"]}
              value={listingStatus}
              onChange={setListingStatus}
            />
          </div>
        </div>

        {/* Identity Source Settings */}
        <div className="flex flex-col gap-4 rounded-[10px] border border-[#E0E3E8] bg-white p-3.5">
          <div className="flex flex-col gap-0.5">
            <h4 className="text-[15px] font-bold leading-[1.45em] text-[#002366]">識別內容設定</h4>
            <p className="text-[13px] leading-[1.45em] text-[#535F71]">
              在這裡管理可選項目；上方欄位只負責選擇本行程目前套用的內容。
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-bold leading-[1.45em] text-[#090909]">主題標籤</span>
              <span className="text-xs leading-[1.45em] text-[#535F71]">建立旅遊主題，例如賽車、郵輪、親子</span>
            </div>
            <ManagedChipList
              chips={themeOptions}
              onRemove={(id) => setThemeOptions((prev) => prev.filter((c) => c.id !== id))}
              addPlaceholder="輸入主題名稱"
              onAdd={(label) => setThemeOptions((prev) => [...prev, { id: generateId("chip"), label }])}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-bold leading-[1.45em] text-[#090909]">地區標籤</span>
              <span className="text-xs leading-[1.45em] text-[#535F71]">同步自「網站導覽分類編輯」的地區清單</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {REGION_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center rounded-[15px] bg-[#ECF1FA] px-3 py-1.5 text-[13px] font-medium leading-[1.4em] text-[#002366]"
                >
                  {tag}
                </span>
              ))}
              <button
                type="button"
                className="cursor-pointer text-[13px] font-bold leading-[1.45em] text-[#0053E0] hover:underline"
              >
                前往地區清單管理 →
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-bold leading-[1.45em] text-[#090909]">行程狀態</span>
              <span className="text-xs leading-[1.45em] text-[#535F71]">建立狀態，例如保證出團、新行程</span>
            </div>
            <ManagedChipList
              chips={statusOptions}
              onRemove={(id) => setStatusOptions((prev) => prev.filter((c) => c.id !== id))}
              addPlaceholder="輸入狀態名稱"
              onAdd={(label) => setStatusOptions((prev) => [...prev, { id: generateId("chip"), label }])}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-bold leading-[1.45em] text-[#090909]">卡片標章</span>
              <span className="text-right text-xs leading-[1.45em] text-[#535F71]">
                管理可用標章；實際套用請於上方欄位選擇。
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center rounded-[15px] border border-[#E0E3E8] bg-[#F7F9FB] px-3 py-1.5 text-[13px] font-medium leading-[1.45em] text-[#002366]">
                  自動判斷
                </span>
                {badgeOptions.map((chip) => (
                  <div
                    key={chip.id}
                    className="flex items-center gap-2 rounded-[15px] border border-[#E0E3E8] bg-white px-3 py-1.5"
                  >
                    <span className="text-[13px] font-medium leading-[1.45em] text-[#002366]">{chip.label}</span>
                    <button
                      type="button"
                      onClick={() => setBadgeOptions((prev) => prev.filter((c) => c.id !== chip.id))}
                      aria-label={`移除 ${chip.label}`}
                      className="cursor-pointer text-sm leading-none text-[#535F71] opacity-80 hover:text-[#090909]"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <span className="flex items-center rounded-[15px] border border-[#E0E3E8] bg-[#F7F9FB] px-3 py-1.5 text-[13px] font-medium leading-[1.45em] text-[#002366]">
                  不顯示
                </span>
              </div>
              <BadgeAddOption
                placeholder="輸入標章文字"
                onAdd={(label) => setBadgeOptions((prev) => [...prev, { id: generateId("chip"), label }])}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center rounded-lg bg-[#ECF1FA] px-3 py-2.5">
          <p className="text-[13px] leading-[1.45em] text-[#002366]">
            自動判斷：重要狀態優先於主題；進入專屬集合頁時，自動隱藏與集合本身重複的 Badge。
          </p>
        </div>
      </div>

      {/* Trip Zones */}
      <div className="flex flex-col gap-3.5 rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] p-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-[15px] font-bold leading-[1.45em] text-[#002366]">所屬專區</h3>
          <p className="text-[13px] leading-[1.45em] text-[#535F71]">
            前台入口分類，可複選、彼此不互斥。「國外團體」「主題旅遊」沿用上方地區／主題標籤自動分組呈現；「精緻臻品」「美安專區」為人工策展列表，行程仍可同時被地區／主題查詢撈到。
          </p>
        </div>
        <div className="flex flex-wrap gap-7">
          {["國外團體", "主題旅遊", "精緻臻品", "美安專區"].map((zone) => {
            const checked = zones.includes(zone);
            return (
              <label key={zone} className="flex cursor-pointer items-center gap-2">
                <span
                  onClick={() => toggleInArray(zone, zones, setZones)}
                  className={`flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border text-[12px] font-bold leading-none text-white ${
                    checked ? "border-[#0053E0] bg-[#0053E0]" : "border-[#E0E3E8] bg-white"
                  }`}
                >
                  {checked ? "✓" : ""}
                </span>
                <span className="text-sm font-medium leading-[1.4em] text-[#002366]">{zone}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Row */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 flex-col gap-[7px]">
          <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">產品起價</span>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
          />
          <p className="text-xs leading-[1.4em] text-[#535F71]">
            若不同出發梯次有淡旺季價差，請填入所有梯次中的最低起價。
          </p>
        </div>
        <div className="flex w-full flex-col gap-[7px] sm:w-[328px]">
          <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">幣別</span>
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
          />
        </div>
      </div>

      {/* Season / Months */}
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-bold leading-[1.45em] text-[#002366]">季節／可出發月份</span>
        <div className="flex flex-wrap gap-2">
          {MONTHS.map((month) => {
            const selected = selectedMonths.includes(month);
            return (
              <button
                key={month}
                type="button"
                onClick={() => toggleInArray(month, selectedMonths, setSelectedMonths)}
                className={`flex h-[30px] w-[70px] cursor-pointer items-center justify-center rounded-[7px] border text-[13px] font-medium leading-[1.45em] transition ${
                  selected
                    ? "border-[#0053E0] bg-[#0053E0] text-white"
                    : "border-[#E0E3E8] bg-white text-[#002366] hover:border-[#0053E0]"
                }`}
              >
                {month}
              </button>
            );
          })}
        </div>
        <p className="text-xs leading-[1.4em] text-[#535F71]">
          結構化欄位，供前台依月份／季節篩選。外部連結行程無法抓取對方網站資料，天數（見「01 封面設定」）、預算與此欄位請務必手動確認並填寫。
        </p>
      </div>

      {/* Departure + Deposit */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 flex-col gap-[7px]">
          <span className="text-sm font-bold leading-[1.45em] text-[#090909]">預設出發地</span>
          <input
            type="text"
            value={departureCity}
            onChange={(e) => setDepartureCity(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
          />
        </div>
        <div className="flex flex-1 flex-col gap-[7px]">
          <span className="text-sm font-bold leading-[1.45em] text-[#090909]">訂金／人</span>
          <input
            type="text"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
          />
        </div>
      </div>

      {/* Trip Meta Badge */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#E0E3E8] bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-[15px] font-bold leading-[1.45em] text-[#090909]">圖片摘要</h3>
            <p className="text-[13px] leading-[1.45em] text-[#535F71]">
              由「預設出發地＋行程天數」自動產生，不另外手動輸入。
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[13px] font-medium leading-[1.45em] text-[#535F71]">前台顯示</span>
            <ToggleSwitch checked={metaBadgeVisible} onChange={setMetaBadgeVisible} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[13px] leading-[1.45em] text-[#535F71]">前台預覽</span>
          <span className="flex items-center justify-center rounded-full bg-[#002366] px-3.5 py-2 text-[13px] font-medium leading-[1.45em] text-white">
            {departureCity}出發・10天
          </span>
          <span className="text-[13px] leading-[1.45em] text-[#535F71]">自動同步，不需維護第二份文字</span>
        </div>
      </div>

      {/* Date range header */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[13px] font-bold leading-[1.45em] text-[#002366]">
          每日行程日期範圍（用於自動產生日卡，與上方「天數」欄位分開維護）
        </span>
        <span className="rounded-full bg-[#ECF1FA] px-2 py-[3px] text-[11px] font-bold leading-[1.45em] text-[#0053E0]">
          僅自建行程適用
        </span>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 flex-col gap-[7px]">
          <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">基準出發日</span>
          <AdminDateField value={departDate} onChange={setDepartDate} />
        </div>
        <div className="flex flex-1 flex-col gap-[7px]">
          <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">基準回程日</span>
          <AdminDateField value={returnDate} onChange={setReturnDate} />
        </div>
      </div>

      <div className="flex h-11 items-center rounded-lg bg-[#DBE8FF] pl-3.5">
        <p className="text-sm font-bold leading-[1.45em] text-[#0053E0]">{generatedDaysSummary}</p>
      </div>
    </section>
  );
}

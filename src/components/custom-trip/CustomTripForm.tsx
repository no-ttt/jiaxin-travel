"use client";

import { useState } from "react";
import Dropdown from "@/components/ui/Dropdown";

const TRAVEL_NATURE_OPTIONS = ["家庭旅遊", "朋友聚會", "企業包團", "蜜月旅行", "其他"];
const BUDGET_OPTIONS = ["3 萬以下", "3–5 萬", "5–8 萬", "8–12 萬", "12 萬以上"];
const TIME_SLOTS = ["上午（09:00-12:00）", "下午（13:00-17:00）", "晚上（18:00-20:00）"];
const COMPANION_NEEDS = ["嬰幼兒", "銀髮長輩", "行動不便者", "寵物同行"];

function ClipboardListIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="4" width="14" height="17" rx="2" stroke="#0053E0" strokeWidth="1.6" />
      <path d="M9 3.5H15V6H9V3.5Z" stroke="#0053E0" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8.5 11H15.5M8.5 14.5H15.5M8.5 18H12.5" stroke="#0053E0" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="2.8" stroke="#0053E0" strokeWidth="1.6" />
      <path d="M3.5 19C3.5 15.7 6 13.2 9 13.2C12 13.2 14.5 15.7 14.5 19" stroke="#0053E0" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="16.5" cy="9" r="2.2" stroke="#0053E0" strokeWidth="1.6" />
      <path d="M14.5 13.5C17.2 13.7 19.2 15.8 19.2 18.5" stroke="#0053E0" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8.5 4.5C7.8 4.5 7.1 4.8 6.6 5.3L5.2 6.7C4.5 7.4 4.3 8.5 4.7 9.5C6.4 13.7 9.8 17.1 14 18.8C15 19.2 16.1 19 16.8 18.3L18.2 16.9C18.7 16.4 19 15.7 19 15C19 14.3 18.7 13.6 18.2 13.1L16.3 11.2C15.5 10.4 14.2 10.4 13.4 11.2L12.7 11.9C11.2 11 9.9 9.7 9 8.2L9.7 7.5C10.5 6.7 10.5 5.4 9.7 4.6L8.5 4.5Z"
        stroke="#0053E0"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2.5C7.1 2.5 4.8 4.8 4.8 7.7C4.8 9.5 5.7 11 7 11.9C7.4 12.2 7.6 12.6 7.6 13.1V13.8H12.4V13.1C12.4 12.6 12.6 12.2 13 11.9C14.3 11 15.2 9.5 15.2 7.7C15.2 4.8 12.9 2.5 10 2.5Z"
        stroke="#6696E6"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M7.8 16H12.2M8.3 17.5H11.7" stroke="#6696E6" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function CheckboxToggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={`flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-[5px] border transition ${
        checked ? "border-[#0053E0] bg-[#0053E0]" : "border-[#E0E3E8] bg-white"
      }`}
    >
      {checked && (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <path d="M2.5 6.5L5 9L10.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

function SectionHeading({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#DBE8FF]">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-[#090909]">{title}</h2>
        <p className="text-sm leading-[1.55] text-[#535F71]">{description}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col gap-2.5">
      <span className="text-[15px] font-medium text-[#090909]">
        {label} {required && <span className="text-[#0053E0]">＊</span>}
      </span>
      {children}
    </div>
  );
}

function TextInput({
  name,
  type = "text",
  placeholder,
  required,
}: {
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      className="h-12 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-sm text-[#090909] placeholder:text-[#888888] focus:border-[#0053E0] focus:outline-none"
    />
  );
}

function CompanionCheckbox({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5" onClick={(e) => { e.preventDefault(); onToggle(); }}>
      <CheckboxToggle checked={checked} onChange={onToggle} />
      <span className="text-[15px] text-[#535F71]">{label}</span>
    </label>
  );
}

export default function CustomTripForm() {
  const [companionNeeds, setCompanionNeeds] = useState<Set<string>>(new Set());
  const [includesFlight, setIncludesFlight] = useState<"with" | "without">("with");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tripNature, setTripNature] = useState("");
  const [budget, setBudget] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  const toggleCompanionNeed = (need: string) => {
    setCompanionNeeds((prev) => {
      const next = new Set(prev);
      if (next.has(need)) next.delete(need);
      else next.add(need);
      return next;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!agreed) return;
    setSubmitted(true);
  };

  return (
    <section
      id="custom-trip-form"
      className="flex scroll-mt-24 flex-col items-stretch gap-7 px-4 pb-14 pt-8 sm:px-8 lg:px-[160px] lg:pb-[72px] lg:pt-10"
    >
      <div className="flex w-full flex-col gap-2">
        <span className="text-xs font-semibold tracking-[0.1833em] text-[#0053E0]">
          BUILD YOUR JOURNEY
        </span>
        <h2 className="font-serif text-[28px] font-bold text-[#090909] sm:text-[34px]">
          客製包團需求單
        </h2>
        <p className="text-sm leading-[1.6] text-[#535F71]">
          請填寫以下資訊，我們將在 24 小時內與您聯繫。
        </p>
      </div>

      <div className="w-full rounded-[28px] bg-white shadow-[0px_18px_46px_0px_rgba(20,41,71,0.12)]">
        <form onSubmit={handleSubmit} className="flex flex-col items-stretch gap-0 px-6 py-2 sm:px-8">
          {/* Section 01 需求概況 */}
          <div className="flex flex-col gap-6 border-b border-[#E0E3E8] py-8">
            <SectionHeading
              icon={<ClipboardListIcon />}
              title="需求概況"
              description="先告訴我們這趟旅程的基本輪廓，目的地尚未確定也可以填寫偏好的方向。"
            />

            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="flex flex-1 flex-col gap-5">
                <Field label="目的地" required>
                  <TextInput name="destination" placeholder="輸入目的地（國家、地區或城市）" required />
                </Field>
                <Field label="旅遊天數">
                  <TextInput name="days" placeholder="輸入旅遊天數" />
                </Field>
              </div>
              <div className="flex flex-1 flex-col gap-5">
                <Field label="旅遊性質">
                  <Dropdown
                    name="tripNature"
                    placeholder="選擇旅遊性質"
                    options={TRAVEL_NATURE_OPTIONS}
                    value={tripNature}
                    onChange={setTripNature}
                  />
                </Field>
                <Field label="出發日期">
                  <TextInput name="departureDate" type="date" placeholder="輸入出發日期或月份" />
                </Field>
              </div>
            </div>
          </div>

          {/* Section 02 參加成員 */}
          <div className="flex flex-col gap-6 border-b border-[#E0E3E8] py-8">
            <SectionHeading
              icon={<UsersIcon />}
              title="參加成員"
              description="了解同行者與預算，有助於安排交通、住宿、步行強度與服務細節。"
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field label="大人人數">
                <TextInput name="adults" type="number" placeholder="輸入人數" />
              </Field>
              <Field label="小孩人數（12 歲以下）">
                <TextInput name="children" type="number" placeholder="輸入人數" />
              </Field>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[15px] font-medium text-[#090909]">同行成員需求</span>
              <div className="flex flex-wrap gap-7">
                {COMPANION_NEEDS.map((need) => (
                  <CompanionCheckbox
                    key={need}
                    label={need}
                    checked={companionNeeds.has(need)}
                    onToggle={() => toggleCompanionNeed(need)}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field label="每人預算">
                <Dropdown
                  name="budget"
                  placeholder="選擇預算"
                  options={BUDGET_OPTIONS}
                  value={budget}
                  onChange={setBudget}
                />
              </Field>
              <div className="flex flex-1 flex-col gap-2.5">
                <span className="text-[15px] font-medium text-[#090909]">機票包含方式</span>
                <div className="flex h-12 items-center gap-4">
                  <CompanionCheckbox
                    label="含機票"
                    checked={includesFlight === "with"}
                    onToggle={() => setIncludesFlight("with")}
                  />
                  <CompanionCheckbox
                    label="不含機票"
                    checked={includesFlight === "without"}
                    onToggle={() => setIncludesFlight("without")}
                  />
                </div>
              </div>
            </div>

            <Field label="需求說明">
              <textarea
                name="requestNote"
                maxLength={300}
                placeholder="其他需求說明，如：素食、五星住宿、避免紅眼班機（300 字以內）"
                rows={5}
                className="w-full resize-none rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 py-3 text-sm text-[#090909] placeholder:text-[#888888] focus:border-[#0053E0] focus:outline-none"
              />
            </Field>
          </div>

          {/* Section 03 聯絡資訊 */}
          <div className="flex flex-col gap-6 py-8">
            <SectionHeading
              icon={<PhoneIcon />}
              title="聯絡資訊"
              description="留下方便聯絡的方式，顧問會先確認需求，再提供初步方向與後續建議。"
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field label="姓名" required>
                <TextInput name="name" placeholder="輸入聯絡人姓名" required />
              </Field>
              <Field label="Email" required>
                <TextInput name="email" type="email" placeholder="輸入 Email" required />
              </Field>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg bg-[#ECF1FA] px-3 py-2.5">
              <LightbulbIcon />
              <span className="text-[13px] text-[#535F71]">
                請至少填寫下方一項（建議皆填，方便傳送行程企劃及快速確認細節）
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field label="聯絡電話" required>
                <TextInput name="phone" type="tel" placeholder="輸入聯絡電話" />
              </Field>
              <Field label="Line ID" required>
                <TextInput name="lineId" placeholder="輸入 Line ID" />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field label="公司行號">
                <TextInput name="company" placeholder="輸入公司行號" />
              </Field>
              <Field label="方便聯絡的時段">
                <Dropdown
                  name="preferredTime"
                  placeholder="選擇時段"
                  options={TIME_SLOTS}
                  value={preferredTime}
                  onChange={setPreferredTime}
                />
              </Field>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                className="peer sr-only"
              />
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border border-[#C7CFD9] text-white peer-checked:border-[#0053E0] peer-checked:bg-[#0053E0]">
                {agreed && (
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <path d="M2.5 6.5L5 9L10.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="text-[15px] leading-[1.45] text-[#535F71]">
                我已閱讀並同意個人資料蒐集與使用說明
              </span>
            </label>

            <button
              type="submit"
              disabled={!agreed}
              className="flex h-14 w-full cursor-pointer items-center justify-center rounded-xl bg-[#0053E0] text-[17px] font-medium text-white transition hover:bg-[#0044b8] disabled:cursor-not-allowed disabled:bg-[#B7CCF2]"
            >
              立即送出需求單
            </button>

            {submitted && (
              <p className="text-center text-sm font-medium text-[#0053E0]">
                已收到您的需求單，我們將於 24 小時內與您聯繫。
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

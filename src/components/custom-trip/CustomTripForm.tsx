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
      <path
        d="M15.9995 3.99931H17.9993C18.5297 3.99931 19.0384 4.21004 19.4134 4.58514C19.7884 4.96024 19.9991 5.46899 19.9991 5.99947V20.0006C19.9991 20.5311 19.7884 21.0398 19.4134 21.4149C19.0384 21.79 18.5297 22.0007 17.9993 22.0007H6.00053C5.47015 22.0007 4.9615 21.79 4.58646 21.4149C4.21142 21.0398 4.00073 20.5311 4.00073 20.0006V5.99947C4.00073 5.46899 4.21142 4.96024 4.58646 4.58514C4.9615 4.21004 5.47015 3.99931 6.00053 3.99931H8.00033M11.9999 10.9999H15.9995M11.9999 16.0003H15.9995M8.00033 10.9999H8.01033M8.00033 16.0003H8.01033M9.00023 1.99915H14.9996C15.5519 1.99915 15.9995 2.4469 15.9995 2.99923V4.99939C15.9995 5.55171 15.5519 5.99947 14.9996 5.99947H9.00023C8.448 5.99947 8.00033 5.55171 8.00033 4.99939V2.99923C8.00033 2.4469 8.448 1.99915 9.00023 1.99915Z"
        stroke="#002366"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16.0004 21V19C16.0004 17.9391 15.5789 16.9217 14.8287 16.1716C14.0785 15.4214 13.061 15 12.0001 15H5.99959C4.93864 15 3.92114 15.4214 3.17093 16.1716C2.42073 16.9217 1.99927 17.9391 1.99927 19V21M16.0004 3.12793C16.8582 3.3503 17.6179 3.85119 18.1602 4.55199C18.7026 5.25279 18.9968 6.11382 18.9968 6.99993C18.9968 7.88604 18.7026 8.74707 18.1602 9.44787C17.6179 10.1487 16.8582 10.6496 16.0004 10.8719M22.0009 20.9999V18.9999C22.0002 18.1136 21.7052 17.2527 21.1622 16.5522C20.6191 15.8517 19.8588 15.3515 19.0006 15.1299M13.0001 7C13.0001 9.20914 11.2091 11 8.99983 11C6.79051 11 4.99951 9.20914 4.99951 7C4.99951 4.79086 6.79051 3 8.99983 3C11.2091 3 13.0001 4.79086 13.0001 7Z"
        stroke="#002366"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.492 16.6299C14.2715 16.685 14.0388 16.6633 13.8322 16.5684C11.0544 15.2051 8.80649 12.96 7.4397 10.1839C7.33848 9.97628 7.31225 9.74 7.36549 9.51522C7.41872 9.29044 7.54813 9.09101 7.73173 8.95082L8.19976 8.5998C8.44818 8.41349 8.6498 8.1719 8.78867 7.89417C8.92753 7.61643 8.99983 7.31018 8.99983 6.99967V3.99943C8.99983 3.46895 8.7891 2.9602 8.41399 2.5851C8.03889 2.21 7.53014 1.99927 6.99967 1.99927H3.99943C3.46895 1.99927 2.9602 2.21 2.5851 2.5851C2.21 2.9602 1.99927 3.46895 1.99927 3.99943C1.99927 8.77371 3.89584 13.3524 7.27177 16.7284C10.6477 20.1043 15.2264 22.0009 20.0007 22.0009C20.5312 22.0009 21.0399 21.7901 21.415 21.415C21.7901 21.0399 22.0009 20.5312 22.0009 20.0007V17.0005C22.0009 16.47 21.7901 15.9612 21.415 15.5861C21.0399 15.211 20.5312 15.0003 20.0007 15.0003H17.0005C16.69 15.0003 16.3837 15.0726 16.106 15.2115C15.8282 15.3503 15.5866 15.552 15.4003 15.8004L15.0453 16.2654C14.9076 16.4462 14.7125 16.5748 14.492 16.6299Z"
        stroke="#002366"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M13.2656 11.0969C14.0312 10.2875 14.5 9.2 14.5 8C14.5 5.51562 12.4844 3.5 10 3.5C7.51562 3.5 5.5 5.51562 5.5 8C5.5 9.2 5.96875 10.2875 6.73438 11.0969C7.4 11.7969 8.1375 12.7844 8.4 14H11.6C11.8625 12.7812 12.6 11.7969 13.2656 11.0969ZM14.3531 12.1281C13.6156 12.9062 13 13.8563 13 14.9281V15.5C13 16.8813 11.8812 18 10.5 18H9.5C8.11875 18 7 16.8813 7 15.5V14.9281C7 13.8563 6.38437 12.9062 5.64687 12.1281C4.625 11.0531 4 9.6 4 8C4 4.6875 6.6875 2 10 2C13.3125 2 16 4.6875 16 8C16 9.6 15.375 11.0531 14.3531 12.1281ZM8.5 7.75C8.5 8.16563 8.16563 8.5 7.75 8.5C7.33437 8.5 7 8.16563 7 7.75C7 6.23125 8.23125 5 9.75 5C10.1656 5 10.5 5.33437 10.5 5.75C10.5 6.16563 10.1656 6.5 9.75 6.5C9.05937 6.5 8.5 7.05937 8.5 7.75Z"
        fill="#0053E0"
      />
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

export default function CustomTripForm({
  eyebrow = "BUILD YOUR JOURNEY",
  title = "客製包團需求單",
  description = "請填寫以下資訊，我們將在 24 小時內與您聯繫。",
  showHeading = true,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  showHeading?: boolean;
} = {}) {
  const [companionNeeds, setCompanionNeeds] = useState<Set<string>>(new Set());
  const [includesFlight, setIncludesFlight] = useState<"with" | "without" | null>(null);
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
      className={`flex scroll-mt-24 flex-col items-stretch gap-7 px-4 pb-14 sm:px-8 lg:px-[160px] lg:pb-[72px] ${
        showHeading ? "pt-8 lg:pt-10" : ""
      }`}
    >
      {showHeading && (
        <div className="flex w-full flex-col gap-2">
          <span className="text-xs font-semibold tracking-[0.1833em] text-[#0053E0]">
            {eyebrow}
          </span>
          <h2 className="font-serif text-[28px] font-bold text-[#090909] sm:text-[34px]">
            {title}
          </h2>
          <p className="text-sm leading-[1.6] text-[#535F71]">{description}</p>
        </div>
      )}

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

"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import TurnstileWidget from "@/components/ui/TurnstileWidget";
import { ApiError } from "@/lib/api/client";
import { inquiriesApi } from "@/lib/api/endpoints/inquiries";
import { priceAffixes } from "@/lib/currency";
import type { TripDetail } from "@/components/trip-detail/types";
import Dropdown from "@/components/ui/Dropdown";

const TIME_SLOTS = ["上午（09:00-12:00）", "下午（13:00-17:00）", "晚上（18:00-20:00）"];

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

export default function ContactForm({ trip }: { trip: TripDetail | null }) {
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [preferredTime, setPreferredTime] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleToken = useCallback((token: string | null) => setTurnstileToken(token), []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!agreed || isSubmitting) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const field = (name: string) => String(data.get(name) ?? "").trim();

    setError(null);
    if (!trip) {
      setError("請從行程頁面點選「立即洽詢」進行行程洽詢。");
      return;
    }
    if (!field("phone") && !field("lineId")) {
      setError("聯絡電話與 Line ID 請至少填寫一項。");
      return;
    }

    setIsSubmitting(true);
    try {
      await inquiriesApi.submitTrip({
        trip_code: trip.groupCode,
        name: field("name"),
        email: field("email"),
        phone: field("phone"),
        line_id: field("lineId"),
        company: field("company"),
        preferred_contact_time: preferredTime,
        message: field("note"),
        consent: agreed,
        turnstile_token: turnstileToken,
        website: field("website"),
      });
      setSubmitted(true);
      form.reset();
      setPreferredTime("");
      setAgreed(false);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? (err.detail as { error?: { message?: string } } | undefined)?.error?.message
          : undefined;
      setError(message ?? "送出失敗，請稍後再試。");
    } finally {
      setIsSubmitting(false);
      // A Turnstile token is single-use: issue a fresh challenge after each attempt.
      setTurnstileToken(null);
      setTurnstileResetKey((key) => key + 1);
    }
  };

  return (
    <div
      className="flex flex-col gap-7 px-4 py-14 sm:px-8 lg:px-[160px] lg:py-[72px]"
      style={{
        background:
          "linear-gradient(90deg, rgba(237, 250, 251, 0.5) 0%, rgba(252, 251, 249, 0.5) 52%, rgba(244, 249, 255, 0.5) 100%), #FAFAFA",
      }}
    >
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold tracking-[0.1833em] text-[#0053E0]">CONTACT US</span>
        <h1 className="font-serif text-[34px] font-bold text-[#090909]">立即洽詢</h1>
        <p className="text-[15px] leading-[1.6] text-[#535F71]">
          請留下您的聯絡方式，我們將盡快為您安排行程諮詢。
        </p>
      </div>

      {trip && (
        <div className="flex flex-col items-stretch gap-4 rounded-xl bg-white p-4 shadow-[0px_18px_46px_0px_rgba(20,41,71,0.12)] sm:flex-row sm:items-center">
          <div className="relative h-[120px] w-full shrink-0 overflow-hidden rounded-[10px] sm:h-[120px] sm:w-[170px]">
            <Image src={trip.heroImage} alt={trip.title} fill className="object-cover" />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <span className="text-xs font-medium text-[#535F71]">您諮詢的行程</span>
            <span className="font-serif text-lg font-semibold leading-[1.4] text-[#090909]">
              {trip.title}
            </span>
            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[13px] text-[#535F71]">
              <span>{trip.startDate}出發</span>
              <span className="text-[#E0E3E8]">｜</span>
              <span>團號 {trip.groupCode}</span>
              <span className="text-[#E0E3E8]">｜</span>
              <span className="text-[15px] font-bold text-[#0053E0]">
                {priceAffixes(trip.currency).prefix} {trip.price} {priceAffixes(trip.currency).suffix}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-[28px] bg-white shadow-[0px_18px_46px_0px_rgba(20,41,71,0.12)]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-6 py-8 sm:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#DBE8FF]">
              <PhoneIcon />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-[#090909]">聯絡資訊</h2>
              <p className="text-sm leading-[1.55] text-[#535F71]">
                留下方便聯絡的方式，顧問會先確認需求，再提供初步方向與後續建議。
              </p>
            </div>
          </div>

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

          <Field label="備註">
            <textarea
              name="note"
              maxLength={300}
              placeholder="其他備註（300 字以內）"
              rows={5}
              className="w-full resize-none rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 py-3 text-sm text-[#090909] placeholder:text-[#888888] focus:border-[#0053E0] focus:outline-none"
            />
          </Field>

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

          {/* Honeypot for bots: hidden from people, must stay empty. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />
          <TurnstileWidget onToken={handleToken} resetKey={turnstileResetKey} />
          {error && <p className="text-sm font-medium text-[#C71A1A]">{error}</p>}
          <button
            type="submit"
            disabled={!agreed || isSubmitting}
            className="flex h-14 w-full cursor-pointer items-center justify-center rounded-xl bg-[#0053E0] text-[17px] font-medium text-white transition hover:bg-[#0044b8] disabled:cursor-not-allowed disabled:bg-[#B7CCF2]"
          >
            {isSubmitting ? "送出中…" : "提交"}
          </button>

          {submitted && (
            <p className="text-center text-sm font-medium text-[#0053E0]">
              已收到您的洽詢，我們將盡快與您聯繫。
            </p>
          )}
        </form>
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

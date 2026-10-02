"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/api/auth-context";
import { ApiError } from "@/lib/api/client";

const inputClass =
  "h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none transition-colors focus:border-[#0053E0] focus:bg-white";

/** Only allow returning to admin pages (never an external or arbitrary URL). */
function safeRedirect(target: string | null): string {
  return target && target.startsWith("/admin/") && !target.startsWith("//") ? target : "/admin/dashboard";
}

export default function AdminLoginPage() {
  return (
    // useSearchParams needs a Suspense boundary.
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get("redirect"));
  const router = useRouter();
  const { user, isLoading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) router.replace(redirectTo);
  }, [isLoading, user, router, redirectTo]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      router.replace(redirectTo);
    } catch (err) {
      if (err instanceof ApiError && err.status < 500) {
        const message = (err.detail as { error?: { message?: string } } | undefined)?.error
          ?.message;
        setError(message ?? "帳號或密碼錯誤");
      } else {
        setError("登入失敗，請稍後再試");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="relative h-12 w-[68px] shrink-0">
              <Image src="/images/logo-mark.png" alt="" fill className="object-contain" priority />
            </span>
            <span className="relative h-10 w-[100px] shrink-0">
              <Image
                src="/images/logo-text.png"
                alt="嘉新旅行社 Chia Hsin Travel"
                fill
                className="object-contain"
                priority
              />
            </span>
          </div>
          <p className="text-xs leading-[1.3em] tracking-[0.1em] text-[#535F71]">
            Management Dashboard
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#E0E3E8] bg-white p-8 shadow-sm"
        >
          <h1 className="text-xl font-bold text-[#0A0A0C]">後台登入</h1>
          <p className="mt-1 mb-6 text-sm text-[#535F71]">請使用管理員帳號登入</p>

          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-[7px]">
              <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">電子郵件</span>
              <input
                type="email"
                required
                autoComplete="username"
                autoFocus
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-[7px]">
              <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">密碼</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 my-auto h-7 cursor-pointer rounded-md px-2 text-xs font-bold text-[#535F71] hover:bg-[#F0F2F5]"
                >
                  {showPassword ? "隱藏" : "顯示"}
                </button>
              </div>
            </label>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 h-11 cursor-pointer rounded-xl bg-[#0053E0] text-[15px] font-bold text-white transition-colors hover:bg-[#0046BD] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "登入中…" : "登入"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-[#8A94A6]">
          © {new Date().getFullYear()} 嘉新旅行社 Chia Hsin Travel
        </p>
      </div>
    </div>
  );
}

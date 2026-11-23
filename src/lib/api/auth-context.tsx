"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import AdminConfirmDialog from "@/components/admin/ui/AdminConfirmDialog";
import { onSessionExpired, refreshSession } from "./client";
import { authApi } from "./endpoints/auth";
import { setAccessToken } from "./token-store";
import type { AdminUser, LoginIn, LoginOut } from "./types/auth";

const SESSION_FLAG_COOKIE = "chx_session";

function setSessionFlagCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_FLAG_COOKIE}=1; path=/; max-age=2592000; SameSite=Lax`;
}

function clearSessionFlagCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_FLAG_COOKIE}=; path=/; max-age=0`;
}

/**
 * 本機開發（npm run dev）沒有登入狀態時，用 .env.local 的帳密自動登入（見 /api/dev-login）。
 * 正式環境這段會被移除；沒設定帳密時回 null，照常顯示登入頁。
 */
let devLoginPromise: Promise<LoginOut | null> | null = null;

function devAutoLogin(): Promise<LoginOut | null> {
  if (process.env.NODE_ENV !== "development") return Promise.resolve(null);
  // Shared like refreshSession: the backend keeps one refresh token per account and rotates it on
  // every login, so two parallel logins (Strict Mode runs effects twice) can leave the browser with
  // the cookie of the losing one — the session then "expires" at the first refresh and pages show
  //「資料載入失敗」.
  if (!devLoginPromise) {
    devLoginPromise = fetch("/api/dev-login", { method: "POST", credentials: "include" })
      .then(async (res) => (res.ok ? ((await res.json()) as LoginOut) : null))
      .catch(() => null)
      .finally(() => {
        devLoginPromise = null;
      });
  }
  return devLoginPromise;
}

type AuthContextValue = {
  user: AdminUser | null;
  isLoading: boolean;
  login: (payload: LoginIn) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Bumped on login/logout so a slower startup refresh can't overwrite a newer session.
  const sessionVersionRef = useRef(0);
  const router = useRouter();
  const pathname = usePathname();
  const [sessionExpired, setSessionExpired] = useState(false);
  // Cached admin data (and failed requests) belong to the previous session: drop them whenever the
  // session changes, so the next page fetches fresh instead of flashing a stale「載入失敗」.
  const queryClient = useQueryClient();

  // An authenticated request failed and the session couldn't be refreshed: ask to log in again
  // instead of silently redirecting, so the person knows why (unsaved edits are lost).
  useEffect(() => onSessionExpired(() => setSessionExpired(true)), []);

  const goToLogin = () => {
    sessionVersionRef.current += 1;
    setAccessToken(null);
    clearSessionFlagCookie();
    setSessionExpired(false);
    setUser(null);
    queryClient.clear();
    const back = pathname && pathname !== "/admin/login" ? `?redirect=${encodeURIComponent(pathname)}` : "";
    router.replace(`/admin/login${back}`);
  };

  useEffect(() => {
    let cancelled = false;
    const startVersion = sessionVersionRef.current;

    refreshSession()
      .then((result) => result ?? devAutoLogin())
      .then((result) => {
        if (cancelled || sessionVersionRef.current !== startVersion) return;
        if (result) {
          // The dev auto-login is not shared with refreshSession, so set its token only here,
          // after confirming no manual login happened meanwhile.
          setAccessToken(result.access_token);
          setSessionFlagCookie();
          setUser({ display_name: result.display_name, staff_code: result.staff_code });
        } else {
          setAccessToken(null);
          clearSessionFlagCookie();
          setUser(null);
        }
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (payload: LoginIn) => {
    const result = await authApi.login(payload);
    sessionVersionRef.current += 1;
    queryClient.clear();
    setAccessToken(result.access_token);
    setSessionFlagCookie();
    // A request that failed after the expiry dialog was dismissed may have set this again.
    setSessionExpired(false);
    setUser({ display_name: result.display_name, staff_code: result.staff_code });
    setIsLoading(false);
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      sessionVersionRef.current += 1;
      setAccessToken(null);
      clearSessionFlagCookie();
      setSessionExpired(false);
      setUser(null);
      queryClient.clear();
    }
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
      {sessionExpired && user && (
        <AdminConfirmDialog
          title="登入已逾期"
          message="為保護帳號安全，登入狀態已過期，請重新登入後再繼續操作。尚未儲存的修改將不會保留。"
          confirmLabel="重新登入"
          cancelLabel={null}
          onConfirm={goToLogin}
        />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

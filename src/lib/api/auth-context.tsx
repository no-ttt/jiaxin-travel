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
import AdminConfirmDialog from "@/components/admin/ui/AdminConfirmDialog";
import { onSessionExpired, refreshSession } from "./client";
import { authApi } from "./endpoints/auth";
import { setAccessToken } from "./token-store";
import type { AdminUser, LoginIn } from "./types/auth";

const SESSION_FLAG_COOKIE = "chx_session";

function setSessionFlagCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_FLAG_COOKIE}=1; path=/; max-age=2592000; SameSite=Lax`;
}

function clearSessionFlagCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_FLAG_COOKIE}=; path=/; max-age=0`;
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

  // An authenticated request failed and the session couldn't be refreshed: ask to log in again
  // instead of silently redirecting, so the person knows why (unsaved edits are lost).
  useEffect(() => onSessionExpired(() => setSessionExpired(true)), []);

  const goToLogin = () => {
    sessionVersionRef.current += 1;
    setAccessToken(null);
    clearSessionFlagCookie();
    setSessionExpired(false);
    setUser(null);
    const back = pathname && pathname !== "/admin/login" ? `?redirect=${encodeURIComponent(pathname)}` : "";
    router.replace(`/admin/login${back}`);
  };

  useEffect(() => {
    let cancelled = false;
    const startVersion = sessionVersionRef.current;

    refreshSession().then((result) => {
      if (cancelled || sessionVersionRef.current !== startVersion) return;
      if (result) {
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
    setAccessToken(result.access_token);
    setSessionFlagCookie();
    // A request that failed after the expiry dialog was dismissed may have set this again.
    setSessionExpired(false);
    setUser({ display_name: result.display_name, staff_code: result.staff_code });
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      sessionVersionRef.current += 1;
      setAccessToken(null);
      clearSessionFlagCookie();
      setSessionExpired(false);
      setUser(null);
    }
  }, []);

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

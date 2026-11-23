import type { Metadata } from "next";
import NotFoundView from "@/components/not-found/NotFoundView";

export const metadata: Metadata = {
  title: "找不到頁面｜嘉新旅遊",
};

/** Any URL that matches no route (and any notFound() without a closer not-found.tsx). */
export default function NotFound() {
  return <NotFoundView />;
}

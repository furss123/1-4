import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/SiteFooter";

type PageFrameProps = {
  children: ReactNode;
  mainClassName?: string;
};

export function PageFrame({ children, mainClassName = "" }: PageFrameProps) {
  return (
    <div className="relative mx-auto flex min-h-full w-full max-w-app flex-col bg-surface-end">
      <Header />
      <main className={`flex-1 ${mainClassName}`}>{children}</main>
      <SiteFooter />
    </div>
  );
}

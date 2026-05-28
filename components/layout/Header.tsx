"use client";

import { useState } from "react";
import { HeaderIllustration, IconMenu, IconSchool } from "@/components/icons";
import { APP_SUBTITLE, APP_TITLE, SCHOOL_NAME } from "@/lib/constants";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-surface">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary">
            <IconSchool />
          </span>
          {SCHOOL_NAME}
        </div>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-card active:bg-border"
          aria-label="메뉴 열기"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <IconMenu className="h-6 w-6" />
        </button>
      </div>

      {menuOpen ? (
        <nav
          className="mx-4 mb-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-ink-muted shadow-sm"
          aria-label="메뉴"
        >
          <p>1학년 4반 수행평가 안내</p>
          <p className="mt-1 text-xs">일정·제출 방법·문의 안내</p>
        </nav>
      ) : null}

      <div className="relative px-4 pb-5 pt-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 pt-1">
            <h1 className="text-[1.625rem] font-bold leading-tight tracking-tight text-ink">
              {APP_TITLE}
            </h1>
            <p className="mt-2 text-sm font-medium leading-relaxed text-ink-muted">
              {APP_SUBTITLE}
            </p>
          </div>
          <HeaderIllustration className="h-[5.5rem] w-[5.5rem] shrink-0" />
        </div>
      </div>
    </header>
  );
}

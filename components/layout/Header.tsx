"use client";

import Image from "next/image";
import { useState } from "react";
import { HeaderIllustration, IconMenu } from "@/components/icons";
import { APP_SUBTITLE, APP_TITLE, SCHOOL_NAME } from "@/lib/constants";
import { publicAsset } from "@/lib/asset";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const logoSrc = publicAsset("/logo-namak.png");

  return (
    <header className="bg-hero-gradient">
      <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Image
            src={logoSrc}
            alt={`${SCHOOL_NAME} 로고`}
            width={72}
            height={72}
            className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-full object-cover shadow-card ring-[3px] ring-white"
            priority
            unoptimized
          />
          <div className="min-w-0">
            <p className="text-lg font-bold leading-tight text-school">{SCHOOL_NAME}</p>
            <p className="mt-0.5 text-xs font-medium text-ink-muted">1학년 4반</p>
          </div>
        </div>
        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card text-ink-muted shadow-menu transition-transform active:scale-95"
          aria-label="메뉴 열기"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <IconMenu className="h-5 w-5" />
        </button>
      </div>

      {menuOpen ? (
        <nav
          className="mx-4 mb-2 rounded-card border border-border/50 bg-card px-4 py-3 text-sm font-medium text-ink-muted shadow-soft"
          aria-label="메뉴"
        >
          <p className="font-bold text-school">1학년 4반 수행평가</p>
          <p className="mt-1 text-xs">일정 · 제출 방법 · 문의</p>
        </nav>
      ) : null}

      <div className="relative px-4 pb-6 pt-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-school">
              {APP_TITLE}
            </h1>
            <p className="mt-2 text-sm font-medium leading-relaxed text-ink-muted">
              {APP_SUBTITLE}
            </p>
          </div>
          <HeaderIllustration className="h-[5.25rem] w-[5.25rem] shrink-0 drop-shadow-sm" />
        </div>
      </div>
    </header>
  );
}

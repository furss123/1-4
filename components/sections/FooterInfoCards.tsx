"use client";

import { useState } from "react";
import { IconMegaphone, IconQuestion } from "@/components/icons";
import { INQUIRY_CONTACT } from "@/lib/constants";

const NOTICE_ITEMS = [
  "일정은 학교·담임 선생님 안내에 따라 변경될 수 있습니다.",
  "마감 하루 전에는 파일 형식과 용량을 다시 확인해 주세요.",
  "완료 표시는 제출 후 담임 선생님 확인을 기준으로 합니다.",
] as const;

export function FooterInfoCards() {
  const [noticeOpen, setNoticeOpen] = useState(false);

  return (
    <div className="space-y-3 px-4 pb-2">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setNoticeOpen((v) => !v)}
          aria-expanded={noticeOpen}
          className="flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-2xl border border-border/60 bg-card px-3 py-4 shadow-sm transition-transform active:scale-[0.98]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <IconMegaphone />
          </span>
          <span className="text-sm font-bold text-ink">유의사항</span>
        </button>

        <a
          href={INQUIRY_CONTACT.href}
          className="flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-2xl border border-border/60 bg-card px-3 py-4 shadow-sm transition-transform active:scale-[0.98]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary">
            <IconQuestion />
          </span>
          <span className="text-sm font-bold text-ink">문의하기</span>
        </a>
      </div>

      {noticeOpen ? (
        <div className="rounded-2xl border border-amber-100 bg-card px-4 py-3 shadow-sm">
          <ul className="space-y-2">
            {NOTICE_ITEMS.map((item) => (
              <li key={item} className="flex gap-2 text-sm font-medium leading-relaxed text-ink-muted">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-500" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

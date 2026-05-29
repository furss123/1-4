"use client";

import { useState } from "react";
import { IconMegaphone, IconQuestion } from "@/components/icons";
import { INQUIRY_CONTACT } from "@/lib/constants";

const NOTICE_ITEMS = [
  "일정은 학교·담임 선생님 안내에 따라 변경될 수 있습니다.",
  "제출 형식·파일 용량·AI 활용 규정을 꼭 확인해 주세요.",
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
          className="flex min-h-[120px] flex-col items-start gap-2 rounded-card bg-card p-4 text-left shadow-card transition-transform active:scale-[0.99]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary">
            <IconMegaphone className="h-5 w-5" />
          </span>
          <span className="text-sm font-bold text-school">유의사항</span>
          <span className="text-xs font-medium leading-relaxed text-ink-muted">
            제출 형식·AI 활용 규정 등을 확인하세요.
          </span>
        </button>

        <a
          href={INQUIRY_CONTACT.href}
          className="flex min-h-[120px] flex-col items-start gap-2 rounded-card bg-card p-4 text-left shadow-card transition-transform active:scale-[0.99]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary">
            <IconQuestion className="h-5 w-5" />
          </span>
          <span className="text-sm font-bold text-school">문의하기</span>
          <span className="text-xs font-medium leading-relaxed text-ink-muted">
            궁금한 점은 담임 선생님께 문의해 주세요.
          </span>
        </a>
      </div>

      {noticeOpen ? (
        <div className="rounded-card bg-card px-4 py-3 shadow-soft">
          <ul className="space-y-2">
            {NOTICE_ITEMS.map((item) => (
              <li key={item} className="flex gap-2 text-sm font-medium leading-relaxed text-ink-muted">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { IconCalendar, IconHome, IconUpload, IconUser } from "@/components/icons";

export type NavTab = "home" | "schedule" | "submission" | "mypage";

type BottomNavProps = {
  active: NavTab;
  onChange: (tab: NavTab) => void;
};

const NAV_ITEMS: { id: NavTab; label: string; Icon: typeof IconHome }[] = [
  { id: "home", label: "홈", Icon: IconHome },
  { id: "schedule", label: "일정", Icon: IconCalendar },
  { id: "submission", label: "제출방법", Icon: IconUpload },
  { id: "mypage", label: "마이페이지", Icon: IconUser },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 z-30 w-full max-w-app -translate-x-1/2 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(15,23,42,0.08)] backdrop-blur-md"
      aria-label="하단 메뉴"
    >
      <ul className="grid grid-cols-4">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const selected = active === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onChange(id)}
                aria-current={selected ? "page" : undefined}
                className={`flex min-h-[56px] w-full flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-bold transition-colors ${
                  selected ? "text-primary" : "text-ink-subtle hover:text-ink-muted"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                    selected ? "bg-primary-light" : "bg-transparent"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

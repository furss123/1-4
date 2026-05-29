"use client";

import type { SubjectFilter } from "@/types/assessment";

type FilterBarProps = {
  subjects: readonly string[];
  active: SubjectFilter;
  onChange: (subject: SubjectFilter) => void;
};

export function FilterBar({ subjects, active, onChange }: FilterBarProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto px-4 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="과목 필터"
    >
      {subjects.map((subject) => {
        const selected = active === subject;
        return (
          <button
            key={subject}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(subject)}
            className={`min-h-10 shrink-0 rounded-full px-5 text-sm font-bold transition-all active:scale-[0.98] ${
              selected
                ? "bg-primary text-white shadow-soft"
                : "bg-filter-inactive text-ink-muted"
            }`}
          >
            {subject}
          </button>
        );
      })}
    </div>
  );
}

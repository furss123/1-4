"use client";

import { useEffect, useState } from "react";
import { IconMeal } from "@/components/icons";
import { fetchTodayMealsClient } from "@/lib/neis/fetch-meals-client";
import type { TodayMeals } from "@/lib/neis/parse-meal";
import { SCHOOL_NAME } from "@/lib/constants";

function MealColumn({
  label,
  dishes,
  calories,
}: {
  label: string;
  dishes: string[];
  calories: string | null;
}) {
  const hasMenu = dishes.length > 0;

  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-bold text-school">{label}</span>
        {calories ? (
          <span className="font-numeric shrink-0 text-[11px] font-semibold text-ink-subtle">
            {calories}
          </span>
        ) : null}
      </div>

      {hasMenu ? (
        <ul className="mt-2.5 space-y-1.5">
          {dishes.map((dish) => (
            <li
              key={dish}
              className="flex gap-2 text-[13px] font-medium leading-snug text-ink-muted"
            >
              <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-primary/70" />
              <span className="min-w-0">{dish}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2.5 text-[13px] font-medium text-ink-subtle">식단 없음</p>
      )}
    </div>
  );
}

export function TodayMealCard() {
  const [meals, setMeals] = useState<TodayMeals | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchTodayMealsClient()
      .then((data) => {
        if (!cancelled) setMeals(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "급식 정보를 불러오지 못했습니다.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="px-4 pb-2" aria-label="오늘의 급식">
      <div className="overflow-hidden rounded-card border border-border/50 bg-card shadow-card">
        <div className="border-b border-border/60 bg-primary-light/40 px-4 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-soft">
              <IconMeal className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-school">{SCHOOL_NAME} 오늘의 급식</h2>
              <p className="font-numeric mt-0.5 text-xs font-semibold text-ink-muted">
                {meals?.dateLabel ?? "불러오는 중…"}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 py-4">
          {error ? (
            <p className="text-center text-[13px] font-medium text-ink-muted">{error}</p>
          ) : meals === null ? (
            <p className="text-center text-[13px] font-medium text-ink-muted">
              급식 메뉴를 불러오는 중…
            </p>
          ) : (
            <div className="flex gap-4">
              <MealColumn label="중식" dishes={meals.lunch} calories={meals.lunchCalories} />
              <div className="w-px shrink-0 self-stretch bg-border/80" aria-hidden />
              <MealColumn label="석식" dishes={meals.dinner} calories={meals.dinnerCalories} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

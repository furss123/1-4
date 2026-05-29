export type MealSlot = "lunch" | "dinner";

export type TodayMeals = {
  dateLabel: string;
  lunch: string[];
  dinner: string[];
  lunchCalories: string | null;
  dinnerCalories: string | null;
};

type NeisMealRow = {
  MMEAL_SC_CODE?: string;
  MMEAL_SC_NM?: string;
  DDISH_NM?: string;
  CAL_INFO?: string;
};

/** NEIS 요리명 문자열 → 메뉴 목록 (알레르기 번호 제외) */
export function parseDishNames(ddishNm: string): string[] {
  const trimmed = ddishNm.trim();
  if (!trimmed) return [];

  const dishes: string[] = [];
  const re = /([^(]+?)(?:\s*\([0-9.]+\))?\s*/g;
  let match: RegExpExecArray | null;

  while ((match = re.exec(trimmed)) !== null) {
    const name = match[1].trim();
    if (name) dishes.push(name);
  }

  return dishes;
}

function formatKoreaDateLabel(ymd: string): string {
  const year = Number(ymd.slice(0, 4));
  const month = Number(ymd.slice(4, 6));
  const day = Number(ymd.slice(6, 8));
  const date = new Date(year, month - 1, day);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"] as const;
  const weekday = weekdays[date.getDay()];
  return `${month}월 ${day}일 (${weekday})`;
}

export function getKoreaYmd(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  return `${year}${month}${day}`;
}

function normalizeCalories(calInfo: string | undefined): string | null {
  if (!calInfo?.trim()) return null;
  return calInfo.replace(/\s*Kcal/i, " kcal").trim();
}

export function rowsToTodayMeals(rows: NeisMealRow[], ymd: string): TodayMeals {
  let lunch: string[] = [];
  let dinner: string[] = [];
  let lunchCalories: string | null = null;
  let dinnerCalories: string | null = null;

  for (const row of rows) {
    const dishes = parseDishNames(row.DDISH_NM ?? "");
    const calories = normalizeCalories(row.CAL_INFO);

    if (row.MMEAL_SC_CODE === "3" || row.MMEAL_SC_NM === "석식") {
      dinner = dishes;
      dinnerCalories = calories;
    } else if (row.MMEAL_SC_CODE === "2" || row.MMEAL_SC_NM === "중식") {
      lunch = dishes;
      lunchCalories = calories;
    }
  }

  return {
    dateLabel: formatKoreaDateLabel(ymd),
    lunch,
    dinner,
    lunchCalories,
    dinnerCalories,
  };
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

const GVIZ_DATE_RE = /^Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+)(?:,(\d+))?)?\)$/;
const KOREAN_FULL_DATE_RE =
  /(?:(\d{4})[.\-/년\s]*)?(\d{1,2})\s*월\s*(\d{1,2})\s*일(?:\s*\(([일월화수목금토])\))?/;
const SHORT_SLASH_DATE_RE = /^(?:(\d{4})[.\-/])?(\d{1,2})[.\-/](\d{1,2})(?:\D|$)/;
const DAY_ONLY_RE = /(?:^|\s)(\d{1,2})\s*일?(?:\s*\(([일월화수목금토])\))?(?:\s|$)/;
const DAY_WEEKDAY_RE = /(?:^|\s)(\d{1,2})\s*\(([일월화수목금토])\)(?:\s|$)/;
const WEEKDAY_ONLY_RE = /(?:^|\s)([월화수목금토])(?:요일)?(?:\s|$)/;
const PERIOD_RE = /(?:제)?(\d{1,2})\s*교시/;
const HOUR_RE = /(?:오전|오후)\s*(\d{1,2})\s*시|(?<![월일\d])(\d{1,2})\s*시(?!\s*간)|(\d{1,2}):(\d{2})/;

const NON_DATE_PHRASES =
  /^(수업\s*시간|수업시간|미정|없음|\-+|—+|n\/a|na|tbd|별도\s*안내)$/i;

function formatDatePart(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAYS[date.getDay()];
  return `${month}월${day}일(${weekday})`;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isValidCalendarDate(year: number, month: number, day: number): boolean {
  const d = new Date(year, month - 1, day);
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}

/** 가장 가까운 앞으로 다가올 날짜(수행평가 마감 기준) */
function pickNearestUpcoming(candidates: Date[]): Date | null {
  const today = startOfDay(new Date());
  const valid = candidates.filter((d) => !Number.isNaN(d.getTime()));
  if (valid.length === 0) return null;

  const upcoming = valid.filter((d) => startOfDay(d).getTime() >= today.getTime());
  const pool = upcoming.length > 0 ? upcoming : valid;

  return pool.sort((a, b) => startOfDay(a).getTime() - startOfDay(b).getTime())[0];
}

function resolveYearForMonthDay(month: number, day: number, weekdayHint?: string): number {
  const years = [new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1];
  let candidates = years
    .map((year) => new Date(year, month - 1, day))
    .filter((d) => d.getMonth() === month - 1 && d.getDate() === day);

  if (weekdayHint) {
    const target = WEEKDAYS.indexOf(weekdayHint as (typeof WEEKDAYS)[number]);
    if (target >= 0) {
      const matched = candidates.filter((d) => d.getDay() === target);
      if (matched.length > 0) candidates = matched;
    }
  }

  const picked = pickNearestUpcoming(candidates);
  return picked?.getFullYear() ?? new Date().getFullYear();
}

function parseGvizDate(value: string): Date | null {
  const match = value.trim().match(GVIZ_DATE_RE);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = match[4] != null ? Number(match[4]) : 0;
  const minute = match[5] != null ? Number(match[5]) : 0;
  const second = match[6] != null ? Number(match[6]) : 0;

  const date = new Date(year, month, day, hour, minute, second);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseIsoLikeDate(value: string): Date | null {
  const trimmed = value.trim();
  const iso = trimmed.match(
    /^(\d{4})[-./](\d{1,2})[-./](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?/,
  );
  if (!iso) return null;

  const date = new Date(
    Number(iso[1]),
    Number(iso[2]) - 1,
    Number(iso[3]),
    iso[4] != null ? Number(iso[4]) : 0,
    iso[5] != null ? Number(iso[5]) : 0,
    iso[6] != null ? Number(iso[6]) : 0,
  );
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseKoreanFullDate(value: string): Date | null {
  const match = value.match(KOREAN_FULL_DATE_RE);
  if (!match) return null;

  const month = Number(match[2]);
  const day = Number(match[3]);
  const weekdayHint = match[4];
  const year = match[1] ? Number(match[1]) : resolveYearForMonthDay(month, day, weekdayHint);

  if (!isValidCalendarDate(year, month, day)) return null;
  return new Date(year, month - 1, day);
}

/** `5/29`, `5.29`, `2025-5-29` — 연도 없으면 가장 가까운 해당 월·일 유추 */
function parseShortSlashDate(value: string): Date | null {
  const match = value.trim().match(SHORT_SLASH_DATE_RE);
  if (!match) return null;

  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const weekdayInText = value.match(/\(([일월화수목금토])\)/)?.[1];
  const year = match[1]
    ? Number(match[1])
    : resolveYearForMonthDay(month, day, weekdayInText);

  if (!isValidCalendarDate(year, month, day)) return null;
  return new Date(year, month - 1, day);
}

/** `29일`, `29일(목)` — 월이 없으면 오늘 기준으로 월·연도 유추 */
function parseDayOnly(value: string): Date | null {
  const match = value.match(DAY_ONLY_RE) ?? value.match(DAY_WEEKDAY_RE);
  if (!match) return null;

  const day = Number(match[1]);
  const weekdayHint = match[2];
  if (day < 1 || day > 31) return null;

  const today = startOfDay(new Date());

  if (weekdayHint) {
    const target = WEEKDAYS.indexOf(weekdayHint as (typeof WEEKDAYS)[number]);
    if (target < 0) return null;

    for (let monthOffset = 0; monthOffset < 24; monthOffset++) {
      const date = new Date(today.getFullYear(), today.getMonth() + monthOffset, day);
      if (date.getDate() !== day || date.getDay() !== target) continue;
      if (startOfDay(date).getTime() >= today.getTime()) return date;
    }
    return null;
  }

  const candidates: Date[] = [];
  for (let monthOffset = 0; monthOffset < 14; monthOffset++) {
    const date = new Date(today.getFullYear(), today.getMonth() + monthOffset, day);
    if (date.getDate() === day) candidates.push(date);
  }

  return pickNearestUpcoming(candidates);
}

/** `목`, `목요일`, `(목)` — 다음 해당 요일 */
function parseWeekdayOnly(value: string): Date | null {
  if (KOREAN_FULL_DATE_RE.test(value) || SHORT_SLASH_DATE_RE.test(value) || DAY_ONLY_RE.test(value)) {
    return null;
  }

  const paren = value.trim().match(/^\(([월화수목금토])\)$/);
  const match = paren ?? value.trim().match(WEEKDAY_ONLY_RE);
  if (!match) return null;

  const target = WEEKDAYS.indexOf(match[1] as (typeof WEEKDAYS)[number]);
  if (target < 0) return null;

  const today = startOfDay(new Date());
  for (let offset = 0; offset <= 370; offset++) {
    const date = new Date(today);
    date.setDate(date.getDate() + offset);
    if (date.getDay() === target) return date;
  }

  return null;
}

function parseSheetSerial(value: string): Date | null {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 20000 || num > 60000) return null;

  const utcMs = Math.round((num - 25569) * 86400 * 1000);
  const date = new Date(utcMs);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseDateFromText(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed || NON_DATE_PHRASES.test(trimmed)) return null;

  return (
    parseGvizDate(trimmed) ??
    parseIsoLikeDate(trimmed) ??
    parseKoreanFullDate(trimmed) ??
    parseShortSlashDate(trimmed) ??
    parseDayOnly(trimmed) ??
    parseWeekdayOnly(trimmed) ??
    parseSheetSerial(trimmed) ??
    (() => {
      const parsed = new Date(trimmed);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    })()
  );
}

/** Strip 교시·시각·까지 so only the date portion remains for parsing */
function stripTimeTokens(value: string): string {
  const trimmed = value.trim();
  if (GVIZ_DATE_RE.test(trimmed)) return trimmed;

  return trimmed
    .replace(PERIOD_RE, "")
    .replace(/(?:오전|오후)\s*\d{1,2}\s*시(?:\s*\d{1,2}\s*분)?/g, "")
    .replace(/(?<![월일\d])\d{1,2}\s*시(?!\s*간)/g, "")
    .replace(/\d{1,2}:\d{2}(?::\d{2})?/g, "")
    .replace(/까지/g, "")
    .replace(/[,\s·]+/g, " ")
    .trim();
}

function extractPeriod(value: string): string | null {
  const match = value.match(PERIOD_RE);
  if (!match) return null;
  return `${Number(match[1])}교시`;
}

/** 시각이 있으면 `10시` 형태만 반환 (오전/오후·분 제외) */
function extractHourOnly(value: string): string | null {
  if (/수업\s*시간|수업시간/i.test(value)) return null;

  const match = value.match(HOUR_RE);
  if (!match) return null;

  const hour = Number(match[1] ?? match[2] ?? match[3]);
  if (!Number.isFinite(hour) || hour < 0 || hour > 23) return null;
  return `${hour}시`;
}

function formatHourFromDate(date: Date): string | null {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  if (hour === 0 && minute === 0 && second === 0) return null;
  return `${hour}시`;
}

/**
 * 마감 일시 표기
 * - 기본: `5월29일(목)` (월·일·연도가 없으면 오늘 기준으로 유추)
 * - 교시: `5월29일(목) 3교시`
 * - 시각: `5월29일(목) 10시`
 */
export function formatDeadline(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (NON_DATE_PHRASES.test(trimmed)) return trimmed;

  const period = extractPeriod(trimmed);
  const hourOnly = period ? null : extractHourOnly(trimmed);

  const parsed =
    parseDateFromText(trimmed) ?? parseDateFromText(stripTimeTokens(trimmed));

  if (!parsed) {
    return trimmed;
  }

  const datePart = formatDatePart(parsed);

  if (period) {
    return `${datePart} ${period}`;
  }

  if (hourOnly) {
    return `${datePart} ${hourOnly}`;
  }

  const hourFromDate = formatHourFromDate(parsed);
  if (hourFromDate) {
    return `${datePart} ${hourFromDate}`;
  }

  return datePart;
}

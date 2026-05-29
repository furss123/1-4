const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

const GVIZ_DATE_RE = /^Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+)(?:,(\d+))?)?\)$/;
const KOREAN_DATE_RE =
  /(?:(\d{4})[.\-/년\s]*)?(\d{1,2})\s*월\s*(\d{1,2})\s*일(?:\s*\(([일월화수목금토])\))?/;
const SLASH_DATE_RE = /^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/;
const TIME_SUFFIX_RE =
  /(?:\s|,|·)*((?:\d{1,2}교시)|(?:오전|오후)\s*\d{1,2}(?::\d{2})?\s*시(?:\s*\d{1,2}\s*분)?|\d{1,2}:\d{2}(?::\d{2})?)\s*$/i;

function formatDatePart(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAYS[date.getDay()];
  return `${month}월${day}일(${weekday})`;
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

function resolveYearForMonthDay(month: number, day: number, weekdayHint?: string): number {
  const now = new Date();
  const candidates = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];

  if (weekdayHint) {
    const targetWeekday = WEEKDAYS.indexOf(weekdayHint as (typeof WEEKDAYS)[number]);
    if (targetWeekday >= 0) {
      const matched = candidates
        .map((year) => new Date(year, month - 1, day))
        .filter((date) => !Number.isNaN(date.getTime()) && date.getDay() === targetWeekday);
      if (matched.length > 0) {
        return matched.sort(
          (a, b) => Math.abs(a.getTime() - now.getTime()) - Math.abs(b.getTime() - now.getTime()),
        )[0].getFullYear();
      }
    }
  }

  let year = now.getFullYear();
  const thisYear = new Date(year, month - 1, day);
  if (thisYear.getTime() < now.getTime() - 183 * 86400000) {
    year += 1;
  }
  return year;
}

function parseKoreanDate(value: string): Date | null {
  const match = value.match(KOREAN_DATE_RE);
  if (!match) return null;

  const month = Number(match[2]);
  const day = Number(match[3]);
  const weekdayHint = match[4];
  const year = match[1]
    ? Number(match[1])
    : resolveYearForMonthDay(month, day, weekdayHint);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseSlashDate(value: string): Date | null {
  const match = value.trim().match(SLASH_DATE_RE);
  if (!match) return null;

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
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
  if (!trimmed) return null;

  return (
    parseGvizDate(trimmed) ??
    parseIsoLikeDate(trimmed) ??
    parseKoreanDate(trimmed) ??
    parseSlashDate(trimmed) ??
    parseSheetSerial(trimmed) ??
    (() => {
      const parsed = new Date(trimmed);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    })()
  );
}

function splitDateAndSuffix(raw: string): { dateText: string; timeSuffix: string | null } {
  const trimmed = raw.trim();
  const timeMatch = trimmed.match(TIME_SUFFIX_RE);
  if (!timeMatch) {
    return { dateText: trimmed, timeSuffix: null };
  }

  return {
    dateText: trimmed.slice(0, timeMatch.index).trim(),
    timeSuffix: timeMatch[1].trim(),
  };
}

function normalizePeriodSuffix(suffix: string): string {
  const trimmed = suffix.trim();

  const period = trimmed.match(/^(\d{1,2})교시$/);
  if (period) return `${Number(period[1])}교시`;

  const ampm = trimmed.match(/^(오전|오후)\s*(\d{1,2})(?::(\d{2}))?\s*시(?:\s*(\d{1,2})\s*분)?$/i);
  if (ampm) {
    const meridiem = ampm[1] === "오후" ? "오후" : "오전";
    const hour = Number(ampm[2]);
    const minute = ampm[3] != null ? Number(ampm[3]) : ampm[4] != null ? Number(ampm[4]) : 0;
    if (minute > 0) return `${meridiem}${hour}시${minute}분`;
    return `${meridiem}${hour}시`;
  }

  const clock = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (clock) {
    const hour = Number(clock[1]);
    const minute = Number(clock[2]);
    const meridiem = hour < 12 ? "오전" : "오후";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    if (minute > 0) return `${meridiem}${hour12}시${minute}분`;
    return `${meridiem}${hour12}시`;
  }

  return trimmed.replace(/\s+/g, "");
}

function formatTimeFromDate(date: Date): string | null {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  if (hour === 0 && minute === 0 && second === 0) return null;

  const meridiem = hour < 12 ? "오전" : "오후";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  if (minute > 0) return `${meridiem}${hour12}시${minute}분`;
  return `${meridiem}${hour12}시`;
}

/** 마감 일시: 날짜는 `5월29일(목)`, 교시·시간이 있으면 뒤에 붙임 */
export function formatDeadline(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const { dateText, timeSuffix } = splitDateAndSuffix(trimmed);
  const parsed = parseDateFromText(dateText || trimmed);

  if (!parsed) {
    if (timeSuffix) {
      const normalized = normalizePeriodSuffix(timeSuffix);
      const base = (dateText || trimmed).replace(/\s+/g, "");
      return base ? `${base} ${normalized}` : normalized;
    }
    return trimmed;
  }

  const datePart = formatDatePart(parsed);

  if (timeSuffix) {
    return `${datePart} ${normalizePeriodSuffix(timeSuffix)}`;
  }

  const fromDate = formatTimeFromDate(parsed);
  return fromDate ? `${datePart} ${fromDate}` : datePart;
}

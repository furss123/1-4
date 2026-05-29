const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

const GVIZ_DATE_RE = /^Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+)(?:,(\d+))?)?\)$/;
const KOREAN_DATE_RE =
  /(?:(\d{4})[.\-/년\s]*)?(\d{1,2})\s*월\s*(\d{1,2})\s*일(?:\s*\(([일월화수목금토])\))?/;
const SLASH_DATE_RE = /^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/;
const PERIOD_RE = /(?:제)?(\d{1,2})\s*교시/;
const HOUR_RE = /(?:오전|오후)\s*(\d{1,2})\s*시|(?<![월일\d])(\d{1,2})\s*시(?!\s*간)|(\d{1,2}):(\d{2})/;

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
  const year = match[1] ? Number(match[1]) : resolveYearForMonthDay(month, day, weekdayHint);
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

/** Strip 교시·시각·까지 so only the date portion remains for parsing */
function stripTimeTokens(value: string): string {
  return value
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
 * - 기본: `5월29일(목)`
 * - 교시: `5월29일(목) 3교시`
 * - 시각: `5월29일(목) 10시` (오전/오후·분 없이 시만)
 */
export function formatDeadline(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const period = extractPeriod(trimmed);
  const hourOnly = period ? null : extractHourOnly(trimmed);
  const dateText = stripTimeTokens(trimmed);
  const parsed = parseDateFromText(dateText || trimmed);

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

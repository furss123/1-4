import type { Assessment } from "@/types/assessment";
import { isClassTimeDeadline, parseDeadlineDate } from "@/lib/format-deadline";

type DeadlineSortTier = 0 | 1 | 2;

function getDeadlineSortTier(deadline: string): DeadlineSortTier {
  if (isClassTimeDeadline(deadline)) return 2;
  if (parseDeadlineDate(deadline)) return 0;
  return 1;
}

function getDeadlineTimestamp(deadline: string): number {
  const parsed = parseDeadlineDate(deadline);
  return parsed?.getTime() ?? Number.MAX_SAFE_INTEGER;
}

function compareById(a: Assessment, b: Assessment): number {
  const numA = Number.parseInt(a.id, 10);
  const numB = Number.parseInt(b.id, 10);
  if (!Number.isNaN(numA) && !Number.isNaN(numB)) return numA - numB;
  return a.id.localeCompare(b.id, "ko");
}

/** 마감 일시가 가까운 순 · 수업시간 진행 항목은 하단 */
export function sortAssessmentsByDeadline(items: Assessment[]): Assessment[] {
  return [...items].sort((a, b) => {
    const tierA = getDeadlineSortTier(a.deadline);
    const tierB = getDeadlineSortTier(b.deadline);
    if (tierA !== tierB) return tierA - tierB;

    if (tierA === 0) {
      const timeA = getDeadlineTimestamp(a.deadline);
      const timeB = getDeadlineTimestamp(b.deadline);
      if (timeA !== timeB) return timeA - timeB;
    }

    return compareById(a, b);
  });
}

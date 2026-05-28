import type { Assessment, ProgressStatus } from "@/types/assessment";

const VISIBLE_STATUSES: ProgressStatus[] = ["진행 중", "마감 임박"];

/** '진행 중', '마감 임박'만 표시 — '완료', '진행 예정' 제외 */
export function filterInProgressAssessments(items: Assessment[]): Assessment[] {
  return items.filter((item) => VISIBLE_STATUSES.includes(item.status));
}

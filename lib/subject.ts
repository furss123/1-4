import type { Assessment, SubjectFilter } from "@/types/assessment";
import { SUBJECT_FILTERS } from "@/lib/constants";

export const CORE_SUBJECTS = ["국어", "과학", "영어"] as const;

export function matchesSubjectFilter(
  assessment: Assessment,
  filter: SubjectFilter,
): boolean {
  if (filter === "전체") return true;
  if (filter === "기타") {
    return !CORE_SUBJECTS.includes(assessment.subject as (typeof CORE_SUBJECTS)[number]);
  }
  return assessment.subject === filter;
}

export function getSubjectFilters(): readonly SubjectFilter[] {
  return SUBJECT_FILTERS;
}

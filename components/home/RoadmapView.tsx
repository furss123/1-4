"use client";

import { useMemo, useState } from "react";
import { FilterBar } from "@/components/filters/FilterBar";
import { AssessmentTable } from "@/components/tasks/AssessmentTable";
import { AnnouncementBanner } from "@/components/sections/AnnouncementBanner";
import { getSubjectFilters, matchesSubjectFilter } from "@/lib/subject";
import type { Assessment, SubjectFilter } from "@/types/assessment";

type RoadmapViewProps = {
  assessments: Assessment[];
  showAnnouncement?: boolean;
  showFilter?: boolean;
};

export function RoadmapView({
  assessments,
  showAnnouncement = true,
  showFilter = true,
}: RoadmapViewProps) {
  const [activeSubject, setActiveSubject] = useState<SubjectFilter>("전체");
  const subjects = getSubjectFilters();

  const filtered = useMemo(
    () => assessments.filter((a) => matchesSubjectFilter(a, activeSubject)),
    [assessments, activeSubject],
  );

  return (
    <div className="space-y-3">
      {showAnnouncement ? <AnnouncementBanner /> : null}
      {showFilter ? (
        <FilterBar subjects={subjects} active={activeSubject} onChange={setActiveSubject} />
      ) : null}

      {filtered.length > 0 ? (
        <AssessmentTable assessments={filtered} />
      ) : (
        <p className="mx-4 rounded-2xl border border-dashed border-border bg-card px-4 py-12 text-center text-sm font-medium text-ink-muted">
            진행 중·마감 임박 수행평가가 없습니다.
        </p>
      )}
    </div>
  );
}

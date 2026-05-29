"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/home/AppShell";
import { PageFrame } from "@/components/layout/PageFrame";
import { DataErrorBanner } from "@/components/sections/DataErrorBanner";
import { fetchPublicSheetAssessmentsClient } from "@/lib/google/public-sheet-client";
import type { Assessment } from "@/types/assessment";

export function HomePageContent() {
  const [assessments, setAssessments] = useState<Assessment[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchPublicSheetAssessmentsClient()
      .then((data) => {
        if (!cancelled) setAssessments(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "데이터를 불러오지 못했습니다.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <PageFrame mainClassName="space-y-4 px-0 pb-4">
        <div className="px-4">
          <DataErrorBanner message={error} />
        </div>
      </PageFrame>
    );
  }

  if (assessments === null) {
    return (
      <PageFrame mainClassName="flex items-center justify-center px-4 pb-4">
        <p className="text-sm font-medium text-ink-muted">수행평가 일정을 불러오는 중…</p>
      </PageFrame>
    );
  }

  if (assessments.length === 0) {
    return (
      <PageFrame mainClassName="space-y-4 pb-4">
        <p className="mx-4 rounded-card bg-card px-4 py-12 text-center text-sm font-medium text-ink-muted shadow-soft">
          진행 중·마감 임박 수행평가가 없습니다.
        </p>
      </PageFrame>
    );
  }

  return <AppShell assessments={assessments} />;
}

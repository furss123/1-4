"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/home/AppShell";
import { DataErrorBanner } from "@/components/sections/DataErrorBanner";
import { Header } from "@/components/layout/Header";
import { AnnouncementBanner } from "@/components/sections/AnnouncementBanner";
import { FooterInfoCards } from "@/components/sections/FooterInfoCards";
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
      <>
        <Header />
        <main className="space-y-4 px-0 pt-3 pb-10">
          <AnnouncementBanner />
          <div className="px-4">
            <DataErrorBanner message={error} />
          </div>
          <FooterInfoCards />
        </main>
      </>
    );
  }

  if (assessments === null) {
    return (
      <>
        <Header />
        <main className="flex min-h-[50vh] items-center justify-center px-4">
          <p className="text-sm font-medium text-ink-muted">수행평가 일정을 불러오는 중…</p>
        </main>
      </>
    );
  }

  if (assessments.length === 0) {
    return (
      <>
        <Header />
        <main className="space-y-4 pt-3 pb-10">
          <AnnouncementBanner />
          <p className="mx-4 rounded-2xl border border-dashed border-border bg-card px-4 py-12 text-center text-sm font-medium text-ink-muted">
            진행 중·마감 임박 수행평가가 없습니다.
          </p>
          <FooterInfoCards />
        </main>
      </>
    );
  }

  return <AppShell assessments={assessments} />;
}

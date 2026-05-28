"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav, type NavTab } from "@/components/layout/BottomNav";
import { RoadmapView } from "@/components/home/RoadmapView";
import { AssessmentTable } from "@/components/tasks/AssessmentTable";
import { AnnouncementBanner } from "@/components/sections/AnnouncementBanner";
import { FilterBar } from "@/components/filters/FilterBar";
import { FooterInfoCards } from "@/components/sections/FooterInfoCards";
import { SCHOOL_NAME } from "@/lib/constants";
import { getSubjectFilters, matchesSubjectFilter } from "@/lib/subject";
import type { Assessment, SubjectFilter } from "@/types/assessment";

type AppShellProps = {
  assessments: Assessment[];
};

export function AppShell({ assessments }: AppShellProps) {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [activeSubject, setActiveSubject] = useState<SubjectFilter>("전체");
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const filtered = assessments.filter((a) => matchesSubjectFilter(a, activeSubject));
  const subjects = getSubjectFilters();

  return (
    <div className="relative mx-auto min-h-full w-full max-w-app bg-surface pb-24 shadow-[0_0_0_1px_rgba(0,0,0,0.04)]">
      <Header />

      <main className="space-y-4 pt-3">
        {activeTab === "home" && (
          <>
            <RoadmapView assessments={assessments} />
            <FooterInfoCards />
          </>
        )}

        {activeTab === "schedule" && (
          <div className="space-y-3">
            <AnnouncementBanner />
            <p className="px-4 text-xs font-medium text-ink-muted">
              연번 순 · 마감 일시(SUIT) 강조
            </p>
            <AssessmentTable assessments={assessments} />
          </div>
        )}

        {activeTab === "submission" && (
          <div className="space-y-3" id="submission-section">
            <AnnouncementBanner />
            <FilterBar
              subjects={subjects}
              active={activeSubject}
              onChange={setActiveSubject}
            />
            {filtered.length > 0 ? (
              <AssessmentTable assessments={filtered} />
            ) : (
              <p className="mx-4 rounded-2xl border border-dashed border-border bg-card px-4 py-12 text-center text-sm font-medium text-ink-muted">
                해당 과목의 제출 안내가 없습니다.
              </p>
            )}
          </div>
        )}

        {activeTab === "mypage" && (
          <div id="mypage-section" className="space-y-3 px-4">
            <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
              <h2 className="text-base font-bold text-ink">마이페이지</h2>
              <dl className="mt-4 space-y-3 text-sm font-medium">
                <div className="flex justify-between">
                  <dt className="text-ink-subtle">학교</dt>
                  <dd className="font-bold text-ink">{SCHOOL_NAME}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-subtle">학년·반</dt>
                  <dd className="font-bold text-ink">1학년 4반</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-subtle">등록 수행평가</dt>
                  <dd className="font-numeric font-bold text-primary">{assessments.length}건</dd>
                </div>
              </dl>
            </section>
            <FooterInfoCards />
          </div>
        )}
      </main>

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

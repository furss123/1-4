import { Header } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { RoadmapView } from "@/components/home/RoadmapView";
import type { Assessment } from "@/types/assessment";

type AppShellProps = {
  assessments: Assessment[];
};

export function AppShell({ assessments }: AppShellProps) {
  return (
    <div className="relative mx-auto flex min-h-full w-full max-w-app flex-col bg-surface-end">
      <Header />

      <main className="flex-1 space-y-3 pb-4">
        <RoadmapView assessments={assessments} />
      </main>

      <SiteFooter />
    </div>
  );
}

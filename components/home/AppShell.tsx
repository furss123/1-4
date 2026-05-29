import { Header } from "@/components/layout/Header";
import { RoadmapView } from "@/components/home/RoadmapView";
import type { Assessment } from "@/types/assessment";

type AppShellProps = {
  assessments: Assessment[];
};

export function AppShell({ assessments }: AppShellProps) {
  return (
    <div className="relative mx-auto min-h-full w-full max-w-app bg-surface-end pb-8">
      <Header />

      <main className="space-y-3 pb-4">
        <RoadmapView assessments={assessments} />
      </main>
    </div>
  );
}

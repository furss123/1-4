import { AssessmentTable } from "@/components/tasks/AssessmentTable";
import type { Assessment } from "@/types/assessment";

type RoadmapViewProps = {
  assessments: Assessment[];
};

export function RoadmapView({ assessments }: RoadmapViewProps) {
  if (assessments.length === 0) {
    return (
      <p className="mx-4 rounded-card bg-card px-4 py-12 text-center text-sm font-medium text-ink-muted shadow-soft">
        진행 중·마감 임박 수행평가가 없습니다.
      </p>
    );
  }

  return <AssessmentTable assessments={assessments} />;
}

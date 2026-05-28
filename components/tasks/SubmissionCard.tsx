import type { Assessment } from "@/types/assessment";

type SubmissionCardProps = {
  assessment: Assessment;
};

export function SubmissionCard({ assessment }: SubmissionCardProps) {
  return (
    <article className="rounded-card border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-bold text-primary">{assessment.subject}</p>
      <h3 className="mt-1 text-base font-bold text-ink">{assessment.name}</h3>
      <div className="mt-3 rounded-xl bg-surface px-3 py-3">
        <p className="text-xs font-semibold text-ink-subtle">제출 방법</p>
        <p className="mt-1 text-sm leading-relaxed text-ink">
          {assessment.submissionMethod || "—"}
        </p>
      </div>
      <p className="font-numeric mt-2 text-xs text-ink-muted">마감: {assessment.deadline}</p>
    </article>
  );
}

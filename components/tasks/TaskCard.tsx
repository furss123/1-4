import type { Assessment } from "@/types/assessment";
import { StatusBadge } from "./StatusBadge";

type TaskCardProps = {
  assessment: Assessment;
  /** 일정 탭: 마감 일시 강조 */
  emphasizeDeadline?: boolean;
};

export function TaskCard({ assessment, emphasizeDeadline = false }: TaskCardProps) {
  return (
    <article className="rounded-card border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-pill bg-primary-light px-2.5 py-1 text-xs font-bold text-primary">
          {assessment.subject}
        </span>
        <StatusBadge status={assessment.status} />
      </div>

      <h2 className="mt-4 text-lg font-bold leading-snug text-ink">{assessment.name}</h2>

      <div
        className={`mt-5 rounded-xl border px-4 py-3.5 ${
          emphasizeDeadline
            ? "border-primary/30 bg-primary-light"
            : "border-primary/20 bg-surface"
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          마감 일시
        </p>
        <p className="font-numeric mt-1 text-[1.35rem] font-semibold leading-tight text-primary">
          {assessment.deadline || "—"}
        </p>
      </div>

      <dl className="mt-5 space-y-4">
        <div>
          <dt className="text-xs font-semibold text-ink-subtle">제출 방법</dt>
          <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-muted">
            {assessment.submissionMethod || "—"}
          </dd>
        </div>
        {assessment.precautions ? (
          <div className="rounded-xl border border-border/80 bg-surface px-4 py-3">
            <dt className="text-xs font-semibold text-ink-subtle">유의사항</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              {assessment.precautions}
            </dd>
          </div>
        ) : null}
      </dl>
    </article>
  );
}

import type { ReactNode } from "react";
import type { Assessment } from "@/types/assessment";
import { formatDeadline } from "@/lib/format-deadline";

type AssessmentTableProps = {
  assessments: Assessment[];
};

function Field({
  label,
  children,
  highlight,
}: {
  label: string;
  children: ReactNode;
  highlight?: boolean;
}) {
  return (
    <div>
      <dt className="text-[11px] font-bold text-ink-subtle">{label}</dt>
      <dd
        className={`mt-px text-[13px] leading-snug ${
          highlight ? "font-numeric font-semibold text-primary" : "font-medium text-ink-muted"
        }`}
      >
        {children}
      </dd>
    </div>
  );
}

export function AssessmentTable({ assessments }: AssessmentTableProps) {
  return (
    <section className="mx-4 space-y-3" aria-label="수행평가 목록" id="task-list">
      {assessments.map((row) => (
        <article
          key={row.id}
          className="rounded-card border border-border/50 bg-card px-3.5 py-2.5 shadow-card"
        >
          <p className="text-[13px] font-bold leading-tight text-school">{row.subject}</p>

          <h3 className="mt-1 text-[15px] font-bold leading-tight text-ink">{row.name}</h3>

          <dl className="mt-2 space-y-1.5 border-t border-border/60 pt-2">
            <Field label="마감 일시" highlight>
              {formatDeadline(row.deadline) || "—"}
            </Field>
            <Field label="제출 방법">{row.submissionMethod || "—"}</Field>
            {row.precautions ? <Field label="유의사항">{row.precautions}</Field> : null}
          </dl>
        </article>
      ))}
    </section>
  );
}

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
        className={`mt-[calc(3mm-2pt)] text-sm leading-snug ${
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
          className="rounded-card border border-border/50 bg-card py-[5mm] pl-[calc(1rem+5mm)] pr-4 shadow-card"
        >
          <div className="flex flex-col gap-[calc(3mm-2pt)]">
            <p className="text-sm font-bold text-school">{row.subject}</p>
            <h3 className="text-base font-bold leading-snug text-ink">{row.name}</h3>
          </div>

          <dl className="flex flex-col gap-[calc(3mm-2pt)] border-t border-border/60 pt-[calc(3mm-2pt)]">
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

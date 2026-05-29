import type { Assessment } from "@/types/assessment";

type AssessmentTableProps = {
  assessments: Assessment[];
};

const TH =
  "px-3 py-3.5 text-left text-[11px] font-bold text-ink-muted whitespace-nowrap";
const TD = "px-3 py-4 align-middle text-sm font-medium text-ink";

export function AssessmentTable({ assessments }: AssessmentTableProps) {
  return (
    <section
      className="mx-4 overflow-hidden rounded-card bg-card shadow-card"
      aria-label="수행평가 목록"
      id="task-list"
    >
      <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead className="border-b border-border bg-filter-inactive">
            <tr>
              <th className={TH}>연번</th>
              <th className={TH}>과목</th>
              <th className={`${TH} min-w-[120px]`}>수행평가 이름</th>
              <th className={`${TH} min-w-[110px]`}>마감 일시</th>
              <th className={`${TH} min-w-[110px]`}>제출 방법</th>
              <th className={`${TH} min-w-[90px]`}>유의사항</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((row) => (
              <tr key={row.id} className="border-b border-border/70 last:border-b-0">
                <td className={TD}>
                  <span className="font-numeric inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-primary-light px-1.5 text-xs font-bold text-primary">
                    {row.id}
                  </span>
                </td>
                <td className={`${TD} font-bold text-school`}>{row.subject}</td>
                <td className={`${TD} font-bold leading-snug text-ink`}>{row.name}</td>
                <td className={`${TD} font-numeric text-[14px] font-semibold text-primary`}>
                  {row.deadline || "—"}
                </td>
                <td className={`${TD} text-[13px] leading-relaxed text-ink-muted`}>
                  {row.submissionMethod || "—"}
                </td>
                <td className={`${TD} max-w-[130px] text-xs leading-relaxed text-ink-muted`}>
                  {row.precautions || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

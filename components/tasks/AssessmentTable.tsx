import type { Assessment } from "@/types/assessment";

type AssessmentTableProps = {
  assessments: Assessment[];
};

const TH =
  "px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-ink-subtle whitespace-nowrap";
const TD = "px-3 py-3.5 align-top text-sm font-medium text-ink";

export function AssessmentTable({ assessments }: AssessmentTableProps) {
  return (
    <section
      className="mx-4 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
      aria-label="수행평가 목록"
      id="task-list"
    >
      <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead className="border-b border-border bg-[#F8FAFC]">
            <tr>
              <th className={TH}>연번</th>
              <th className={TH}>과목</th>
              <th className={`${TH} min-w-[140px]`}>수행평가</th>
              <th className={`${TH} min-w-[120px]`}>마감 일시</th>
              <th className={`${TH} min-w-[120px]`}>제출 방법</th>
              <th className={`${TH} min-w-[100px]`}>유의사항</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((row, index) => (
              <tr
                key={row.id}
                className={`border-b border-border/80 last:border-b-0 ${
                  index % 2 === 0 ? "bg-card" : "bg-[#FCFDFE]"
                }`}
              >
                <td className={`${TD} font-numeric w-12 text-ink-muted`}>{row.id}</td>
                <td className={`${TD} font-semibold text-primary`}>{row.subject}</td>
                <td className={`${TD} font-bold leading-snug`}>{row.name}</td>
                <td className={`${TD} font-numeric text-[15px] font-semibold text-primary`}>
                  {row.deadline || "—"}
                </td>
                <td className={`${TD} text-ink-muted leading-relaxed`}>
                  {row.submissionMethod || "—"}
                </td>
                <td className={`${TD} max-w-[140px] text-xs leading-relaxed text-ink-muted`}>
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

import type { Assessment } from "@/types/assessment";
import { normalizeProgressStatus } from "@/lib/utils";

export function parseGvizRows(payload: string): string[][] {
  const match = payload.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
  if (!match?.[1]) {
    throw new Error("공개 시트 응답 형식을 읽을 수 없습니다.");
  }

  const data = JSON.parse(match[1]) as {
    table?: { rows?: { c?: { v?: string | number | null }[] }[] };
  };

  const tableRows = data.table?.rows ?? [];

  return tableRows.map((row) =>
    (row.c ?? []).map((cell) => {
      const value = cell?.v;
      return value == null ? "" : String(value);
    }),
  );
}

export function parseAssessmentRow(row: string[], rowIndex: number): Assessment | null {
  const cells = [...row, "", "", "", "", "", "", ""].slice(0, 7).map((c) => c.trim());
  const [id, subject, name, deadline, submissionMethod, precautions, statusRaw] = cells;

  if (!subject && !name && !deadline) return null;

  return {
    id: id || String(rowIndex + 2),
    subject,
    name,
    deadline,
    submissionMethod,
    precautions,
    status: normalizeProgressStatus(statusRaw),
  };
}

export function sortAssessments(items: Assessment[]): Assessment[] {
  return [...items].sort((a, b) => {
    const numA = Number.parseInt(a.id, 10);
    const numB = Number.parseInt(b.id, 10);
    if (!Number.isNaN(numA) && !Number.isNaN(numB)) return numA - numB;
    return a.id.localeCompare(b.id, "ko");
  });
}

export function rowsToAssessments(rows: string[][]): Assessment[] {
  const dataRows = rows.length > 1 ? rows.slice(1) : rows;
  return dataRows
    .map((row, index) => parseAssessmentRow(row, index))
    .filter((item): item is Assessment => item !== null);
}

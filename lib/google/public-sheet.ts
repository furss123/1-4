import type { Assessment } from "@/types/assessment";
import { normalizeProgressStatus } from "@/lib/utils";

function parseSheetNameFromRange(range: string | undefined): string {
  if (!range) return "시트1";
  const match = range.match(/^'?([^'!]+)'?!/);
  return match?.[1] ?? "시트1";
}

function parseGvizRows(payload: string): string[][] {
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

function parseRow(row: string[], rowIndex: number): Assessment | null {
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

function sortAssessments(items: Assessment[]): Assessment[] {
  return [...items].sort((a, b) => {
    const numA = Number.parseInt(a.id, 10);
    const numB = Number.parseInt(b.id, 10);
    if (!Number.isNaN(numA) && !Number.isNaN(numB)) return numA - numB;
    return a.id.localeCompare(b.id, "ko");
  });
}

/** Fetch sheet published as "Anyone with the link can view" — no service account key */
export async function fetchPublicSheetAssessments(
  spreadsheetId: string,
  sheetName?: string,
): Promise<Assessment[]> {
  const name = sheetName ?? parseSheetNameFromRange(process.env.GOOGLE_SHEET_RANGE);
  const url = new URL(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq`);
  url.searchParams.set("tqx", "out:json");
  url.searchParams.set("sheet", name);
  url.searchParams.set("headers", "1");

  const response = await fetch(url.toString(), {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(
      `공개 시트를 불러오지 못했습니다 (HTTP ${response.status}).\n` +
        "Google 시트 → 공유 → '링크가 있는 모든 사용자' + '뷰어' 로 설정했는지 확인해 주세요.",
    );
  }

  const text = await response.text();
  const rows = parseGvizRows(text);

  const dataRows = rows.length > 1 ? rows.slice(1) : rows;
  const assessments = dataRows
    .map((row, index) => parseRow(row, index))
    .filter((item): item is Assessment => item !== null);

  if (assessments.length === 0) {
    throw new Error(
      "시트에서 데이터 행을 찾지 못했습니다. 1행이 헤더이고 2행부터 데이터가 있는지, 시트 이름이 맞는지 확인해 주세요.",
    );
  }

  return sortAssessments(assessments);
}

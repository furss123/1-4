import { filterInProgressAssessments } from "@/lib/assessment-filters";
import type { Assessment } from "@/types/assessment";
import { parseGvizRows, rowsToAssessments, sortAssessments } from "@/lib/google/parse-gviz";

function parseSheetNameFromRange(range: string | undefined): string {
  if (!range) return "시트1";
  const match = range.match(/^'?([^'!]+)'?!/);
  return match?.[1] ?? "시트1";
}

/** Server-side fetch — public Google Sheet via gviz */
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
  const assessments = sortAssessments(rowsToAssessments(rows));

  if (assessments.length === 0) {
    throw new Error(
      "시트에서 데이터 행을 찾지 못했습니다. 1행이 헤더이고 2행부터 데이터가 있는지, 시트 이름이 맞는지 확인해 주세요.",
    );
  }

  return filterInProgressAssessments(assessments);
}

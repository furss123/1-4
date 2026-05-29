import { filterInProgressAssessments } from "@/lib/assessment-filters";
import type { Assessment } from "@/types/assessment";
import { parseGvizRows, rowsToAssessments, sortAssessments } from "@/lib/google/parse-gviz";

export function getPublicSheetConfig() {
  const spreadsheetId =
    process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID?.trim() ||
    process.env.GOOGLE_SHEET_ID?.trim();
  const sheetName =
    process.env.NEXT_PUBLIC_GOOGLE_SHEET_NAME?.trim() || "시트1";

  if (!spreadsheetId) {
    throw new Error("NEXT_PUBLIC_GOOGLE_SHEET_ID 가 설정되지 않았습니다.");
  }

  return { spreadsheetId, sheetName };
}

/** Browser / static hosting — public Google Sheet via gviz */
export async function fetchPublicSheetAssessmentsClient(): Promise<Assessment[]> {
  const { spreadsheetId, sheetName } = getPublicSheetConfig();

  const url = new URL(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq`);
  url.searchParams.set("tqx", "out:json");
  url.searchParams.set("sheet", sheetName);
  url.searchParams.set("headers", "1");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(
      `공개 시트를 불러오지 못했습니다 (HTTP ${response.status}). 시트를 '링크가 있는 모든 사용자 · 뷰어'로 공유했는지 확인해 주세요.`,
    );
  }

  const text = await response.text();
  const rows = parseGvizRows(text);
  const assessments = sortAssessments(rowsToAssessments(rows));

  if (assessments.length === 0) {
    throw new Error("시트에서 데이터를 찾지 못했습니다.");
  }

  return filterInProgressAssessments(assessments);
}

import { google } from "googleapis";
import type { Assessment, ProgressStatus } from "@/types/assessment";
import { normalizeProgressStatus } from "@/lib/utils";
import { createGoogleAuthClient, wrapGoogleAuthError } from "@/lib/google/auth";
import { fetchPublicSheetAssessments } from "@/lib/google/public-sheet";
import { filterInProgressAssessments } from "@/lib/assessment-filters";
import { sortAssessmentsByDeadline } from "@/lib/sort-assessments";

const DEFAULT_RANGE = "'시트1'!A2:G";

function getSpreadsheetConfig() {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID?.trim();
  const range = process.env.GOOGLE_SHEET_RANGE ?? DEFAULT_RANGE;

  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEET_ID가 설정되지 않았습니다.");
  }

  return { spreadsheetId, range };
}

function normalizeStatus(raw: string): ProgressStatus {
  return normalizeProgressStatus(raw);
}

function parseRow(row: string[], rowIndex: number): Assessment | null {
  const cells = [...row, "", "", "", "", "", "", ""].slice(0, 7).map((c) => String(c).trim());
  const [id, subject, name, deadline, submissionMethod, precautions, statusRaw] = cells;

  if (!subject && !name && !deadline) return null;

  return {
    id: id || String(rowIndex + 2),
    subject,
    name,
    deadline,
    submissionMethod,
    precautions,
    status: normalizeStatus(statusRaw),
  };
}

async function fetchViaApi(spreadsheetId: string, range: string): Promise<Assessment[]> {
  const auth = createGoogleAuthClient();
  const sheets = google.sheets({ version: "v4", auth });

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = data.values ?? [];
  const assessments = rows
    .map((row, index) => parseRow(row, index))
    .filter((item): item is Assessment => item !== null);

  return sortAssessmentsByDeadline(assessments);
}

export async function getAssessments(): Promise<Assessment[]> {
  const { spreadsheetId, range } = getSpreadsheetConfig();
  const access = process.env.GOOGLE_SHEET_ACCESS?.trim().toLowerCase();

  try {
    let items: Assessment[];

    if (access === "public") {
      items = await fetchPublicSheetAssessments(
        spreadsheetId,
        process.env.GOOGLE_SHEET_NAME?.trim(),
      );
    } else {
      items = await fetchViaApi(spreadsheetId, range);
    }

    return filterInProgressAssessments(items);
  } catch (error) {
    throw wrapGoogleAuthError(error);
  }
}

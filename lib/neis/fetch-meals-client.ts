import { NEIS_MEAL_API, NEIS_OFFICE_CODE, NEIS_SCHOOL_CODE } from "@/lib/neis/constants";
import { getKoreaYmd, rowsToTodayMeals, type TodayMeals } from "@/lib/neis/parse-meal";

type NeisMealResponse = {
  mealServiceDietInfo?: {
    head?: { RESULT?: { CODE?: string; MESSAGE?: string } }[];
    row?: Record<string, string>[];
  }[];
};

export async function fetchTodayMealsClient(): Promise<TodayMeals> {
  const ymd = getKoreaYmd();
  const apiKey = process.env.NEXT_PUBLIC_NEIS_API_KEY?.trim();

  const url = new URL(NEIS_MEAL_API);
  url.searchParams.set("Type", "json");
  url.searchParams.set("pIndex", "1");
  url.searchParams.set("pSize", "10");
  url.searchParams.set("ATPT_OFCDC_SC_CODE", NEIS_OFFICE_CODE);
  url.searchParams.set("SD_SCHUL_CODE", NEIS_SCHOOL_CODE);
  url.searchParams.set("MLSV_YMD", ymd);
  if (apiKey) url.searchParams.set("KEY", apiKey);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`급식 정보를 불러오지 못했습니다 (HTTP ${response.status}).`);
  }

  const data = (await response.json()) as NeisMealResponse;
  const block = data.mealServiceDietInfo?.[0];
  const resultCode = block?.head?.[1]?.RESULT?.CODE;

  if (resultCode === "INFO-200") {
    return rowsToTodayMeals([], ymd);
  }

  if (resultCode && resultCode !== "INFO-000") {
    const message = block?.head?.[1]?.RESULT?.MESSAGE ?? "급식 정보 조회에 실패했습니다.";
    throw new Error(message);
  }

  const rows = data.mealServiceDietInfo?.[1]?.row ?? [];
  return rowsToTodayMeals(rows, ymd);
}

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env.local");

console.log("=== Google Sheets 환경 점검 ===\n");

if (!existsSync(envPath)) {
  console.log("❌ .env.local 없음");
  process.exit(1);
}

const env = readFileSync(envPath, "utf8");
const access = env.match(/GOOGLE_SHEET_ACCESS=(.+)/)?.[1]?.trim();
const sheetId = env.match(/GOOGLE_SHEET_ID=(.+)/)?.[1]?.trim();
const refresh = env.match(/GOOGLE_REFRESH_TOKEN=(.+)/)?.[1]?.trim();
const oauthJson = env.match(/GOOGLE_OAUTH_CLIENT_JSON=(.+)/)?.[1]?.trim();
const saPath = env.match(/GOOGLE_APPLICATION_CREDENTIALS=(.+)/)?.[1]?.trim();

if (access === "public") {
  console.log("✅ 모드: 공개 시트 (GOOGLE_SHEET_ACCESS=public)");
  console.log("   → 시트가 '링크가 있는 모든 사용자 · 뷰어' 인지 확인");
} else if (refresh && refresh !== "여기에_리프레시_토큰") {
  console.log("✅ 모드: OAuth (리프레시 토큰 설정됨)");
} else if (saPath) {
  const abs = resolve(process.cwd(), saPath);
  if (existsSync(abs)) {
    const json = JSON.parse(readFileSync(abs, "utf8"));
    if (json.web && !json.client_email) {
      console.log("❌ OAuth 웹 JSON — 서비스 계정 키가 아님");
      console.log("   → 공개 시트 또는 npm run setup:oauth 사용");
    } else if (json.client_email) {
      console.log("✅ 모드: 서비스 계정", json.client_email);
    }
  } else {
    console.log("❌ 서비스 계정 파일 없음:", abs);
  }
} else {
  console.log("❌ 인증 방식 미설정");
  console.log("   → GOOGLE_SHEET_ACCESS=public 권장");
}

if (oauthJson) {
  const abs = resolve(process.cwd(), oauthJson);
  console.log(existsSync(abs) ? `✅ OAuth JSON: ${oauthJson}` : `❌ OAuth JSON 없음: ${abs}`);
}

if (sheetId) {
  console.log("✅ GOOGLE_SHEET_ID:", sheetId);
} else {
  console.log("❌ GOOGLE_SHEET_ID 없음");
}

console.log("\n조직에서 서비스 계정 키 생성이 막혀 있으면 방법 1(공개 시트) 또는 방법 2(OAuth)를 쓰세요.");

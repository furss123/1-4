/**
 * One-time OAuth refresh token setup (when service account keys are blocked).
 *
 * Prerequisites:
 * - secrets/google-oauth-client.json (OAuth "Web" or "Desktop" client from Google Cloud)
 * - Redirect URI http://localhost:3333/oauth2callback added in Cloud Console
 *
 * Run: npm run setup:oauth
 */
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { OAuth2Client } from "google-auth-library";

const PORT = 3333;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;
const SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";

const clientJsonPath =
  process.env.GOOGLE_OAUTH_CLIENT_JSON ?? "./secrets/google-oauth-client.json";
const abs = resolve(process.cwd(), clientJsonPath);

if (!existsSync(abs)) {
  console.error("❌ OAuth 클라이언트 JSON 없음:", abs);
  console.error("   Google Cloud → 사용자 인증 정보 → OAuth 클라이언트 ID → JSON 다운로드");
  process.exit(1);
}

const raw = JSON.parse(readFileSync(abs, "utf8"));
const web = raw.web ?? raw.installed;
if (!web?.client_id || !web?.client_secret) {
  console.error("❌ client_id / client_secret 을 찾을 수 없습니다.");
  process.exit(1);
}

const oauth2Client = new OAuth2Client(web.client_id, web.client_secret, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: [SCOPE],
  prompt: "consent",
});

console.log("\n=== Google OAuth 설정 (리프레시 토큰) ===\n");
console.log("1. Cloud Console OAuth 클라이언트에 다음 리디렉션 URI 등록:");
console.log("   ", REDIRECT_URI);
console.log("\n2. 브라우저에서 아래 URL을 열고 Google 계정으로 로그인:\n");
console.log(authUrl);
console.log("\n3. 로그인 후 이 터미널에 표시되는 refresh_token 을 .env.local 에 저장\n");

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

  if (url.pathname !== "/oauth2callback") {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const code = url.searchParams.get("code");
  if (!code) {
    res.writeHead(400);
    res.end("code 없음");
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>완료</h1><p>터미널의 refresh_token 을 .env.local 에 복사한 뒤 이 창을 닫으세요.</p>");

    console.log("\n✅ .env.local 에 추가하세요:\n");
    console.log(`GOOGLE_OAUTH_CLIENT_JSON=${clientJsonPath}`);
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log(`GOOGLE_SHEET_ID=스프레드시트_ID`);
    console.log("\n(GOOGLE_SHEET_ACCESS=public 줄은 삭제하거나 주석 처리)\n");

    setTimeout(() => process.exit(0), 500);
  } catch (e) {
    console.error(e);
    res.writeHead(500);
    res.end("토큰 발급 실패");
  }
});

server.listen(PORT, () => {
  console.log(`대기 중: ${REDIRECT_URI}\n`);
});

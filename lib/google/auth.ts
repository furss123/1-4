import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JWT, OAuth2Client } from "google-auth-library";
import {
  assertValidPrivateKey,
  assertValidServiceAccountEmail,
  formatPrivateKey,
} from "@/lib/utils";

const READ_SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";

type ServiceAccountCredentials = {
  client_email: string;
  private_key: string;
};

type OAuthWebClient = {
  client_id: string;
  client_secret: string;
};

function loadOAuthWebClientFromFile(filePath: string): OAuthWebClient {
  const absolute = resolve(process.cwd(), filePath);
  if (!existsSync(absolute)) {
    throw new Error(`OAuth 클라이언트 JSON을 찾을 수 없습니다: ${filePath}`);
  }

  const parsed = JSON.parse(readFileSync(absolute, "utf8")) as {
    web?: OAuthWebClient;
    installed?: OAuthWebClient;
  };

  const web = parsed.web ?? parsed.installed;
  if (!web?.client_id || !web?.client_secret) {
    throw new Error("OAuth JSON에 client_id, client_secret(web)이 필요합니다.");
  }

  return web;
}

function createOAuth2Client(): OAuth2Client | null {
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN?.trim();
  if (!refreshToken) return null;

  let clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  let clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

  const oauthJson = process.env.GOOGLE_OAUTH_CLIENT_JSON?.trim();
  if (oauthJson) {
    const web = loadOAuthWebClientFromFile(oauthJson);
    clientId = clientId ?? web.client_id;
    clientSecret = clientSecret ?? web.client_secret;
  }

  if (!clientId || !clientSecret) {
    throw new Error(
      "OAuth 사용 시 GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET 또는 GOOGLE_OAUTH_CLIENT_JSON 이 필요합니다.",
    );
  }

  const client = new OAuth2Client(clientId, clientSecret);
  client.setCredentials({ refresh_token: refreshToken });
  return client;
}

function loadServiceAccountFromJsonFile(filePath: string): ServiceAccountCredentials {
  const absolute = resolve(/* turbopackIgnore: true */ process.cwd(), filePath);

  if (!existsSync(absolute)) {
    throw new Error(`서비스 계정 키 파일을 찾을 수 없습니다: ${filePath}`);
  }

  const raw = readFileSync(absolute, "utf8");
  const parsed = JSON.parse(raw) as ServiceAccountCredentials & { type?: string; web?: unknown };

  if (parsed.web && !parsed.client_email) {
    throw new Error(
      "이 파일은 OAuth 웹 클라이언트 JSON입니다. 서비스 계정 키가 아닙니다.\n" +
        "조직에서 서비스 계정 키 생성이 차단된 경우 .env.local 에 GOOGLE_SHEET_ACCESS=public 또는 OAuth(리프레시 토큰)를 사용하세요.",
    );
  }

  if (!parsed.client_email || !parsed.private_key) {
    throw new Error(`서비스 계정 JSON 형식이 올바르지 않습니다: ${filePath}`);
  }

  return {
    client_email: parsed.client_email,
    private_key: formatPrivateKey(parsed.private_key) ?? parsed.private_key,
  };
}

function createServiceAccountClient(): JWT | null {
  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (!keyFile) return null;

  const credentials = loadServiceAccountFromJsonFile(keyFile);
  assertValidServiceAccountEmail(credentials.client_email);
  assertValidPrivateKey(credentials.private_key);

  return new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: [READ_SCOPE],
  });
}

/** OAuth → 서비스 계정 순으로 인증 (조직 정책으로 SA 키가 막힌 경우 OAuth/공개 시트 사용) */
export function createGoogleAuthClient(): JWT | OAuth2Client {
  const oauth = createOAuth2Client();
  if (oauth) return oauth;

  const serviceAccount = createServiceAccountClient();
  if (serviceAccount) return serviceAccount;

  throw new Error(
    "Google 인증이 설정되지 않았습니다.\n\n" +
      "【방법 1 · 가장 쉬움】 공개 시트\n" +
      "  GOOGLE_SHEET_ACCESS=public\n" +
      "  시트 공유 → '링크가 있는 모든 사용자' 뷰어\n\n" +
      "【방법 2】 OAuth (서비스 계정 키 생성이 차단된 학교)\n" +
      "  OAuth 클라이언트 JSON + GOOGLE_REFRESH_TOKEN\n" +
      "  설정: npm run setup:oauth\n\n" +
      "【방법 3】 서비스 계정 키 (조직에서 허용 시)\n" +
      "  GOOGLE_APPLICATION_CREDENTIALS=./secrets/google-service-account.json",
  );
}

export function wrapGoogleAuthError(error: unknown): Error {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("disableServiceAccountKeyCreation")) {
    return new Error(
      "조직 정책(iam.disableServiceAccountKeyCreation)으로 서비스 계정 키를 만들 수 없습니다.\n" +
        "GOOGLE_SHEET_ACCESS=public 또는 OAuth( npm run setup:oauth )를 사용해 주세요.",
    );
  }

  if (
    message.includes("DECODER") ||
    message.includes("unsupported") ||
    message.includes("ERR_OSSL")
  ) {
    return new Error(
      "비밀키 형식 오류입니다. 서비스 계정 키 대신 GOOGLE_SHEET_ACCESS=public 또는 OAuth를 사용해 주세요.",
    );
  }

  return error instanceof Error ? error : new Error(message);
}

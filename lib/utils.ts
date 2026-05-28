import type { ProgressStatus } from "@/types/assessment";

const PLACEHOLDER_MARKERS = ["...", "your-service-account", "your_spreadsheet_id"];

const STATUS_ALIASES: Record<string, ProgressStatus> = {
  "진행 중": "진행 중",
  진행중: "진행 중",
  "진행 예정": "진행 예정",
  진행예정: "진행 예정",
  "마감 임박": "마감 임박",
  마감임박: "마감 임박",
  완료: "완료",
};

/** Normalize private key from .env (quotes, escaped newlines, Windows CRLF) */
export function formatPrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined;

  let normalized = key.trim();

  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1).trim();
  }

  normalized = normalized.replace(/\r\n/g, "\n").replace(/\\n/g, "\n");

  if (normalized.includes("BEGIN PRIVATE KEY") && !normalized.includes("\n")) {
    normalized = normalized
      .replace("-----BEGIN PRIVATE KEY-----", "-----BEGIN PRIVATE KEY-----\n")
      .replace("-----END PRIVATE KEY-----", "\n-----END PRIVATE KEY-----");
  }

  return normalized.trim();
}

export function assertValidServiceAccountEmail(email: string): void {
  if (
    email.includes("your-service-account") ||
    email.includes("xxxx@") ||
    !email.endsWith(".iam.gserviceaccount.com")
  ) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_EMAIL이 예시 값입니다. JSON 키 파일의 client_email을 사용하거나 GOOGLE_APPLICATION_CREDENTIALS 방식을 권장합니다.",
    );
  }
}

export function assertValidPrivateKey(key: string): void {
  const lower = key.toLowerCase();

  if (PLACEHOLDER_MARKERS.some((m) => key.includes(m)) && key.length < 400) {
    throw new Error(
      ".env.local에 예시 값(… 또는 your-service-account)이 그대로 들어가 있습니다. Google Cloud에서 받은 실제 서비스 계정 JSON의 private_key를 넣어 주세요.",
    );
  }

  if (!key.includes("-----BEGIN PRIVATE KEY-----") || !key.includes("-----END PRIVATE KEY-----")) {
    throw new Error(
      "GOOGLE_PRIVATE_KEY 형식이 올바르지 않습니다. JSON 파일의 private_key 전체(-----BEGIN PRIVATE KEY----- ~ -----END PRIVATE KEY-----)를 사용해 주세요.",
    );
  }

  if (lower.includes("begin rsa private key")) {
    throw new Error(
      "RSA PRIVATE KEY 형식은 지원되지 않을 수 있습니다. 서비스 계정 JSON의 PKCS#8 키(PRIVATE KEY)를 사용해 주세요.",
    );
  }
}

export function normalizeProgressStatus(value: string): ProgressStatus {
  const trimmed = value.trim();
  return STATUS_ALIASES[trimmed] ?? "진행 예정";
}

export function isProgressStatus(value: string): value is ProgressStatus {
  return Object.keys(STATUS_ALIASES).includes(value.trim());
}

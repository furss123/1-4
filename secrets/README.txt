【학교 조직 정책으로 서비스 계정 키를 만들 수 없는 경우】

■ 방법 1 — 공개 시트 (가장 쉬움, 이 파일 불필요)
  1. Google 시트 → 공유 → "링크가 있는 모든 사용자" → 뷰어
  2. .env.local 에 GOOGLE_SHEET_ACCESS=public 설정 (이미 적용됨)

■ 방법 2 — OAuth (비공개 시트, 키 파일 없이)
  1. Google Cloud → 사용자 인증 정보 → OAuth 클라이언트 ID (웹)
  2. JSON → google-oauth-client.json 으로 저장
  3. 리디렉션 URI: http://localhost:3333/oauth2callback 등록
  4. 프로젝트 루트에서: npm run setup:oauth
  5. 발급된 GOOGLE_REFRESH_TOKEN 을 .env.local 에 저장

■ 방법 3 — 서비스 계정 키 (조직에서 허용할 때만)
  google-service-account.json — IAM 정책 iam.disableServiceAccountKeyCreation 이
  사용 중이면 생성할 수 없습니다.

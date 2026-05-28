# 남악고등학교 1-4반 수행평가 안내

고등학교 1학년 4반 수행평가 일정·제출 방법을 Google 시트와 연동해 보여 주는 모바일 웹 앱입니다.

## 기술 스택

- Next.js (App Router)
- Tailwind CSS
- Google Sheets (공개 시트 / OAuth / 서비스 계정)

## 실행

```bash
npm install
cp .env.local.example .env.local   # Windows: copy .env.local.example .env.local
npm run dev
```

[http://localhost:3000](http://localhost:3000)

## Google 시트 연동

학교 조직 정책으로 **서비스 계정 키**를 만들 수 없으면 `.env.local`에 다음을 사용하세요.

```env
GOOGLE_SHEET_ACCESS=public
GOOGLE_SHEET_ID=스프레드시트_ID
GOOGLE_SHEET_NAME=시트1
```

시트 공유: **링크가 있는 모든 사용자 · 뷰어**

자세한 내용: `secrets/README.txt`, `npm run check:google`

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 (Webpack) |
| `npm run build` | 프로덕션 빌드 |
| `npm run check:google` | Google 환경 변수 점검 |
| `npm run setup:oauth` | OAuth 리프레시 토큰 발급 |

## 브랜치

- `1-4` — 1학년 4반 수행평가 로드맵

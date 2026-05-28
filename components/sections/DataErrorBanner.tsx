type DataErrorBannerProps = {
  message: string;
};

export function DataErrorBanner({ message }: DataErrorBannerProps) {
  return (
    <div
      className="mx-5 rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800"
      role="alert"
    >
      <p className="font-bold">데이터를 불러오지 못했습니다</p>
      <p className="mt-1">{message}</p>
      <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-red-700/90">
        <li>
          <strong>학교 정책으로 서비스 계정 키가 막힌 경우:</strong> 시트 공유를{" "}
          <strong>링크가 있는 모든 사용자 · 뷰어</strong>로 설정하고{" "}
          <code className="rounded bg-red-100 px-1">GOOGLE_SHEET_ACCESS=public</code>
        </li>
        <li>
          비공개 시트: <code className="rounded bg-red-100 px-1">npm run setup:oauth</code> (OAuth
          리프레시 토큰)
        </li>
        <li>시트 이름이 <code className="rounded bg-red-100 px-1">시트1</code> 인지 확인</li>
      </ul>
    </div>
  );
}

import type { ProgressStatus, SubjectFilter } from "@/types/assessment";

export const SCHOOL_NAME = "남악고등학교";
export const APP_CLASS_LABEL = "남악고등학교 1학년 4반";
export const APP_TITLE = "수행평가 안내";
export const APP_SUBTITLE = "Written by 윤서현";

export const SUBJECT_FILTERS: readonly SubjectFilter[] = [
  "전체",
  "국어",
  "과학",
  "영어",
  "기타",
] as const;

export const STATUS_STYLES: Record<
  ProgressStatus,
  { label: string; bg: string; text: string }
> = {
  "진행 중": {
    label: "진행중",
    bg: "bg-primary-light",
    text: "text-primary",
  },
  "진행 예정": {
    label: "진행예정",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  "마감 임박": {
    label: "마감임박",
    bg: "bg-red-50",
    text: "text-red-600",
  },
  완료: {
    label: "완료",
    bg: "bg-slate-100",
    text: "text-slate-600",
  },
};

export const PADLET_BOARD = {
  label: "1학년 4반 패들렛",
  href: "https://padlet.com/furss13/2026namak1_4",
  helper: "반 게시판·공지·자료를 확인하세요.",
} as const;

export const INQUIRY_CONTACT = {
  label: "문의하기",
  href: "tel:",
  helper: "담임 선생님께 문의",
};

export const ANNOUNCEMENT = {
  title: "마감 일시 기준",
  caption: "(월/일(요일) 시간 및 교시) 기준으로 안내됩니다.",
} as const;

/** Google Sheet column mapping */
export type ProgressStatus = "진행 중" | "진행 예정" | "마감 임박" | "완료";

export interface Assessment {
  id: string;
  subject: string;
  name: string;
  deadline: string;
  submissionMethod: string;
  precautions: string;
  status: ProgressStatus;
}

export type SubjectFilter = "전체" | string;

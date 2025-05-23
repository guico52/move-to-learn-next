export interface CourseMeta {
  points: number;
  metadata_uri: string;
}

export interface CertificateInfo {
  token_address: string;
  user_address: string;
  course_id: string;
}

export interface MintCertificateEvent {
  course_id: string;
  recipient: string;
  token_id: string;
  timestamp: number;
  points: number;
  status: string; // "started" | "completed"
}

export interface CourseRegisterEvent {
  course_id: string;
  points: number;
  timestamp: number;
  operation_type: string; // "new" | "update" | "delete"
  metadata_uri: string;
}

export interface CoinMintEvent {
  recipient: string;
  amount: number;
  timestamp: number;
}

export interface CertificateTransferEvent {
  course_id: string;
  from: string;
  to: string;
  token_id: string;
  timestamp: number;
}

export interface ErrorEvent {
  error_code: number;
  error_message: string;
  timestamp: number;
}

// 错误代码常量
export const ERROR_CODES = {
  E_NOT_ADMIN: 1,
  E_ALREADY_CLAIMED: 2,
  E_INSUFFICIENT_BALANCE: 3,
  E_COURSE_NOT_EXISTS: 4,
  E_ALREADY_HAVE_CERTIFICATE: 5,
  E_COURSE_ALREADY_EXISTS: 6,
  E_COURSE_NOT_FOUND: 7,
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]; 
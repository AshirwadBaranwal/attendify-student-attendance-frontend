// ============================================================================
// Attendance Types (from attendanceCard-model.js & AttendanceRecord-model.js)
// ============================================================================

/**
 * Attendance Card entity (a class/session)
 */
export interface AttendanceCard {
  _id: string;
  subject: string;
  batch: string;
  department: string;
  currentSem: number;
  startTime: string;
  endTime: string;
  isCancelled: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Populated attendance card
 */
export interface AttendanceCardPopulated extends Omit<AttendanceCard, "subject" | "batch" | "department"> {
  subject: {
    _id: string;
    name: string;
    code: string;
    teacherName: string;
  };
  batch: {
    _id: string;
    name: string;
  };
  department: {
    _id: string;
    name: string;
  };
}

/**
 * Attendance status
 */
export type AttendanceStatus = "Present" | "Late";

/**
 * Attendance Record entity (individual student attendance)
 */
export interface AttendanceRecord {
  _id: string;
  attendanceCard: string;
  student: string;
  subject: string;
  batch: string;
  department: string;
  currentSem: number;
  status: AttendanceStatus;
  markedAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Populated attendance record
 */
export interface AttendanceRecordPopulated extends Omit<AttendanceRecord, "student" | "subject"> {
  student: {
    _id: string;
    name: string;
    rollNumber: string;
    profilePicture?: {
      Url?: string;
    };
  };
  subject: {
    _id: string;
    name: string;
    code: string;
  };
}

/**
 * Create attendance card input
 */
export interface CreateAttendanceCardInput {
  subject: string;
  batch: string;
  department: string;
  currentSem: number;
  startTime: string;
  endTime: string;
}

// ============================================================================
// Student Entity Types (from student-model.js)
// ============================================================================

/**
 * Gender options for student
 */
export type Gender = "Male" | "Female" | "Other";

/**
 * Student profile picture
 */
export interface StudentProfilePicture {
  Url?: string;
  photoFileId?: string;
}

/**
 * Student entity
 */
export interface Student {
  _id: string;
  name: string;
  dob: string;
  email: string;
  phone?: string;
  gender?: Gender;
  address?: string;
  admissionId: string;
  rollNumber: string;
  collegeId: string;
  departmentId: string;
  csvImportBatchId?: string;
  batchId: string;
  isActive: boolean;
  profilePicture?: StudentProfilePicture;
  createdAt: string;
  updatedAt: string;
}

/**
 * Populated student (with related entities)
 */
export interface StudentPopulated extends Omit<Student, "collegeId" | "departmentId" | "batchId"> {
  collegeId: {
    _id: string;
    name: string;
  };
  departmentId: {
    _id: string;
    name: string;
  };
  batchId: {
    _id: string;
    name: string;
  };
}

/**
 * Create student input
 */
export interface CreateStudentInput {
  name: string;
  dob: string;
  email: string;
  phone?: string;
  gender?: Gender;
  admissionId: string;
  rollNumber: string;
  collegeId: string;
  departmentId: string;
  batchId: string;
}

/**
 * Update student input
 */
export interface UpdateStudentInput {
  name?: string;
  phone?: string;
  gender?: Gender;
  address?: string;
}

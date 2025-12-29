// ============================================================================
// Subject Entity Types (from subject-model.js)
// ============================================================================

/**
 * Subject entity
 */
export interface Subject {
  _id: string;
  name: string;
  teacherName: string;
  code: string;
  sem: number;
  college: string;
  department: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Populated subject
 */
export interface SubjectPopulated extends Omit<Subject, "college" | "department"> {
  college: {
    _id: string;
    name: string;
  };
  department: {
    _id: string;
    name: string;
  };
}

/**
 * Create subject input
 */
export interface CreateSubjectInput {
  name: string;
  teacherName: string;
  code: string;
  sem?: number;
  college: string;
  department: string;
}

/**
 * Update subject input
 */
export interface UpdateSubjectInput {
  name?: string;
  teacherName?: string;
  code?: string;
  sem?: number;
  isActive?: boolean;
}

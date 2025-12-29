// ============================================================================
// Department Entity Types (from department-model.js)
// ============================================================================

/**
 * Academic type for department
 */
export type AcademicType = "semester" | "year";

/**
 * Head of Department info
 */
export interface HeadOfDepartment {
  name?: string;
  phone?: string;
}

/**
 * Department entity
 */
export interface Department {
  _id: string;
  name: string;
  collegeId: string;
  adminId?: string;
  academicType: AcademicType;
  headOfDepartment?: HeadOfDepartment;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Populated department (with admin details)
 */
export interface DepartmentPopulated extends Omit<Department, "adminId"> {
  adminId?: {
    _id: string;
    name: string;
    phone: string;
    profilePicture?: string;
  };
}

/**
 * Create department input
 */
export interface CreateDepartmentInput {
  name: string;
  collegeId: string;
  academicType: AcademicType;
  duration: number;
  headOfDepartment?: HeadOfDepartment;
}

/**
 * Update department input
 */
export interface UpdateDepartmentInput {
  name?: string;
  academicType?: AcademicType;
  duration?: number;
  headOfDepartment?: HeadOfDepartment;
}

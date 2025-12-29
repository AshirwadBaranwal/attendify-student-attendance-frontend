// ============================================================================
// User Entity Types (from user-model.js)
// ============================================================================

/**
 * User roles in the system
 */
export type UserRole = "collegeAdmin" | "departmentAdmin" | "student";

/**
 * Base User entity (from auth/user-model.js)
 */
export interface User {
  _id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// College Admin Types (from collegeAdmin-model.js)
// ============================================================================

/**
 * College Admin profile entity
 */
export interface CollegeAdmin {
  _id: string;
  userId: string | User;
  profilePicture?: string;
  profilePictureFileId?: string;
  name: string;
  phone: string;
  collegeId?: string | College;
}

/**
 * Populated College Admin (when collegeId is populated)
 */
export interface CollegeAdminPopulated extends Omit<CollegeAdmin, "collegeId" | "userId"> {
  userId: User;
  collegeId?: College;
}

// ============================================================================
// Department Admin Types (from departmentAdmin-model.js)
// ============================================================================

/**
 * Department Admin profile entity
 */
export interface DepartmentAdmin {
  _id: string;
  user: string | User;
  profilePicture?: string;
  profilePictureFileId?: string;
  name: string;
  phone: string;
  college?: string | College;
  department?: string | Department;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Populated Department Admin
 */
export interface DepartmentAdminPopulated extends Omit<DepartmentAdmin, "user" | "college" | "department"> {
  user: User;
  college?: College;
  department?: Department;
}

// ============================================================================
// Auth Response Types
// ============================================================================

/**
 * Login/Register response from backend
 */
export interface AuthResponse {
  user: AuthUser;
}

/**
 * Authenticated user response (includes nested admin profile)
 */
export interface AuthUser extends User {
  collegeAdmin?: CollegeAdminPopulated;
  departmentAdmin?: DepartmentAdminPopulated;
}

// Forward declaration imports (to avoid circular deps)
import type { College } from "./college.types";
import type { Department } from "./department.types";

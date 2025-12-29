// ============================================================================
// Batch Entity Types (from batch-model.js)
// ============================================================================

/**
 * Batch entity (e.g., "BCA 2023-2026")
 */
export interface Batch {
  _id: string;
  name: string;
  department: string;
  college: string;
  startYear: number;
  endYear: number;
  currentSemester: number;
  isActive: boolean;
}

/**
 * Populated batch (with department and college details)
 */
export interface BatchPopulated extends Omit<Batch, "department" | "college"> {
  department: {
    _id: string;
    name: string;
  };
  college: {
    _id: string;
    name: string;
  };
}

/**
 * Create batch input
 */
export interface CreateBatchInput {
  name: string;
  department: string;
  college: string;
  startYear: number;
  endYear: number;
}

/**
 * Update batch input
 */
export interface UpdateBatchInput {
  name?: string;
  currentSemester?: number;
  isActive?: boolean;
}

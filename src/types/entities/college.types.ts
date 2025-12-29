// ============================================================================
// College Entity Types (from college-model.js)
// ============================================================================

/**
 * College entity
 */
export interface College {
  _id: string;
  name: string;
  university: string;
  collegeReg: string;
  address: string;
  image?: string;
  imageFileId?: string;
  logo?: string;
  logoFileId?: string;
  letterHead?: string;
  letterHeadFileId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create college input
 */
export interface CreateCollegeInput {
  name: string;
  university: string;
  collegeReg: string;
  address: string;
}

/**
 * Update college input
 */
export interface UpdateCollegeInput {
  name?: string;
  university?: string;
  address?: string;
}

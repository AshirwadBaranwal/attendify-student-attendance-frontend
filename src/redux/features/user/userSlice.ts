import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "@/utils/axios/axios";
import { toast } from "sonner";
import type { AuthUser, ApiError, CollegeAdminPopulated } from "@/types";
import type { RootState } from "../../app/store";
import type { AxiosError } from "axios";

// ============================================================================
// TYPES
// ============================================================================

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
}

interface VerifyOTPData {
  email: string;
  otp: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface UpdateImageData {
  imageFile: File;
  previewUrl?: string;
}

interface LoginRejectedPayload extends ApiError {
  unverified?: boolean;
  email?: string;
}

// ============================================================================
// STATE INTERFACE
// ============================================================================

interface CollegeImageState {
  updatingImage: boolean;
  orgCollegeImage: string | null;
}

interface CollegeLetterHeadState {
  updatingletterHeadImage: boolean;
  orgLetterHeadImage: string | null;
}

interface CollegeLogoState {
  updatingLogo: boolean;
  orgLogo: string | null;
}

interface UserState {
  // Core User Data
  user: AuthUser | null;
  loading: boolean;
  error: ApiError | null;

  // Authentication States
  loggingIn: boolean;
  registering: boolean;
  verifying: boolean;
  registeredEmail: string | null;
  unverifiedEmail: string | null;

  // Feature States
  changingPassword: boolean;
  changePasswordError: ApiError | null;

  // Optimistic UI: Profile Picture
  updatingProfilePicture: boolean;
  originalProfilePicture: string | null;

  // Optimistic UI: College Images
  collegeImage: CollegeImageState;
  collegeLetterHead: CollegeLetterHeadState;
  collegeLogo: CollegeLogoState;
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Standardized error handler for Thunks to reduce boilerplate.
 */
const handleError = (
  err: AxiosError<ApiError>,
  defaultMessage: string,
  thunkAPI: { rejectWithValue: (value: ApiError) => unknown }
): unknown => {
  console.error(`Error: ${defaultMessage}`, err);
  const errorMessage = err?.response?.data?.message || defaultMessage;
  toast.error(errorMessage);
  return thunkAPI.rejectWithValue(
    err?.response?.data || { message: errorMessage }
  );
};

// ============================================================================
// THUNKS: AUTHENTICATION (Login, Register, Logout, OTP)
// ============================================================================

export const login = createAsyncThunk<
  { data: { user: AuthUser } },
  LoginCredentials,
  { rejectValue: LoginRejectedPayload }
>("user/login", async (credentials, thunkAPI) => {
  try {
    const res = await axiosClient.post("/auth/college-admin/login", credentials);
    toast.success(res?.data?.message || "Login successful!");
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    // Specific logic for unverified users
    if (error?.response?.data?.code === "EMAIL_NOT_VERIFIED") {
      return thunkAPI.rejectWithValue({
        unverified: true,
        email: credentials.email,
        message:
          error?.response?.data?.message ||
          "Account not verified. Please verify your email.",
      });
    }
    return handleError(error, "Login failed", thunkAPI) as never;
  }
});

export const register = createAsyncThunk<
  { email: string },
  RegisterData,
  { rejectValue: ApiError }
>("user/register", async (userData, thunkAPI) => {
  try {
    const res = await axiosClient.post("/auth/college-admin/register", userData);
    toast.success(
      res?.data?.message || "Registration successful! Please verify your email."
    );
    return { email: userData.email, ...res.data };
  } catch (err) {
    return handleError(err as AxiosError<ApiError>, "Registration failed", thunkAPI) as never;
  }
});

export const logout = createAsyncThunk<
  unknown,
  void,
  { rejectValue: ApiError }
>("user/logout", async (_, thunkAPI) => {
  try {
    const res = await axiosClient.get("/auth/college-admin/logout");
    toast.success(res?.data?.message || "Logged out successfully");
    return res.data;
  } catch (err) {
    return handleError(err as AxiosError<ApiError>, "Logout failed", thunkAPI) as never;
  }
});

export const verifyOTP = createAsyncThunk<
  AuthUser,
  VerifyOTPData,
  { rejectValue: ApiError }
>("user/verifyOTP", async ({ email, otp }, thunkAPI) => {
  try {
    const res = await axiosClient.post("/auth/college-admin/verify-otp", {
      email,
      otp,
    });
    toast.success(res?.data?.message || "Email verified successfully!");
    return res.data.data.user;
  } catch (err) {
    return handleError(err as AxiosError<ApiError>, "OTP verification failed", thunkAPI) as never;
  }
});

export const resendOTP = createAsyncThunk<
  unknown,
  string,
  { rejectValue: ApiError }
>("user/resendOTP", async (email, thunkAPI) => {
  try {
    const res = await axiosClient.post("/auth/college-admin/resend-verification-otp", { email });
    toast.success(res?.data?.message || "Verification code resent to your email");
    return res.data;
  } catch (err) {
    return handleError(err as AxiosError<ApiError>, "Failed to resend OTP", thunkAPI) as never;
  }
});

export const restartVerification = createAsyncThunk<
  string,
  string,
  { rejectValue: ApiError }
>("user/restartVerification", async (email, thunkAPI) => {
  try {
    const res = await axiosClient.post("/restart-verification", { email });
    toast.success(res?.data?.message || "Verification restarted successfully");
    return res.data.email;
  } catch (err) {
    return handleError(err as AxiosError<ApiError>, "Failed to restart verification", thunkAPI) as never;
  }
});

// ============================================================================
// THUNKS: USER DATA & SETTINGS
// ============================================================================

export const fetchUser = createAsyncThunk<
  AuthUser,
  void,
  { rejectValue: ApiError }
>("user/fetchUser", async (_, thunkAPI) => {
  try {
    const res = await axiosClient.get("/auth/college-admin/get-college-admin");
    return res.data.data;
  } catch (err) {
    return handleError(err as AxiosError<ApiError>, "Failed to fetch user data", thunkAPI) as never;
  }
});

export const changePassword = createAsyncThunk<
  unknown,
  ChangePasswordData,
  { rejectValue: ApiError }
>("user/changePassword", async (credentials, thunkAPI) => {
  try {
    const res = await axiosClient.post("/auth/college-admin/change-password", credentials);
    toast.success(res?.data?.message || "Password changed successfully!");
    return res.data;
  } catch (err) {
    return handleError(err as AxiosError<ApiError>, "Failed to change password", thunkAPI) as never;
  }
});

// ============================================================================
// THUNKS: IMAGES & UPLOADS (Optimistic UI)
// ============================================================================

export const updateProfilePicture = createAsyncThunk<
  { profilePicture: string },
  UpdateImageData,
  { rejectValue: ApiError }
>("user/updateProfilePicture", async ({ imageFile }, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("profilePicture", imageFile);

    const res = await axiosClient.patch("/college-admin/profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(res?.data?.message || "Profile picture updated!");
    return res.data.data;
  } catch (err) {
    return handleError(err as AxiosError<ApiError>, "Failed to update profile picture", thunkAPI) as never;
  }
});

export const updateCollegeImage = createAsyncThunk<
  { image: string },
  UpdateImageData,
  { rejectValue: ApiError }
>("user/updateCollegeImage", async ({ imageFile }, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("collegeImage", imageFile);

    const res = await axiosClient.patch("/college/college-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(res?.data?.message || "College Image updated!");
    return res.data.data;
  } catch (err) {
    return handleError(err as AxiosError<ApiError>, "Failed to update college image", thunkAPI) as never;
  }
});

export const updateCollegeLetterHead = createAsyncThunk<
  { letterHead: string },
  UpdateImageData,
  { rejectValue: ApiError }
>("user/updateCollegeLetterHead", async ({ imageFile }, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("letterHeadImage", imageFile);

    const res = await axiosClient.patch("/college/college-letterhead", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(res?.data?.message || "College letter head updated!");
    return res.data.data;
  } catch (err) {
    return handleError(err as AxiosError<ApiError>, "Failed to update college letter head", thunkAPI) as never;
  }
});

export const updateCollegeLogo = createAsyncThunk<
  { logo: string },
  UpdateImageData,
  { rejectValue: ApiError }
>("user/updateCollegeLogo", async ({ imageFile }, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("logoImage", imageFile);

    const res = await axiosClient.patch("/college/college-logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(res?.data?.message || "College logo updated!");
    return res.data.data;
  } catch (err) {
    return handleError(err as AxiosError<ApiError>, "Failed to update college logo", thunkAPI) as never;
  }
});

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: UserState = {
  // Core User Data
  user: null,
  loading: true,
  error: null,

  // Authentication States
  loggingIn: false,
  registering: false,
  verifying: false,
  registeredEmail: null,
  unverifiedEmail: null,

  // Feature States
  changingPassword: false,
  changePasswordError: null,

  // Optimistic UI: Profile Picture
  updatingProfilePicture: false,
  originalProfilePicture: null,

  // Optimistic UI: College Image
  collegeImage: {
    updatingImage: false,
    orgCollegeImage: null,
  },
  collegeLetterHead: {
    updatingletterHeadImage: false,
    orgLetterHeadImage: null,
  },
  collegeLogo: {
    updatingLogo: false,
    orgLogo: null,
  },
};

// ============================================================================
// SLICE
// ============================================================================

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch User ---
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload || null;
      })

      // --- Login ---
      .addCase(login.pending, (state) => {
        state.loggingIn = true;
        state.error = null;
        state.unverifiedEmail = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.data.user;
        state.loggingIn = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loggingIn = false;
        state.error = action.payload || null;
        if (action.payload?.unverified) {
          state.unverifiedEmail = action.payload.email || null;
        }
      })

      // --- Register ---
      .addCase(register.pending, (state) => {
        state.registering = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.registering = false;
        state.registeredEmail = action.payload.email;
      })
      .addCase(register.rejected, (state, action) => {
        state.registering = false;
        state.error = action.payload || null;
      })

      // --- Verify OTP ---
      .addCase(verifyOTP.pending, (state) => {
        state.verifying = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.verifying = false;
        state.user = action.payload;
        state.registeredEmail = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.verifying = false;
        state.error = action.payload || null;
      })

      // --- Logout ---
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })

      // --- Change Password ---
      .addCase(changePassword.pending, (state) => {
        state.changingPassword = true;
        state.changePasswordError = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.changingPassword = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changingPassword = false;
        state.changePasswordError = action.payload || null;
      })

      // --- Update Profile Picture (Optimistic) ---
      .addCase(updateProfilePicture.pending, (state, action) => {
        state.updatingProfilePicture = true;
        state.error = null;
        // Optimistic update: Show local preview immediately
        if (state.user?.collegeAdmin) {
          state.originalProfilePicture = state.user.collegeAdmin.profilePicture || null;
          state.user.collegeAdmin.profilePicture = action.meta.arg.previewUrl;
        }
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        state.updatingProfilePicture = false;
        // Confirm update with server response
        if (state.user?.collegeAdmin) {
          state.user.collegeAdmin.profilePicture = action.payload.profilePicture;
        }
        state.originalProfilePicture = null;
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.updatingProfilePicture = false;
        state.error = action.payload || null;
        // Rollback on failure
        if (state.user?.collegeAdmin && state.originalProfilePicture) {
          state.user.collegeAdmin.profilePicture = state.originalProfilePicture;
        }
        state.originalProfilePicture = null;
      })

      // --- Update College Image (Optimistic) ---
      .addCase(updateCollegeImage.pending, (state, action) => {
        state.collegeImage.updatingImage = true;
        state.error = null;
        if (state.user?.collegeAdmin?.collegeId) {
          state.collegeImage.orgCollegeImage = state.user.collegeAdmin.collegeId.image || null;
          state.user.collegeAdmin.collegeId.image = action.meta.arg.previewUrl;
        }
      })
      .addCase(updateCollegeImage.fulfilled, (state, action) => {
        state.collegeImage.updatingImage = false;
        if (state.user?.collegeAdmin?.collegeId) {
          state.user.collegeAdmin.collegeId.image = action.payload.image;
        }
        state.collegeImage.orgCollegeImage = null;
      })
      .addCase(updateCollegeImage.rejected, (state, action) => {
        state.collegeImage.updatingImage = false;
        state.error = action.payload || null;
        if (state.user?.collegeAdmin?.collegeId && state.collegeImage.orgCollegeImage) {
          state.user.collegeAdmin.collegeId.image = state.collegeImage.orgCollegeImage;
        }
        state.collegeImage.orgCollegeImage = null;
      })

      // --- Update College letterhead (Optimistic) ---
      .addCase(updateCollegeLetterHead.pending, (state, action) => {
        state.collegeLetterHead.updatingletterHeadImage = true;
        state.error = null;
        if (state.user?.collegeAdmin?.collegeId) {
          state.collegeLetterHead.orgLetterHeadImage = state.user.collegeAdmin.collegeId.letterHead || null;
          state.user.collegeAdmin.collegeId.letterHead = action.meta.arg.previewUrl;
        }
      })
      .addCase(updateCollegeLetterHead.fulfilled, (state, action) => {
        state.collegeLetterHead.updatingletterHeadImage = false;
        if (state.user?.collegeAdmin?.collegeId) {
          state.user.collegeAdmin.collegeId.letterHead = action.payload.letterHead;
        }
        state.collegeLetterHead.orgLetterHeadImage = null;
      })
      .addCase(updateCollegeLetterHead.rejected, (state, action) => {
        state.collegeLetterHead.updatingletterHeadImage = false;
        state.error = action.payload || null;
        if (state.user?.collegeAdmin?.collegeId && state.collegeLetterHead.orgLetterHeadImage) {
          state.user.collegeAdmin.collegeId.letterHead = state.collegeLetterHead.orgLetterHeadImage;
        }
        state.collegeLetterHead.orgLetterHeadImage = null;
      })

      // --- Update College logo (Optimistic) ---
      .addCase(updateCollegeLogo.pending, (state, action) => {
        state.collegeLogo.updatingLogo = true;
        state.error = null;
        if (state.user?.collegeAdmin?.collegeId) {
          state.collegeLogo.orgLogo = state.user.collegeAdmin.collegeId.logo || null;
          state.user.collegeAdmin.collegeId.logo = action.meta.arg.previewUrl;
        }
      })
      .addCase(updateCollegeLogo.fulfilled, (state, action) => {
        state.collegeLogo.updatingLogo = false;
        if (state.user?.collegeAdmin?.collegeId) {
          state.user.collegeAdmin.collegeId.logo = action.payload.logo;
        }
        state.collegeLogo.orgLogo = null;
      })
      .addCase(updateCollegeLogo.rejected, (state, action) => {
        state.collegeLogo.updatingLogo = false;
        state.error = action.payload || null;
        if (state.user?.collegeAdmin?.collegeId && state.collegeLogo.orgLogo) {
          state.user.collegeAdmin.collegeId.logo = state.collegeLogo.orgLogo;
        }
        state.collegeLogo.orgLogo = null;
      });
  },
});

// ============================================================================
// FLATTENED SELECTORS (Abstract away nested structure)
// ============================================================================

// --- Basic Selectors ---
export const selectUserState = (state: RootState) => state.user;
export const selectCurrentUser = (state: RootState) => state.user.user;
export const selectIsLoading = (state: RootState) => state.user.loading;
export const selectError = (state: RootState) => state.user.error;

// --- Authentication Selectors ---
export const selectIsLoggedIn = (state: RootState) => Boolean(state.user.user);
export const selectIsLoggingIn = (state: RootState) => state.user.loggingIn;
export const selectIsRegistering = (state: RootState) => state.user.registering;
export const selectIsVerifying = (state: RootState) => state.user.verifying;
export const selectRegisteredEmail = (state: RootState) => state.user.registeredEmail;
export const selectUnverifiedEmail = (state: RootState) => state.user.unverifiedEmail;

// --- User Info Selectors (Flattened) ---
export const selectUserEmail = (state: RootState) => state.user.user?.email;
export const selectUserRole = (state: RootState) => state.user.user?.role;
export const selectIsVerified = (state: RootState) => state.user.user?.isVerified;

// --- College Admin Selectors (Flattened) ---
export const selectCollegeAdmin = (state: RootState): CollegeAdminPopulated | undefined =>
  state.user.user?.collegeAdmin;

export const selectCollegeAdminName = (state: RootState) =>
  state.user.user?.collegeAdmin?.name;

export const selectCollegeAdminPhone = (state: RootState) =>
  state.user.user?.collegeAdmin?.phone;

export const selectProfilePicture = (state: RootState) =>
  state.user.user?.collegeAdmin?.profilePicture;

// --- College Selectors (Deeply Flattened) ---
export const selectCollege = (state: RootState) =>
  state.user.user?.collegeAdmin?.collegeId;

export const selectCollegeId = (state: RootState) =>
  state.user.user?.collegeAdmin?.collegeId?._id;

export const selectCollegeName = (state: RootState) =>
  state.user.user?.collegeAdmin?.collegeId?.name;

export const selectCollegeImage = (state: RootState) =>
  state.user.user?.collegeAdmin?.collegeId?.image;

export const selectCollegeLogo = (state: RootState) =>
  state.user.user?.collegeAdmin?.collegeId?.logo;

export const selectCollegeLetterHead = (state: RootState) =>
  state.user.user?.collegeAdmin?.collegeId?.letterHead;

// --- Loading State Selectors ---
export const selectIsUpdatingProfilePicture = (state: RootState) =>
  state.user.updatingProfilePicture;

export const selectIsUpdatingCollegeImage = (state: RootState) =>
  state.user.collegeImage.updatingImage;

export const selectIsUpdatingCollegeLogo = (state: RootState) =>
  state.user.collegeLogo.updatingLogo;

export const selectIsUpdatingLetterHead = (state: RootState) =>
  state.user.collegeLetterHead.updatingletterHeadImage;

export const selectIsChangingPassword = (state: RootState) =>
  state.user.changingPassword;

// ============================================================================
// EXPORTS
// ============================================================================

export const { setUser, clearError } = userSlice.actions;
export default userSlice.reducer;

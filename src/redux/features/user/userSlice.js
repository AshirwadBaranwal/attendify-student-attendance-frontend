import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/utils/axios/axios";
import { toast } from "sonner";

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Standardized error handler for Thunks to reduce boilerplate.
 */
const handleError = (err, defaultMessage, thunkAPI) => {
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

export const login = createAsyncThunk(
  "user/login",
  async (credentials, thunkAPI) => {
    try {
      const res = await axiosClient.post(
        "/auth/college-admin/login",
        credentials
      );
      toast.success(res?.data?.message || "Login successful!");
      return res.data;
    } catch (err) {
      // Specific logic for unverified users
      if (err?.response?.data?.code === "EMAIL_NOT_VERIFIED") {
        return thunkAPI.rejectWithValue({
          unverified: true,
          email: credentials.email,
          message:
            err?.response?.data?.message ||
            "Account not verified. Please verify your email.",
        });
      }
      return handleError(err, "Login failed", thunkAPI);
    }
  }
);

export const register = createAsyncThunk(
  "user/register",
  async (userData, thunkAPI) => {
    try {
      const res = await axiosClient.post(
        "/auth/college-admin/register",
        userData
      );
      toast.success(
        res?.data?.message ||
          "Registration successful! Please verify your email."
      );
      return { email: userData.email, ...res.data };
    } catch (err) {
      return handleError(err, "Registration failed", thunkAPI);
    }
  }
);

export const logout = createAsyncThunk("user/logout", async (_, thunkAPI) => {
  try {
    const res = await axiosClient.get("/auth/college-admin/logout");
    toast.success(res?.data?.message || "Logged out successfully");
    return res.data;
  } catch (err) {
    return handleError(err, "Logout failed", thunkAPI);
  }
});

export const verifyOTP = createAsyncThunk(
  "user/verifyOTP",
  async ({ email, otp }, thunkAPI) => {
    try {
      const res = await axiosClient.post("/auth/college-admin/verify-otp", {
        email,
        otp,
      });
      toast.success(res?.data?.message || "Email verified successfully!");
      return res.data.data.user;
    } catch (err) {
      return handleError(err, "OTP verification failed", thunkAPI);
    }
  }
);

export const resendOTP = createAsyncThunk(
  "user/resendOTP",
  async (email, thunkAPI) => {
    try {
      const res = await axiosClient.post(
        "/auth/college-admin/resend-verification-otp",
        { email }
      );
      toast.success(
        res?.data?.message || "Verification code resent to your email"
      );
      return res.data;
    } catch (err) {
      return handleError(err, "Failed to resend OTP", thunkAPI);
    }
  }
);

export const restartVerification = createAsyncThunk(
  "user/restartVerification",
  async (email, thunkAPI) => {
    try {
      const res = await axiosClient.post("/restart-verification", { email });
      toast.success(
        res?.data?.message || "Verification restarted successfully"
      );
      return res.data.email;
    } catch (err) {
      return handleError(err, "Failed to restart verification", thunkAPI);
    }
  }
);

// ============================================================================
// THUNKS: USER DATA & SETTINGS
// ============================================================================

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, thunkAPI) => {
    try {
      const res = await axiosClient.get(
        "/auth/college-admin/get-college-admin"
      );
      return res.data.data;
    } catch (err) {
      return handleError(err, "Failed to fetch user data", thunkAPI);
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (credentials, thunkAPI) => {
    try {
      const res = await axiosClient.post(
        "/auth/college-admin/change-password",
        credentials
      );
      toast.success(res?.data?.message || "Password changed successfully!");
      return res.data;
    } catch (err) {
      return handleError(err, "Failed to change password", thunkAPI);
    }
  }
);

// ============================================================================
// THUNKS: IMAGES & UPLOADS (Optimistic UI)
// ============================================================================

export const updateProfilePicture = createAsyncThunk(
  "user/updateProfilePicture",
  async ({ imageFile }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", imageFile);

      const res = await axiosClient.patch(
        "/college-admin/profile-picture",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(res?.data?.message || "Profile picture updated!");
      return res.data.data;
    } catch (err) {
      return handleError(err, "Failed to update profile picture", thunkAPI);
    }
  }
);

export const updateCollegeImage = createAsyncThunk(
  "user/updateCollegeImage",
  async ({ imageFile }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("collegeImage", imageFile);

      const res = await axiosClient.patch("/college/college-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res?.data?.message || "College Image updated!");
      return res.data.data;
    } catch (err) {
      return handleError(err, "Failed to update college image", thunkAPI);
    }
  }
);

export const updateCollegeLetterHead = createAsyncThunk(
  "user/updateCollegeLetterHead",
  async ({ imageFile }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("letterHeadImage", imageFile);

      const res = await axiosClient.patch(
        "/college/college-letterhead",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(res?.data?.message || "College letter head updated!");
      return res.data.data;
    } catch (err) {
      return handleError(err, "Failed to update college letter head", thunkAPI);
    }
  }
);

export const updateCollegeLogo = createAsyncThunk(
  "user/updateCollegeLogo",
  async ({ imageFile }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("logoImage", imageFile);

      const res = await axiosClient.patch("/college/college-logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res?.data?.message || "College logo updated!");
      return res.data.data;
    } catch (err) {
      return handleError(err, "Failed to update college logo", thunkAPI);
    }
  }
);

// ============================================================================
// SLICE
// ============================================================================

const initialState = {
  // --- Core User Data ---
  user: null,
  loading: true,
  error: null,

  // --- Authentication States ---
  loggingIn: false,
  registering: false,
  verifying: false,
  registeredEmail: null,
  unverifiedEmail: null,

  // --- Feature States ---
  changingPassword: false,
  changePasswordError: null,

  // --- Optimistic UI: Profile Picture ---
  updatingProfilePicture: false,
  originalProfilePicture: null, // Fallback for rollback

  // --- Optimistic UI: College Image ---
  collegeImage: {
    updatingImage: false,
    orgCollegeImage: null, // Fallback for rollback
  },
  collegeLetterHead: {
    updatingletterHeadImage: false,
    orgLetterHeadImage: null, // Fallback for rollback
  },
  collegeLogo: {
    updatingLogo: false,
    orgLogo: null, // Fallback for rollback
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
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
        state.error = action.payload;
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
        state.error = action.payload;
        if (action.payload?.unverified) {
          state.unverifiedEmail = action.payload.email;
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
        state.error = action.payload;
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
        state.error = action.payload;
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
        state.changePasswordError = action.payload;
      })

      // --- Update Profile Picture (Optimistic) ---
      .addCase(updateProfilePicture.pending, (state, action) => {
        state.updatingProfilePicture = true;
        state.error = null;
        // Optimistic update: Show local preview immediately
        if (state.user?.collegeAdmin) {
          state.originalProfilePicture = state.user.collegeAdmin.profilePicture;
          state.user.collegeAdmin.profilePicture = action.meta.arg.previewUrl;
        }
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        state.updatingProfilePicture = false;
        // Confirm update with server response
        if (state.user?.collegeAdmin) {
          state.user.collegeAdmin.profilePicture =
            action.payload.profilePicture;
        }
        state.originalProfilePicture = null;
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.updatingProfilePicture = false;
        state.error = action.payload;
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
          state.collegeImage.orgCollegeImage =
            state.user.collegeAdmin.collegeId.image;
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
        state.error = action.payload;
        if (
          state.user?.collegeAdmin?.collegeId &&
          state.collegeImage.orgCollegeImage
        ) {
          state.user.collegeAdmin.collegeId.image =
            state.collegeImage.orgCollegeImage;
        }
        state.collegeImage.orgCollegeImage = null;
      })

      // --- Update College letterhead (Optimistic) ---
      .addCase(updateCollegeLetterHead.pending, (state, action) => {
        state.collegeLetterHead.updatingletterHeadImage = true;
        state.error = null;
        if (state.user?.collegeAdmin?.collegeId) {
          state.collegeLetterHead.orgLetterHeadImage =
            state.user.collegeAdmin.collegeId.letterHead;
          state.user.collegeAdmin.collegeId.letterHead =
            action.meta.arg.previewUrl;
        }
      })
      .addCase(updateCollegeLetterHead.fulfilled, (state, action) => {
        state.collegeLetterHead.updatingletterHeadImage = false;
        if (state.user?.collegeAdmin?.collegeId) {
          state.user.collegeAdmin.collegeId.letterHead =
            action.payload.letterHead;
        }
        state.collegeLetterHead.orgLetterHeadImage = null;
      })
      .addCase(updateCollegeLetterHead.rejected, (state, action) => {
        state.collegeLetterHead.updatingletterHeadImage = false;
        state.error = action.payload;
        if (
          state.user?.collegeAdmin?.collegeId &&
          state.collegeLetterHead.orgLetterHeadImage
        ) {
          state.user.collegeAdmin.collegeId.letterHead =
            state.collegeLetterHead.orgLetterHeadImage;
        }
        state.collegeLetterHead.orgLetterHeadImage = null;
      })
      // --- Update College logo (Optimistic) ---
      .addCase(updateCollegeLogo.pending, (state, action) => {
        state.collegeLogo.updatingLogo = true;
        state.error = null;
        if (state.user?.collegeAdmin?.collegeId) {
          state.collegeLogo.orgLogo = state.user.collegeAdmin.collegeId.logo;
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
        state.error = action.payload;
        if (state.user?.collegeAdmin?.collegeId && state.collegeLogo.orgLogo) {
          state.user.collegeAdmin.collegeId.logo = state.collegeLogo.orgLogo;
        }
        state.collegeLogo.orgLogo = null;
      });
  },
});

export const { setUser, clearError } = userSlice.actions;
export default userSlice.reducer;

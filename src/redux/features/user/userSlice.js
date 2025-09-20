import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/utils/axios/axios";
import { toast } from "sonner";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, thunkAPI) => {
    try {
      const res = await axiosClient.get(
        "/auth/college-admin/get-college-admin"
      );
      return res.data.data; // Assuming it's nested like the login
    } catch (err) {
      console.error("Error fetching user data:", err);
      const errorMessage =
        err?.response?.data?.message || "Failed to fetch user data";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(
        err?.response?.data || { message: "Fetch user failed" }
      );
    }
  }
);

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
      // Check if the error is due to unverified user
      if (err?.response?.data?.code === "EMAIL_NOT_VERIFIED") {
        // Set unverified email directly without needing restart verification
        return thunkAPI.rejectWithValue({
          unverified: true,
          email: credentials.email,
          message:
            err?.response?.data?.message ||
            "Account not verified. Please verify your email.",
        });
      }

      const errorMessage = err?.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(
        err?.response?.data || { message: errorMessage }
      );
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
      // Ensure we return an object with email property
      return { email: userData.email, ...res.data };
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(
        err?.response?.data || { message: errorMessage }
      );
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "user/verifyOTP",
  async ({ email, otp }, thunkAPI) => {
    try {
      const res = await axiosClient.post("/auth/college-admin/verify-otp", {
        email,
        otp,
      });

      toast.success(res?.data?.message || "Email verified successfully!");
      // ... now you can find the correct path
      return res.data.data.user; // Assuming it's nested like the login
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "OTP verification failed";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(
        err?.response?.data || { message: errorMessage }
      );
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
      const errorMessage =
        err?.response?.data?.message || "Failed to resend OTP";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(
        err?.response?.data || { message: errorMessage }
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, thunkAPI) => {
    try {
      const res = await axiosClient.put("/user/update", userData);
      toast.success(res?.data?.message || "Profile updated successfully");
      return res.data.user;
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(
        err?.response?.data || { message: errorMessage }
      );
    }
  }
);

export const logout = createAsyncThunk("user/logout", async (_, thunkAPI) => {
  try {
    const res = await axiosClient.get("/auth/college-admin/logout");
    toast.success(res?.data?.message || "Logged out successfully");
    return res.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Error logging out");
    return thunkAPI.rejectWithValue(
      err?.response?.data || { message: "Logout failed" }
    );
  }
});

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
      console.error("Error restartVerification:", err);
      const errorMessage =
        err?.response?.data?.message || "Failed to restart verification";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(
        err?.response?.data || { message: errorMessage }
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: true,
    registering: false,
    verifying: false,
    loggingIn: false,
    error: null,
    registeredEmail: null,
    unverifiedEmail: null,
  },
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
      // Fetch user cases
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

      // Login cases
      .addCase(login.pending, (state) => {
        state.loggingIn = true;
        state.error = null;
        state.unverifiedEmail = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.data.user; // Correctly access the nested user object
        state.loggingIn = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loggingIn = false;
        state.error = action.payload;
        // If user is unverified, set unverifiedEmail for OTP modal
        if (action.payload?.unverified) {
          state.unverifiedEmail = action.payload.email;
        }
      })

      // Register cases
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

      // Verify OTP cases
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

      // Update profile case
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      // Logout case
      .addCase(logout.fulfilled, (state) => {
        // After logout, reset the state but ensure loading is FALSE.
        state.user = null;
      });
  },
});

export const { setUser, clearError } = userSlice.actions;
export default userSlice.reducer;

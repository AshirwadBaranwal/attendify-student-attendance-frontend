// Todo: Will be used later when user auth is added
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/utils/axios/axios";
import { toast } from "sonner";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, thunkAPI) => {
    try {
      const res = await axiosClient.get("/user");
      return res.data;
    } catch (err) {
      console.error("Error fetching user data:", err);
      return thunkAPI.rejectWithValue(
        err?.response?.data || "Fetch user failed"
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
      toast.success("Login successful!");
      return res.data;
    } catch (err) {
      // Check if the error is due to unverified user
      if (err?.response?.data?.code === "EMAIL_NOT_VERIFIED") {
        // Set unverified email directly without needing restart verification
        return thunkAPI.rejectWithValue({
          unverified: true,
          email: credentials.email,
          message: "Account not verified. Please verify your email."
        });
      }
      
      const errorMessage = err?.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(err?.response?.data);
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
      toast.success("Registration successful! Please verify your email.");
      // Ensure we return an object with email property
      return { email: userData.email };
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(err?.response?.data);
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
      toast.success("Email verified successfully!");
      return res.data.user;
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "OTP verification failed";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(err?.response?.data);
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
      toast.success("Verification code resent to your email");
      return res.data;
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "Failed to resend OTP";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(err?.response?.data);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, thunkAPI) => {
    try {
      const res = await axiosClient.put("/user/update", userData);
      toast.success("Profile updated successfully");
      return res.data.user;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
      return thunkAPI.rejectWithValue(err?.response?.data);
    }
  }
);

export const logout = createAsyncThunk(
  "/auth/college-admin/logout",
  async (_, thunkAPI) => {
    try {
      await axiosClient.post("/logout");
      toast.success("Logged out successfully");
      window.location.href = "/login";
    } catch (err) {
      toast.error("Error logging out");
    }
  }
);

export const restartVerification = createAsyncThunk(
  "user/restartVerification",
  async (email, thunkAPI) => {
    try {
      const res = await axiosClient.post("/restart-verification", { email });
      return res.data.email;
    } catch (err) {
      console.error("Error restartVerification:", err);
      return thunkAPI.rejectWithValue(err?.response?.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
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
        state.user = action.payload.user;
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
        state.user = null;
        state.loading = false;
        state.registeredEmail = null;
      });
  },
});

export const { setUser, clearError } = userSlice.actions;
export default userSlice.reducer;

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

export const logout = createAsyncThunk("user/logout", async (_, thunkAPI) => {
  try {
    await axiosClient.post("/logout");
    toast.success("Logged out successfully");
    window.location.href = "/login";
  } catch (err) {
    toast.error("Error logging out");
  }
});

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
    loading: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
      });
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;

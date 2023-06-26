import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import Auth, { AdminLoginPayload, AdminLoginResponse } from "../../client/auth";

type AuthState = {
  user: AdminLoginResponse | null;
};
// Initial State
const initialState = {
  user: null,
};

export const adminLogin = createAsyncThunk(
  "auth/login",
  async (payload: AdminLoginPayload, { rejectWithValue }) => {
    try {
      const user = await Auth.adminLogin(payload);
      if (!user) {
        return rejectWithValue("Invalid credentials");
      }
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue, getState }) => {
    try {
      // @ts-ignore
      const { user }: AuthState = getState().auth;
      if (!user) {
        return rejectWithValue("Invalid credentials");
      }
      const refreshToken = await Auth.refreshAccessToken(user.refreshToken);
      if (!refreshToken) {
        return rejectWithValue("Invalid credentials");
      }
      return refreshToken;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  Auth.removeTokens();
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: initialState as AuthState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // adminLogin ve refreshAccessToken action'larından herhangi biri fulfilled olduğunda
    builder.addMatcher(
      isAnyOf(adminLogin.fulfilled, refreshAccessToken.fulfilled, logout.fulfilled),
      (state, action) => {
        state.user = action.payload;
      }
    );
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;

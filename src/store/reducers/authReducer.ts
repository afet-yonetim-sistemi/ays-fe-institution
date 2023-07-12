import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import * as AuthService from "../../client/services/auth";
import * as TokenService from "../../client/services/token";
import { refreshAccessToken as axiosRefreshAccessToken } from "../../client/axiosInstance";
import { setNotification } from "./UIReducer";
import { translate } from "../../common/utils/translateUtils";
import jwt_decode from "jwt-decode";

type JWT = {
  jti: string;
  iss: string;
  iat: number;
  exp: number;
  institutionId: string;
  userLastName: string;
  userType: string;
  userFirstName: string;
  userId: string;
  username: string;
};

type AuthState = {
  user: AuthService.AdminTokenResponse["response"] | null;
  data: JWT | null;
};
// Initial State
const initialState = {
  user: null,
  data: null,
};

export const adminLogin = createAsyncThunk(
  "auth/login",
  async (
    payload: AuthService.AdminTokenRequest,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const user = await AuthService.adminLogin(payload);
      if (!user) {
        dispatch(
          setNotification({
            message: translate("UI.NOTIFICATION.ERROR"),
            description: translate("ERRORS.AUTH.INVALID_CREDENTIALS"),
            type: "error",
          })
        );
        return rejectWithValue(translate("ERRORS.AUTH.INVALID_CREDENTIALS"));
      }
      return user;
    } catch (error: any) {
      if (error.response.status === 401) {
        dispatch(
          setNotification({
            message: translate("UI.NOTIFICATION.ERROR"),
            description: translate("ERRORS.AUTH.INVALID_CREDENTIALS"),
            type: "error",
          })
        );
      } else {
        dispatch(
          setNotification({
            message: translate("UI.NOTIFICATION.ERROR"),
            description: translate("ERRORS.DEFAULT.MESSAGE"),
            type: "error",
          })
        );
      }
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
      const refreshToken = await axiosRefreshAccessToken(user.refreshToken);
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
  await AuthService.invalidate();
  TokenService.removeTokens();
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: initialState as AuthState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.data = jwt_decode(action.payload?.accessToken);
    },
  },
  extraReducers: (builder) => {
    // adminLogin ve refreshAccessToken action'larından herhangi biri fulfilled olduğunda
    builder.addMatcher(
      isAnyOf(
        adminLogin.fulfilled,
        refreshAccessToken.fulfilled,
        logout.fulfilled
      ),
      (state, action) => {
        state.user = action.payload;
      }
    );
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;

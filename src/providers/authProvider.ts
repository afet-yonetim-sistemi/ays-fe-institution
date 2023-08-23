import { AuthBindings } from "@refinedev/core";
import { axiosInstance } from "../utilities/axiosInstance";
import { AdminInvalidateResponse, AdminTokenResponse } from "@/types";
import jwtDecode from "jwt-decode";
import i18n from "@/i18n";

export const TOKEN_KEY = "token";

export const authProvider: AuthBindings = {
  login: async ({ username, password }) => {
    try {
      const { data: response } = await axiosInstance.post<AdminTokenResponse["response"]>(
        "authentication/admin/token",
        {
          username,
          password,
        }
      );

      if (response?.accessToken && response?.refreshToken) {
        localStorage.setItem(TOKEN_KEY, response?.accessToken);
        localStorage.setItem(TOKEN_KEY + "_refresh", response?.refreshToken);
        return {
          success: true,
          redirectTo: "/",
        };
      }
      return {
        success: false,
        error: {
          name: i18n.t("pages.login.errors.invalidCredentials"),
          message: i18n.t("notifications.failure"),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: i18n.t("pages.login.errors.invalidCredentials"),
          message: i18n.t("notifications.failure"),
        },
      };
    }
  },
  logout: async () => {
    try {
      const logoutResp = await axiosInstance.post<AdminInvalidateResponse>(
        "authentication/admin/token/invalidate",
        {
          refreshToken: localStorage.getItem(TOKEN_KEY + "_refresh"),
        }
      );
      console.log(logoutResp);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_KEY + "_refresh");

      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error) {
      console.log(error);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_KEY + "_refresh");
      return {
        success: false,
        redirectTo: "/login",
      };
    }
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken;
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};

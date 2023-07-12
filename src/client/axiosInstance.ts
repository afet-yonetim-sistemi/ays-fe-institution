import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  removeTokens,
  setAccessToken,
  setRefreshToken,
} from "./services/token";
import { paths } from "../types/OpenAPITypes";

export type RefreshTokenPath =
  paths["/api/v1/authentication/admin/token/refresh"]["post"];
export type RefreshTokenResponse =
  RefreshTokenPath["responses"]["200"]["content"]["*/*"];

let refreshSubscribers: (() => void)[] = [];
let isRefreshing = false;

const REFRESH_TOKEN_URL = "authentication/admin/token/refresh";

const TOKEN_URL = "authentication/admin/token";

const baseEndpoint = "authentication";

// Axios instance
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api/v1`,
});

// atılan her istekten önce çalışır
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (config.url && !REFRESH_TOKEN_URL.includes(config.url) && accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    // Handle request error
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// gelen her dönüşten sonra çalışır
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      TOKEN_URL !== originalRequest.url
    ) {
      if (originalRequest.url === REFRESH_TOKEN_URL) {
        window.location.href = "/login";
        removeTokens();
      }

      originalRequest._retry = true;
      const accessToken = getAccessToken();
      const retryOriginalRequest = new Promise((resolve, reject) => {
        refreshSubscribers.push(() => {
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          resolve(api(originalRequest));
        });
      });

      if (!isRefreshing) {
        isRefreshing = true;
        await refreshAccessToken();
      }

      return retryOriginalRequest;
    }

    return Promise.reject(error);
  }
);

// Refresh access token function
export const refreshAccessToken = async (refreshToken?: string) => {
  try {
    const res = await api.post(`${baseEndpoint}/admin/token/refresh`, {
      refreshToken: refreshToken || getRefreshToken(),
    });
    const data = res?.data as RefreshTokenResponse;
    if (data?.response?.accessToken) {
      setAccessToken(data?.response?.accessToken);
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data?.response?.accessToken}`;
    }

    if (data?.response?.refreshToken) {
      setRefreshToken(data?.response?.refreshToken);
      refreshSubscribers.forEach((subscriber) => subscriber());
    }

    return res?.data;
  } catch (error) {
    console.error("Refresh token error:", error);
  } finally {
    isRefreshing = false;
  }
};

export default api;

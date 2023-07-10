import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "./services/token";
import { paths } from "../types/OpenAPITypes";

export type RefreshTokenPath =
  paths["/api/v1/authentication/admin/token/refresh"]["post"];
export type RefreshTokenResponse =
  RefreshTokenPath["responses"]["200"]["content"]["*/*"];

const REFRESH_TOKEN_URL = "/api/v1/authentication/admin/token/refresh";

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

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await refreshAccessToken();
        if (!refreshToken) {
          window.location.href = "/login";
        }
      } catch (refreshError) {
        console.error("Failed to refresh access token:", refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Refresh access token function
export const refreshAccessToken = async (refreshToken?: string) => {
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
  }

  return res?.data;
};

export default api;

import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "./services/token";
import { AdminLoginResponse } from "./services/auth";

const baseEndpoint = "authentication";

// Axios instance
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api/v1`,
});

// atılan her istekten önce çalışır
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
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
  const res = await api.post<AdminLoginResponse>(
    `${baseEndpoint}/admin/token/refresh`,
    {
      refreshToken: refreshToken || getRefreshToken(),
    }
  );

  if (res?.data?.accessToken) {
    setAccessToken(res?.data?.accessToken);
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${res?.data?.accessToken}`;
  }

  if (res?.data?.refreshToken) {
    setRefreshToken(res?.data?.refreshToken);
  }

  return res?.data;
};

export default api;

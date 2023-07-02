import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  refreshAccessToken,
} from "./services/token";
// Create a new instance of Axios
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api/v1`,
});

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

const accessToken = getAccessToken();
if (accessToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
}

export default api;

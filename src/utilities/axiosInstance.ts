/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { ENV } from ".";
import { RefreshTokenResponse } from "@/types";

const baseEndpoint = "authentication";
const refreshTokenUrl = `${baseEndpoint}/admin/token/refresh`;
const loginUrl = `${baseEndpoint}/admin/token`;
const invalidateUrl = `${baseEndpoint}/admin/token/invalidate`;
const registerAdminUrl = `${baseEndpoint}/admin/register`;

// Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${ENV.API_URL}`,
});

// Function that will be called to refresh authorization
const refreshAuthLogic = async (failedRequest: any) => {
  const url = failedRequest.response.config.url;
  if (url.includes(loginUrl) || url.includes(invalidateUrl) || url.includes(registerAdminUrl)) {
    return Promise.reject(failedRequest);
  }

  const oldRefreshToken = localStorage.getItem(ENV.TOKEN_KEY + "_refresh");
  try {
    const { data } = await axiosInstance.post<RefreshTokenResponse["response"]>(
      refreshTokenUrl,
      {
        refreshToken: oldRefreshToken,
      },
      {
        headers: {
          authorization: false,
        },
      }
    );

    if (!data) {
      return Promise.reject(failedRequest);
    }

    const { accessToken, refreshToken } = data || {};

    if (!accessToken || !refreshToken) {
      return Promise.reject(failedRequest);
    }

    // save new tokens
    setTokens(accessToken, refreshToken);
    // set header
    failedRequest.response.config.headers["Authorization"] = "Bearer " + accessToken;

    // retry failed request
    return await Promise.resolve();
  } catch (error) {
    removeTokens();
    window.location.href = "/login";
    return Promise.reject(failedRequest);
  }
};

createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic, {
  shouldRefresh: (failedRequest: any) => {
    const url = failedRequest.response.config.url;
    if (url === loginUrl || url === invalidateUrl) {
      return false;
    }
    if (url === refreshTokenUrl) {
      removeTokens();
      window.location.reload();
      return false;
    }
    return true;
  },
});

// it will be called before every request
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(ENV.TOKEN_KEY);
    if (accessToken && config.headers) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // if method is patch, convert it to put
    if (config.method === "patch") {
      config.method = "put";
    }

    return config;
  },
  (error) => {
    // Handle request error
    console.log("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response?.data?.response) {
      response.data = response.data.response;
    }

    return response;
  },

  (error) => {
    // Handle response error
    console.log("Response interceptor error:", error);
    return Promise.reject(error);
  }
);

const removeTokens = () => {
  localStorage.removeItem(ENV.TOKEN_KEY);
  localStorage.removeItem(ENV.TOKEN_KEY + "_refresh");
};

const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(ENV.TOKEN_KEY, accessToken);
  localStorage.setItem(ENV.TOKEN_KEY + "_refresh", refreshToken);
};

export { axiosInstance, setTokens, removeTokens };

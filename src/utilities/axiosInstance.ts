/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { ENV } from ".";
import { Pagination, RefreshTokenResponse, Sorters } from "@/types";

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
    console.log(data);
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
    const url = config.url;
    if (getToPost(url || "")) {
      config.url = removeAllParams(url || "");
      config.method = "post";
      // set body
      config.data = {
        pagination: setPaginationFromParams(url || ""),
        sort: setSortersFromParams(url || ""),
      };
    }
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
    if (response?.data?.response?.content) {
      response.data = response.data.response.content;
    } else if (response?.data?.response) {
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

const extractParams = (url: string) => {
  const params = url.split("?")[1];
  if (!params) {
    return {};
  }
  const paramsArray = params.split("&");
  const paramsObject: any = {};
  paramsArray.forEach((param) => {
    const [key, value] = param.split("=");
    paramsObject[key] = value;
  });

  return paramsObject;
};

const getToPost = (url: string) => {
  const params = extractParams(url);
  if (params && params["getToPost"]) {
    return true;
  }
  return false;
};

const removeAllParams = (url: string) => {
  const params = extractParams(url);
  if (!params) {
    return url;
  }
  const paramsArray = Object.keys(params);
  let newUrl = url.split("?")[0];
  paramsArray.forEach((param) => {
    newUrl = newUrl.replace(param, "");
  });
  return newUrl;
};

const setPaginationFromParams = (url: string): Pagination => {
  const params = extractParams(url);
  if (!params) {
    return {
      page: 1,
      pageSize: 10,
    };
  }

  const { _end, _start } = params;
  const perPage = _end ? _end - _start : 10;
  const page = _start ? Math.floor(_start / perPage) + 1 : 1;
  const pageSize = perPage;

  if (page && pageSize) {
    return {
      page,
      pageSize,
    };
  }

  return {
    page: 1,
    pageSize: 10,
  };
};

const setSortersFromParams = (url: string): Sorters => {
  const params = extractParams(url);
  if (!params) {
    return [];
  }

  const { _sort, _order } = params;

  if (_sort && _order) {
    const orders = _order.split("%2C");
    const sorts = _sort.split("%2C");
    const sorters: Sorters = [];
    orders.forEach((order: string, index: string | number) => {
      sorters.push({
        property: sorts[index],
        direction: order === "desc" ? "DESC" : "ASC",
      });
    });

    return sorters;
  }

  return [];
};

export { axiosInstance, setTokens, removeTokens };

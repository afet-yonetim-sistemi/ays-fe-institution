import Cookies from "js-cookie";
import { TOKENKEYS } from "../../common/contants/auth";
import { AdminLoginResponse } from "./auth";
import { axiosInstance } from "..";

const baseEndpoint = "authentication";
const setAccessToken = (accessToken: string) => {
  Cookies.set(TOKENKEYS.ACCESS_TOKEN, accessToken);
};

const getAccessToken = () => {
  return Cookies.get(TOKENKEYS.ACCESS_TOKEN);
};

const setRefreshToken = (refreshToken: string) => {
  Cookies.set(TOKENKEYS.REFRESH_TOKEN, refreshToken);
};

const getRefreshToken = () => {
  return Cookies.get(TOKENKEYS.REFRESH_TOKEN);
};

const removeTokens = () => {
  Cookies.remove(TOKENKEYS.ACCESS_TOKEN);
  Cookies.remove(TOKENKEYS.REFRESH_TOKEN);
};

const refreshAccessToken = async (refreshToken?: string) => {
  const res = await axiosInstance.post<AdminLoginResponse>(
    `${baseEndpoint}/admin/token/refresh`,
    {
      refreshToken: refreshToken || getRefreshToken(),
    }
  );

  if (res?.data?.accessToken) {
    setAccessToken(res?.data?.accessToken);
  }

  if (res?.data?.refreshToken) {
    setRefreshToken(res?.data?.refreshToken);
  }

  return res?.data;
};

export {
  setAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
  refreshAccessToken,
  removeTokens,
};

import Cookies from "js-cookie";
import { TOKENKEYS } from "../../common/contants/auth";

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

export {
  setAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
  removeTokens,
};

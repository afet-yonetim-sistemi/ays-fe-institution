import Cookies from "js-cookie";
import { TOKENKEYS } from "../contants/auth";

interface Props {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
}

export function saveAuthTokens(tokens: Props) {
  Cookies.set(TOKENKEYS.ACCESS_TOKEN, tokens.accessToken, {
    path: "/",
    expires: new Date(tokens.accessTokenExpiresAt),
  });

  Cookies.set(TOKENKEYS.REFRESH_TOKEN, tokens.refreshToken, { path: "/" });
}

export function removeAuthTokens() {
  Cookies.remove(TOKENKEYS.ACCESS_TOKEN, { path: "/" });
  Cookies.remove(TOKENKEYS.REFRESH_TOKEN, { path: "/" });
}

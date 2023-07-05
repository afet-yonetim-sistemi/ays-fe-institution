import { axiosInstance } from "..";
import { getRefreshToken, setAccessToken, setRefreshToken } from "./token";

export interface AdminLoginResponse {
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
}

export interface AdminLoginPayload {
  username: string;
  password: string;
}

const baseEndpoint = "authentication";

const adminLogin = async (credentials: AdminLoginPayload) => {
  const res = await axiosInstance.post(
    `${baseEndpoint}/admin/token`,
    credentials
  );
  const response = res?.data.response as AdminLoginResponse;
  if (response?.accessToken) {
    setAccessToken(response?.accessToken);
  }

  if (response?.refreshToken) {
    setRefreshToken(response?.refreshToken);
  }

  return response;
};

const invalidate = async () => {
  const refreshToken = getRefreshToken();
  await axiosInstance.post(`${baseEndpoint}/admin/token/invalidate`, {
    refreshToken,
  });
};

export { adminLogin, invalidate };

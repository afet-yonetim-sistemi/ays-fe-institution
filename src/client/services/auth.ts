import { axiosInstance } from "..";
import { paths } from "../../types/OpenAPITypes";
import { getRefreshToken, setAccessToken, setRefreshToken } from "./token";

export type AdminTokenPath =
  paths["/api/v1/authentication/admin/token"]["post"];

export type AdminTokenResponse =
  AdminTokenPath["responses"]["200"]["content"]["*/*"];

export type AdminTokenRequest =
  AdminTokenPath["requestBody"]["content"]["application/json"];

export type GetUsersPath = paths["/api/v1/users"]["post"];

const baseEndpoint = "authentication";

const adminLogin = async (credentials: AdminTokenRequest) => {
  const res = await axiosInstance.post(
    `${baseEndpoint}/admin/token`,
    credentials
  );
  const { response } = res?.data as AdminTokenResponse;
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

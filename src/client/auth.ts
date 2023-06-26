import Client from "./base";

export interface AdminLoginResponse {
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
}

export interface AdminLoginPayload  {
  username: string;
  password: string;
};

class AuthClient extends Client {
  private baseEndpoint = "authentication";

  public adminLogin = async (credentials: AdminLoginPayload) => {
    const res = await this.fetch<AdminLoginResponse>(
      `${this.baseEndpoint}/admin/token`,
      {
        method: "POST",
        params: credentials,
        auth: false,
      }
    );

    return res?.response;
  };

  public refreshAccessToken = async (refreshToken?: string) => {
    const res = await this.fetch<AdminLoginResponse>(
      `${this.baseEndpoint}/admin/token/refresh`,
      {
        method: "POST",
        auth: false,
        params: {
          refreshToken: refreshToken || this.getRefreshToken(),
        },
      }
    );

    return res?.response;
  };
}

export { AuthClient };

const Auth = new AuthClient();

export default Auth;

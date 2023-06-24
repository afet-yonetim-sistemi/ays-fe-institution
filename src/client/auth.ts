import Client from "./base";

interface AdminLoginResponse {
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
}

class AuthClient extends Client {
  private baseEndpoint = "authentication";

  public adminLogin = async (credentials: {
    username: string;
    password: string;
  }) => {
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
}

export { AuthClient };

const Auth = new AuthClient();

export default Auth;

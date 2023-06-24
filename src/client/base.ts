import Cookies from "js-cookie";
import { TOKENKEYS } from "../common/contants/auth";

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

  /**
   *  İsteğin headerında Authorization'ı kaldırmak için auth false gönderilebilir
   * @defaultValue `true`
   */
  auth?: boolean;
  params?: { [key: string]: string };
  headers?: { [key: string]: string };
}

class Client {
  private baseUrl?: string = `${process.env.REACT_APP_API_BASE_URL}/api/v1`;
  private accessToken?: string | null = Cookies.get(TOKENKEYS.ACCESS_TOKEN);
  private refreshToken?: string | null = Cookies.get(TOKENKEYS.REFRESH_TOKEN);

  public fetch = async (url: string, customOptions: FetchOptions) => {
    const options = {
      method: "GET",
      auth: true,
      ...customOptions,
    };

    let params;

    if (options.method === "GET") {
      const queries = new URLSearchParams(options.params);

      url = `${url}?${queries.toString()}`;
    } else if (options.params) {
      params = JSON.stringify(options.params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/${url}`, {
        method: options.method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(options.auth &&
            this.accessToken && {
              Authorization: `Bearer ${this.accessToken}`,
            }),
          ...options.headers,
        },
        ...(params && {
          body: params,
        }),
      });

      const data = await response.json();

      return data;
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error({ [url]: err });
      }
    }
  };
}

export default Client;

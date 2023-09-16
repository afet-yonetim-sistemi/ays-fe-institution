export type Config = {
  PUBLIC_API_URL: string;
  API_URL: string;
  TOKEN_KEY: string;
};

export const ENV: Config = {
  PUBLIC_API_URL: import.meta.env.VITE_API_BASE_URL as string,
  API_URL: (import.meta.env.VITE_API_BASE_URL + "/api/v1") as string,
  TOKEN_KEY: import.meta.env.VITE_TOKEN as string,
};

export type CountryCode = {
  name: string;
  code: string;
  phoneCode: string;
};
export const countryCodes: CountryCode[] = [
  {
    name: "Türkiye",
    code: "TR",
    phoneCode: "+90",
  },
  {
    name: "Azərbaycan",
    code: "AZ",
    phoneCode: "+994",
  },
];

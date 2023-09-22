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

type Location = {
  lat: number; // it can be between -90 and 90
  lng: number; // it can be between -180 and 180
};

export const checkLocationIsValid = (location: Location) => {
  const { lat, lng } = location;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return false;
  }
  return true;
};

export const getDistance = (location1: Location, location2: Location) => {
  const R = 6371e3; // metres
  const φ1 = (location1.lat * Math.PI) / 180; // φ, λ in radians
  const φ2 = (location2.lat * Math.PI) / 180;
  const Δφ = ((location2.lat - location1.lat) * Math.PI) / 180;
  const Δλ = ((location2.lng - location1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
};

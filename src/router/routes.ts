// Import React
import { LazyExoticComponent, lazy } from "react";

// Type
export type Troute = {
  title: string;
  url: string;
  element: LazyExoticComponent<() => JSX.Element>;
};

// Pages
const Homepage = lazy(() => import("../pages/home/Homepage"));
const Users = lazy(() => import("../pages/users/Users"));
const UsersDetail = lazy(() => import("../pages/users/show/index"));

export const routes: Troute[] = [
  { title: "MENU.HOME", url: "/", element: Homepage },
  { title: "MENU.USERS", url: "/users", element: Users },
  { title: "MENU.USERS", url: "/users/:id", element: UsersDetail },
];

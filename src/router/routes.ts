// Import React
import { lazy } from "react";

// Pages
const Homepage = lazy(() => import("../pages/home/Homepage"));
const Users = lazy(() => import("../pages/users/Users"));

export const routes = [
	{ name: "MENU.HOME", url: "/", element: Homepage },
	{ name: "MENU.USERS", url: "/users", element: Users },
];

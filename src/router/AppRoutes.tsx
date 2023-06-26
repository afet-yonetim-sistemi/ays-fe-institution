// Import React
import { Suspense, useEffect, useState } from "react";

// Import Redux
import { useAppDispatch, useAppSelector } from "../store/store";

// Import React Router
import { Routes, Route } from "react-router-dom";

// Import Layout
import Layout from "../layout/Layout";

// Import Routes
import { routes as routesConfig } from "./routes";
import type { Troute } from "./routes";

// Import Pages
import Error404 from "../pages/error-pages/Error404";
import Login from "../pages/login/Login";

// Import i18n
import i18n from "../common/locales/i18n";
import { refreshAccessToken } from "../store/reducers/authReducer";

function AppRoutes() {
	// useStates
	const [template, setTemplate] = useState<any>();

	// Store Variables
	const user = useAppSelector((state) => state.auth.user);
	// Redux Dispatch
	const dispatch = useAppDispatch();

	// Eğer kullanıcı varsa ve access token süresi dolmuşsa yenile
	useEffect(() => {
		if (!user) {
			return;
		}
		const now = Date.now() / 1000; 
		if (user.accessTokenExpiresAt &&  user.accessTokenExpiresAt < now ) {
		  dispatch(refreshAccessToken());
		}
	}, [dispatch, user]);

	const handler = () => {
		if (user) {
			setTemplate(
				<Routes>
					<Route path="/" element={<Layout />}>
						{routesConfig.map((route: Troute, index) => (
							<Route
								key={`route_${index}`}
								path={route.url !== "/" ? route.url : undefined}
								index={route.url === "/" ? true : false}
								element={<Suspense fallback={<div>loading...</div>}>{<route.element />}</Suspense>}
							/>
						))}
					</Route>
					<Route key={`route_404`} path="*" element={<Error404 />} />
				</Routes>
			);
		} else {
			setTemplate(<Login />);
		}
	};

	useEffect(() => {
		handler();
		// eslint-disable-next-line
	}, [i18n?.language, user]);

	return template;
}

export default AppRoutes;

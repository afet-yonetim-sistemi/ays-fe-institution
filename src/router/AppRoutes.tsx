// Import React
import { Suspense, useEffect, useState } from "react";

// Import Redux
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

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

function AppRoutes() {
	// useStates
	const [template, setTemplate] = useState<any>();

	// Store Variables
	const user = useSelector((state: RootState) => state?.login?.user);

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

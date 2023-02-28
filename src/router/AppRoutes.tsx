// Import React
import { Suspense, useEffect, useState } from "react";

// Import React Router
import { Routes, Route } from "react-router-dom";

// Import Layout
import Layout from "../layout/Layout";

// Import Routes
import { routes as routesConfig } from "./routes";
import type { Troute } from "./routes";

// Import Pages
import Login from "../pages/login/Login";

// Import i18n
import i18n from "../common/locales/i18n";

function AppRoutes() {
	const [template, setTemplate] = useState<any>();

	const handler = () => {
		const userToken = sessionStorage.getItem("jwtToken");
		if (!userToken) {
			setTemplate(
				<Routes>
					{routesConfig.map((route: Troute, index) => (
						<Route path="/" element={<Layout />}>
							<Route
								key={`route_${index}`}
								path={route.url !== "/" ? route.url : undefined}
								index={route.url === "/" ? true : false}
								element={<Suspense fallback={<div>loading...</div>}>{<route.element />}</Suspense>}
							/>
						</Route>
					))}

					<Route
						key={`route_404`}
						path="*"
						element={<Suspense fallback={<div>loading...</div>}> {<div>404</div>} </Suspense>}
					/>
				</Routes>
			);
		} else {
			setTemplate(<Login />);
		}
	};

	useEffect(() => {
		handler();
	}, [i18n?.language]);

	return template;
}

export default AppRoutes;

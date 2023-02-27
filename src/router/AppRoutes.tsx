// Import React
import { Suspense, useEffect, useState } from "react";

// Import React Router
import { Routes, Route } from "react-router-dom";

// Import Layout
import Layout from "../layout/Layout";

// Import Routes
import { routes as routesConfig } from "./routes";

function AppRoutes() {
	const [template, setTemplate] = useState<any>();

	const handler = () => {
		//	const userToken = sessionStorage.getItem("jwtToken");
		if (true) {
			setTemplate(
				<Routes>
					{routesConfig.map((route: any, index) => (
						<Route
							key={`route_${index}`}
							path={route.url !== "/" ? route.url : undefined}
							index={route.url === "/" ? true : false}
							element={
								<Suspense fallback={<div>loading...</div>}>
									{
										<Layout>
											<route.element />
										</Layout>
									}
								</Suspense>
							}
						/>
					))}

					<Route
						key={`route_404`}
						path="*"
						element={<Suspense fallback={<div>loading...</div>}> {<div>404</div>} </Suspense>}
					/>
				</Routes>
			);
		} else {
			//  setTemplate(<Login handlerFunction={handler} />);
		}
	};

	useEffect(() => {
		handler();
	}, []);

	return template;
}

export default AppRoutes;

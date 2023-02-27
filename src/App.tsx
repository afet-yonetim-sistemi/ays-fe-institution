// Import Style
import "antd/dist/reset.css";

// Import Router
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router/AppRoutes";

// Import i18next
import { withTranslation } from "react-i18next";
import "./common/locales/i18n";

function App() {
	return (
		<BrowserRouter>
			<AppRoutes />
		</BrowserRouter>
	);
}

export default withTranslation()(App);

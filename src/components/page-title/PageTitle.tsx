// Import Router
import { useLocation } from "react-router";

// Import Utils
import { translate } from "../../common/utils/translateUtils";

// Import Constants
import { routes } from "../../router/routes";

// Import Style
import "../../assets/style/_pageTitle.scss";

function PageTitle() {
	// Variables
	const { pathname } = useLocation();

	// Get Page Title
	const myRoute = routes?.find(route => route?.url === pathname);

	return myRoute ? (
		<div className="page-title">
			<h3> {translate(myRoute?.title)} </h3>
		</div>
	) : (
		<div></div>
	);
}

export default PageTitle;

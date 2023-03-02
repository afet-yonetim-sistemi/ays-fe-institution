// Import Router
import { useNavigate } from "react-router-dom";

// Import Utils
import { translate } from "../../common/utils/translateUtils";

// Import Constants
import { STATUS } from "../../common/contants/status";
import { ICON_LIST } from "../../common/contants/iconList";
import { ICON_STATUS } from "../../common/contants/iconStatus";

// Import Components
import Button from "../../components/Button/Button";
import Icon from "../../components/Icon/Icon";

// Import Style
import "../../assets/style/error404.scss";

function Error404() {
	// Variables
	const navigate = useNavigate();

	return (
		<div className="error_404_wrapper">
			<h1> {translate("OTHERS.404_ERROR")} </h1>
			<p>{translate("OTHERS.404_DESCRIPTION")}</p>
			<Button
				name="404_cta_back"
				label="FORM_ELEMENTS.CTA.BACK_TO_HOMEPAGE"
				status={STATUS.PRIMARY}
				onClick={() => navigate("/")}
				icon={<Icon icon={ICON_LIST.ARROW_LEFT} status={ICON_STATUS.WHITE} />}
			/>
		</div>
	);
}

export default Error404;

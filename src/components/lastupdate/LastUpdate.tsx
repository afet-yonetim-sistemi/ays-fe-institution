// Import Components
import { translate } from "../../common/utils/translateUtils";

// Import Assets

interface LastUpdateProps {
	className?: string;
	time: string | undefined;
	label?: string | undefined;
}

function LastUpdate(props: LastUpdateProps) {
	// Desctruct Props
	const { className, time } = props;

	return (
		<div {...props} className={`last-update-container ${className}`}>
			<div className="title">{translate("GLOBAL.COMPONENTS.LAST_UPDATE.TITLE_UPDATE")}</div>
			<div className="update-time">{time}</div>
		</div>
	);
}

export default LastUpdate;

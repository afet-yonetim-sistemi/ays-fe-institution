// Import React
import React, { ReactElement } from "react";

// Import Constants
import { ICON_STATUS } from "../../common/contants/iconStatus";

export interface IconProps {
	status: ICON_STATUS;
	size?: number;
	name: ReactElement;
}

CustomIcon.defaultProps = {
	status: ICON_STATUS.SECONDARY,
};

function CustomIcon(props: IconProps) {
	// Descturct Props
	const { size, name, status } = props;

	return (
		<>
			{React.cloneElement(name, {
				width: size,
				height: size,
				color: `${status}`,
			})}
		</>
	);
}

export default CustomIcon;

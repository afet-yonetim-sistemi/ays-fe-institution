// Import React
import { ReactNode } from "react";

// Import Antd
import { Drawer as DrawerAntd } from "antd";
import { DrawerProps as DrawerPropsAntd } from "antd/lib/drawer/index";

// Import Utils
import { translate } from "../../common/utils/translateUtils";

// Import Constants
import { ICON_LIST } from "../../common/contants/iconList";

// Import Components
import Icon from "../Icon/Icon";

export interface DrawerProps extends DrawerPropsAntd {
	onClose: (() => void) | undefined;
	visible: boolean | undefined;
	title?: string;
	footer?: ReactNode;
}

function Drawer(props: DrawerProps) {
	// Desctruct Props
	const { children, onClose, visible, title, footer } = props;

	return (
		<DrawerAntd
			{...props}
			width={window.innerWidth > 575 ? 500 : window.innerWidth - 100}
			title={title && translate(title)}
			onClose={onClose}
			closeIcon={<Icon icon={ICON_LIST.CLOSE} size="lg" />}
			open={visible}
			bodyStyle={{ paddingBottom: 80 }}
			footer={<div className="text_align_right">{footer}</div>}
			closable={true}
		>
			{children}
		</DrawerAntd>
	);
}

export default Drawer;

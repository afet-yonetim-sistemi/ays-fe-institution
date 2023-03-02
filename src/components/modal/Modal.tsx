// Import Antd
import { Modal as ModalAntd } from "antd";
import { ModalProps as ModalPrpsAntd } from "antd/lib/modal";

// Import Utils
import { translate } from "../../common/utils/translateUtils";

// Import Constants
import { ICON_LIST } from "../../common/contants/iconList";

//Import Components
import Icon from "../Icon/Icon";

export interface IModal extends ModalPrpsAntd {
	visible: boolean | undefined;
	title?: string;
	children: any;
}

function Modal(props: IModal) {
	// Props Destruction
	const { children, visible, title } = props;

	return (
		<ModalAntd
			{...props}
			keyboard
			title={title && translate(title)}
			closeIcon={<Icon icon={ICON_LIST.CLOSE} size="lg" />}
			open={visible}
			destroyOnClose
		>
			{children}
		</ModalAntd>
	);
}

export default Modal;

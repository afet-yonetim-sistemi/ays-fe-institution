// Import Utils
import { translate } from "../../common/utils/translateUtils";

// Import Constants
import { ICON_LIST } from "../../common/contants/iconList";
import { ICON_STATUS } from "../../common/contants/iconStatus";

// Import Antd
import { Popconfirm as AntdPopConfirm, PopconfirmProps } from "antd";

// Import Components
import Icon from "../Icon/Icon";

interface IPopConfirm extends PopconfirmProps {
	onConfirm: () => void;
	title: string;
}

function PopConfirm(props: IPopConfirm) {
	// Props Destruction
	const { onConfirm, title, children } = props;
	return (
		<AntdPopConfirm
			{...props}
			title={translate(title)}
			description={translate("POPCONFIRM.DESCRIPTION.SURE")}
			onConfirm={onConfirm}
			icon={<Icon icon={ICON_LIST.CLOSE} status={ICON_STATUS.DANGER} />}
			okText={translate("FORM_ELEMENTS.CTA.YES")}
			cancelText={translate("FORM_ELEMENTS.CTA.CANCEL")}
			cancelButtonProps={{ className: "btn-secondary btn-sm" }}
			okButtonProps={{ className: "btn-danger btn-sm" }}
		>
			{children}
		</AntdPopConfirm>
	);
}

export default PopConfirm;

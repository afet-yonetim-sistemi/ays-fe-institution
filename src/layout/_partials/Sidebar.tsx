// Import Router
import { useNavigate, useLocation } from "react-router-dom";

// Import Utils
import { translate } from "../../common/utils/translateUtils";

// Import Constants
import { MENU } from "./menu";

// Import Antd
import { Layout as AntdLayout, Menu } from "antd";

// Import Components
import Icon from "../../components/Icon/Icon";

interface ISidebar {
	collapsed: boolean;
	setCollapsed: (status: boolean) => void;
}

function Sidebar(props: ISidebar) {
	// Props Destruction
	const { collapsed, setCollapsed } = props;

	// Layout Destruction
	const { Sider } = AntdLayout;

	// Variables
	const navigate = useNavigate();
	const location = useLocation();

	return (
		<Sider
			className="layout-sider"
			collapsible
			collapsed={collapsed}
			defaultCollapsed
			width={300}
			trigger={null}
			onCollapse={collapsed => setCollapsed(collapsed)}
		>
			<div className="logo">AYS</div>
			<Menu
				theme="dark"
				mode="inline"
				defaultSelectedKeys={[
					MENU?.find(menuItem => location?.pathname === menuItem?.url)?.url || "",
				]}
				onClick={e => {
					navigate(e?.key);
				}}
				items={MENU?.map(item => {
					return {
						...item,
						key: item?.url,
						title: translate(item?.label),
						label: !collapsed && translate(item?.label),
						icon: <Icon icon={item?.icon} marginRight={10} />,
					};
				})}
			/>
		</Sider>
	);
}

export default Sidebar;

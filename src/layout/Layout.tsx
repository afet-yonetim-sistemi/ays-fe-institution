// Import React
import React, { useState } from "react";

// Import Antd
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout as AntdLayout, Menu, theme } from "antd";

// Import Router
import { useNavigate, useLocation, Outlet } from "react-router-dom";

// Import Utils
import { translate } from "../common/utils/translateUtils";

// Import Constants
import { MENU } from "./menu";

// Import Components
import Icon from "../components/Icon/Icon";

// Import Style
import "../assets/style/_layout.scss";

const Layout: React.FC = () => {
	// useStates
	const [collapsed, setCollapsed] = useState(true);

	// Variables
	const navigate = useNavigate();
	const location = useLocation();

	// Layout Destruction
	const { Header, Sider, Content } = AntdLayout;

	// Get Theme
	const {
		token: { colorBgContainer },
	} = theme.useToken();

	return (
		<AntdLayout className="root-layout" hasSider>
			<Sider
				className="layout-sider"
				collapsible
				collapsed={collapsed}
				defaultCollapsed
				width={300}
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
			<AntdLayout>
				<Header className="layout-header" style={{ background: colorBgContainer }}>
					<div className="header-left">
						{collapsed ? (
							<MenuUnfoldOutlined onClick={() => setCollapsed(!collapsed)} />
						) : (
							<MenuFoldOutlined onClick={() => setCollapsed(!collapsed)} />
						)}
					</div>
					<div className="header-right"></div>
				</Header>
				<Content className="layout-main">
					<Outlet />
				</Content>
			</AntdLayout>
		</AntdLayout>
	);
};

export default Layout;

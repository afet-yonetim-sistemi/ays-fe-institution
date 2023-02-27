// Import React
import React, { useState, ReactElement } from "react";

// Import Antd
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";

// Import Router
import { useNavigate, useLocation } from "react-router-dom";

// Import Utils
import { translate } from "../common/utils/translateUtils";

// Import Constants
import { MENU } from "./menu";

// Import Style
import "../assets/style/_layout.scss";

interface ILayout {
	children?: ReactElement | ReactElement[];
}

const App: React.FC<ILayout> = props => {
	// Props Destruction
	const { children } = props;

	// useStates
	const [collapsed, setCollapsed] = useState(false);

	// Variables
	const navigate = useNavigate();
	const location = useLocation();

	// Layout Destruction
	const { Header, Sider, Content } = Layout;

	// Get Theme
	const {
		token: { colorBgContainer },
	} = theme.useToken();

	return (
		<Layout className="root-layout">
			<Sider trigger={null} className="sider-layout" collapsible collapsed={collapsed}>
				<div className="logo">AYS</div>
				<Menu
					theme="dark"
					mode="inline"
					defaultSelectedKeys={[
						MENU?.find((menuItem: any) => location?.pathname === menuItem?.url)?.url || "",
					]}
					onClick={e => {
						navigate(e?.key);
					}}
					items={MENU?.map(Item => {
						return {
							...Item,
							key: Item?.url,
							label: translate(Item?.label),
							icon: <Item.icon />,
						};
					})}
				/>
			</Sider>
			<Layout className="site-layout">
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
				<Content
					style={{
						margin: "24px 16px",
						padding: 24,
						minHeight: 280,
					}}
				>
					{children}
				</Content>
			</Layout>
		</Layout>
	);
};

export default App;

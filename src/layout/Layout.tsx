// Import React
import React, { useState } from "react";

// Import Antd
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
import { Layout as AntdLayout, Menu, theme, Dropdown, MenuProps, Avatar } from "antd";

// Import Router
import { useNavigate, useLocation, Outlet } from "react-router-dom";

// Import Utils
import { translate } from "../common/utils/translateUtils";

// Import Constants
import { MENU } from "./menu";

// Import i18n
import i18n from "../common/locales/i18n";

// Import Components
import PageTitle from "../components/page-title/PageTitle";
import Icon from "../components/Icon/Icon";

// Import Style
import "../assets/style/_layout.scss";

const Layout: React.FC = () => {
	// useStates
	const [collapsed, setCollapsed] = useState(true);

	// Variables
	const navigate = useNavigate();
	const location = useLocation();

	// Header Menu
	const items: MenuProps["items"] = [
		{
			key: "1",
			label: translate(i18n?.language === "tr" ? "HEADER.ENGLISH" : "HEADER.TURKISH"),
			onClick: () => i18n?.changeLanguage(i18n?.language === "tr" ? "en" : "tr"),
		},
		{ key: "2", label: translate("HEADER.LOGOUT") },
	];

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
					<div className="header-right">
						<Dropdown trigger={["click"]} menu={{ items }} placement="bottom">
							<div className="header-dropdown-trigger">
								<div className="user-info">
									<p className="full-name">
										<span>Name</span> <span>Surname</span>
									</p>
									<p className="company">AFAD</p>
								</div>
								<Avatar icon={<UserOutlined />} />
							</div>
						</Dropdown>
					</div>
				</Header>
				<Content className="layout-main">
					<PageTitle />
					<Outlet />
				</Content>
			</AntdLayout>
		</AntdLayout>
	);
};

export default Layout;

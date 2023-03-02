// Import React
import React, { useState } from "react";

// Import Antd
import { Layout as AntdLayout } from "antd";

// Import Router
import { Outlet } from "react-router-dom";

// Import Components
import LocationModal from "../components/modal/LocationModal";
import PageTitle from "../components/page-title/PageTitle";

// Import Partials
import Sidebar from "./_partials/Sidebar";
import Header from "./_partials/Header";

// Import Style
import "../assets/style/_layout.scss";

const Layout: React.FC = () => {
	// useStates
	const [collapsed, setCollapsed] = useState(true);
	const [findMyModalVisible, setFindMyModalVisible] = useState<boolean>(false);
	const [myLocationPoint, setMyLocationPoint] = useState<any>(null);

	// Layout Destruction
	const { Content } = AntdLayout;

	return (
		<>
			<AntdLayout className="root-layout" hasSider>
				<Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
				<AntdLayout>
					<Header
						collapsed={collapsed}
						setCollapsed={setCollapsed}
						setMyLocationPoint={setMyLocationPoint}
						setFindMyModalVisible={setFindMyModalVisible}
					/>
					<Content className="layout-main">
						<PageTitle />
						<Outlet />
					</Content>
				</AntdLayout>
			</AntdLayout>
			<LocationModal
				location={myLocationPoint}
				markerDescription="MAP.YOU_ARE_HERE"
				title="MAP.YOUR_LOCATION"
				visible={findMyModalVisible}
				onCancel={() => {
					setFindMyModalVisible(false);
				}}
			/>
		</>
	);
};

export default Layout;

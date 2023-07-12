// Import React
import { useState } from "react";

// Import Store
import { useAppDispatch, useAppSelector } from "../../store/store";
import { logout } from "../../store/reducers/authReducer";

// Import i18n
import i18n from "../../common/locales/i18n";

// Import Utils
import { notificationUtil } from "../../common/utils/notification";
import { translate } from "../../common/utils/translateUtils";

// Import Constants
import { ICON_LIST } from "../../common/contants/iconList";
import { ICON_STATUS } from "../../common/contants/iconStatus";

// Import Antd
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout as AntdLayout, Dropdown, Avatar, MenuProps } from "antd";

// Import Components
import Button from "../../components/Button/Button";
import Icon from "../../components/Icon/Icon";

interface IHeader {
  collapsed: boolean;
  setCollapsed: (status: boolean) => void;
  setFindMyModalVisible: (status: boolean) => void;
  setMyLocationPoint: (status: number[]) => void;
}

function Header(props: IHeader) {
  // Props Destruction
  const { collapsed, setCollapsed, setMyLocationPoint, setFindMyModalVisible } =
    props;

  // Layout Destruction
  const { Header } = AntdLayout;

  // useStates
  const [myLocationFindLoading, setMyLocationFindLoading] =
    useState<boolean>(false);

  // Variables
  const dispatch = useAppDispatch();

  // Actions
  const changeLang = (lang: string) => {
    i18n?.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  // State
  const user = useAppSelector((state) => state.auth.data);

  const findMe = () => {
    setMyLocationFindLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMyLocationPoint([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          setFindMyModalVisible(true);
          setMyLocationFindLoading(false);
        },
        (err) => {
          console.warn(`Geolocation error (${err.code}): ${err.message}`);
          notificationUtil(
            `Geolocation error (${err.code})`,
            err.message,
            "error"
          );
          setMyLocationFindLoading(false);
        },
        { timeout: 20000 } // Timeout in ms
      );
    }
  };

  // Header Menu
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: translate(
        i18n?.language === "tr" ? "HEADER.ENGLISH" : "HEADER.TURKISH"
      ),
      onClick: () => changeLang(i18n?.language === "tr" ? "en" : "tr"),
    },
    {
      key: "2",
      label: translate("HEADER.LOGOUT"),
      onClick: () => dispatch(logout()),
    },
  ];
  return (
    <Header className="layout-header" style={{ background: "#fff" }}>
      <div className="header-left">
        {collapsed ? (
          <MenuUnfoldOutlined onClick={() => setCollapsed(!collapsed)} rev="" />
        ) : (
          <MenuFoldOutlined onClick={() => setCollapsed(!collapsed)} rev="" />
        )}
      </div>
      <div className="header-right">
        <Button
          label="MAP.WHERE_AM_I"
          name="nerdeyim_cta"
          type="ghost"
          loading={myLocationFindLoading}
          onClick={findMe}
          marginright={20}
          icon={<Icon icon={ICON_LIST.MAP_PIN} status={ICON_STATUS.BLACK} />}
        />
        <Dropdown trigger={["click"]} menu={{ items }} placement="bottom">
          <div className="header-dropdown-trigger">
            <div className="user-info">
              <p className="full-name">
                {user?.userFirstName + " " + user?.userLastName}
              </p>
              <p className="company">AFAD</p>
            </div>
            <Avatar icon={<UserOutlined rev="" />} />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
}

export default Header;

import { DownOutlined, UserOutlined } from "@ant-design/icons";
import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import {
  useGetIdentity,
  useGetLocale,
  useLogout,
  useNotification,
  useSetLocale,
  useTranslate,
} from "@refinedev/core";
import {
  Avatar,
  Button,
  Dropdown,
  Layout as AntdLayout,
  MenuProps,
  Space,
  Switch,
  theme,
  Typography,
  Row,
} from "antd";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../contexts/app";
import { TokenPayload } from "@/types";
import WhereAmI from "../layout/WhereAmI";
import LocationIcon from "../icons/LocationIcon";
import useIsMobile from "./useIsMobile";

const { Text } = Typography;
const { useToken } = theme;

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({ sticky }) => {
  const { token } = useToken();
  const { i18n } = useTranslation();
  const t = useTranslate();
  const locale = useGetLocale();
  const changeLanguage = useSetLocale();
  const { mode, setMode } = useContext(AppContext);
  const { data: user } = useGetIdentity<TokenPayload>();
  const { mutate: logout } = useLogout();
  const [myLocationFindLoading, setMyLocationFindLoading] = useState<boolean>(false);
  const [myLocationPoint, setMyLocationPoint] = useState<[number, number]>([0, 0]);
  const [myLocationModalVisible, setMyLocationModalVisible] = useState<boolean>(false);
  const { open } = useNotification();
  const isMobile = useIsMobile();
  const currentLocale = locale();
  const items: MenuProps["items"] = [
    {
      key: 1,
      label: t("buttons.logout"),
      onClick: () => logout(),
    },
  ];
  const menuItems: MenuProps["items"] = [...(i18n.languages || [])].sort().map((lang: string) => ({
    key: lang,
    onClick: () => changeLanguage(lang),
    icon: (
      <span style={{ marginRight: 8 }}>
        <Avatar size={16} src={`/images/flags/${lang}.svg`} />
      </span>
    ),
    label: lang === "tr" ? "Türkçe" : "English",
  }));

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  const findMyLocation = () => {
    setMyLocationFindLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMyLocationPoint([position.coords.latitude, position.coords.longitude]);
          setMyLocationModalVisible(true);
          setMyLocationFindLoading(false);
        },
        (err) => {
          let description = "";
          let message = err.message;
          switch (err.code) {
            case 1:
              description = t("locationModal.geoLocationErrors.permissionDenied");
              message = t("locationModal.geoLocationErrors.message");
              break;
            case 2:
              description = t("locationModal.geoLocationErrors.positionUnavailable");
              break;
            case 3:
              description = t("locationModal.geoLocationErrors.timeout");
              break;
            default:
              description = t("locationModal.geoLocationErrors.unknownError");
              break;
          }
          open &&
            open({
              type: "error",
              message,
              description,
            });

          setMyLocationFindLoading(false);
        },
        { timeout: 20000 } // Timeout in ms
      );
    }
  };

  return (
    <AntdLayout.Header style={headerStyles}>
      <Space>
        <Button
          type="text"
          onClick={findMyLocation}
          loading={myLocationFindLoading}
          icon={<LocationIcon />}
          className="d-flex"
        >
          <Space>{t("locationModal.whereAmI")}</Space>
        </Button>
        <Dropdown
          menu={{
            items: menuItems,
            selectedKeys: currentLocale ? [currentLocale] : [],
          }}
        >
          <Button type="text">
            <Space>
              <Avatar size={16} src={`/images/flags/${currentLocale}.svg`} />
              {currentLocale === "tr" ? "Türkçe" : "English"}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>

        <Switch
          checkedChildren="🌛"
          unCheckedChildren="🔆"
          onChange={() => setMode(mode === "light" ? "dark" : "light")}
          defaultChecked={mode === "dark"}
        />
        {user && (
          <Dropdown
            menu={{
              items: items,
            }}
          >
            <Space style={{ cursor: "pointer", marginLeft: "1.5em" }}>
              {!isMobile && (
                <Row
                  style={{
                    marginRight: "1em",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "end",
                  }}
                >
                  <Text strong>{user.userFirstName + " " + user.userLastName}</Text>
                  <Text>{user.institutionName}</Text>
                </Row>
              )}
              <Avatar icon={<UserOutlined rev="" />} />
            </Space>
          </Dropdown>
        )}
        <WhereAmI
          location={myLocationPoint}
          open={myLocationModalVisible}
          onCancel={() => setMyLocationModalVisible(false)}
        />
      </Space>
    </AntdLayout.Header>
  );
};

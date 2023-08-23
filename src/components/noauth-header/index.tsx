import { DownOutlined } from "@ant-design/icons";
import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { useGetLocale, useSetLocale } from "@refinedev/core";
import { Avatar, Button, Dropdown, MenuProps, Space, Switch } from "antd";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../contexts/app";

export const NoAuthHeader: React.FC<RefineThemedLayoutV2HeaderProps> = () => {
  const { i18n } = useTranslation();
  const locale = useGetLocale();
  const changeLanguage = useSetLocale();
  const { mode, setMode } = useContext(AppContext);

  const currentLocale = locale();

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

  return (
    <Space
      style={{
        display: "flex",
        justifyContent: "end",
        padding: "1.5em",
        position: "absolute",
        right: 0,
        width: "100%",
      }}
    >
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
    </Space>
  );
};

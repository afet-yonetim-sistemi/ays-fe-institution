import React, { CSSProperties, useContext } from "react";
import { Layout, Menu, Grid, Drawer, Button, theme, Divider, Typography } from "antd";
import {
  DashboardOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
  BarsOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  useTranslate,
  useLogout,
  useTitle,
  CanAccess,
  ITreeMenu,
  useIsExistAuthentication,
  useRouterContext,
  useMenu,
  useRefineContext,
  useLink,
  useRouterType,
  useActiveAuthProvider,
  pickNotDeprecated,
  useWarnAboutChange,
  useCustom,
} from "@refinedev/core";
import {
  RefineThemedLayoutV2SiderProps,
  ThemedTitleV2,
  useThemedLayoutContext,
} from "@refinedev/antd";
import { drawerButtonStyles } from "./styles";
import { AppContext } from "@/contexts/app";
import { ENV } from "@/utilities";
import packageJson from "../../../package.json";
import { AppVersion } from "@/types";

const { SubMenu } = Menu;
const { useToken } = theme;

export const ThemedSiderV2: React.FC<RefineThemedLayoutV2SiderProps> = ({
  Title: TitleFromProps,
  render,
  meta,
  fixed,
  activeItemDisabled = false,
}) => {
  const { data } = useCustom<AppVersion>({
    url: ENV.PUBLIC_API_URL + "/public/actuator/info",
    method: "get",
  });
  const appVersion = data?.data;

  const { token } = useToken();
  const { siderCollapsed, setSiderCollapsed, mobileSiderOpen, setMobileSiderOpen } =
    useThemedLayoutContext();

  const { mode } = useContext(AppContext);

  const isExistAuthentication = useIsExistAuthentication();
  const routerType = useRouterType();
  const NewLink = useLink();
  const { warnWhen, setWarnWhen } = useWarnAboutChange();
  const { Link: LegacyLink } = useRouterContext();
  const Link = routerType === "legacy" ? LegacyLink : NewLink;
  const TitleFromContext = useTitle();
  const translate = useTranslate();
  const { menuItems, selectedKey, defaultOpenKeys } = useMenu({ meta });
  const breakpoint = Grid.useBreakpoint();
  const { hasDashboard } = useRefineContext();
  const authProvider = useActiveAuthProvider();
  const { mutate: mutateLogout } = useLogout({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const isMobile = typeof breakpoint.lg === "undefined" ? false : !breakpoint.lg;

  const RenderToTitle = TitleFromProps ?? TitleFromContext ?? ThemedTitleV2;

  const renderTreeView = (tree: ITreeMenu[], selectedKey?: string) => {
    return tree.map((item: ITreeMenu) => {
      const { icon, label, route, key, name, children, parentName, meta, options } = item;

      if (children.length > 0) {
        return (
          <CanAccess
            key={item.key}
            resource={name.toLowerCase()}
            action="list"
            params={{
              resource: item,
            }}
          >
            <SubMenu key={item.key} icon={icon ?? <UnorderedListOutlined />} title={label}>
              {renderTreeView(children, selectedKey)}
            </SubMenu>
          </CanAccess>
        );
      }
      const isSelected = key === selectedKey;
      const isRoute = !(
        pickNotDeprecated(meta?.parent, options?.parent, parentName) !== undefined &&
        children.length === 0
      );

      const linkStyle: CSSProperties =
        activeItemDisabled && isSelected ? { pointerEvents: "none" } : {};

      return (
        <CanAccess
          key={item.key}
          resource={name.toLowerCase()}
          action="list"
          params={{
            resource: item,
          }}
        >
          <Menu.Item
            key={item.key}
            icon={icon ?? (isRoute && <UnorderedListOutlined />)}
            style={linkStyle}
          >
            <Link to={route ?? ""} style={linkStyle}>
              {label}
            </Link>
            {!siderCollapsed && isSelected && <div className="ant-menu-tree-arrow" />}
          </Menu.Item>
        </CanAccess>
      );
    });
  };

  const handleLogout = () => {
    if (warnWhen) {
      const confirm = window.confirm(
        translate(
          "warnWhenUnsavedChanges",
          "Are you sure you want to leave? You have unsaved changes."
        )
      );

      if (confirm) {
        setWarnWhen(false);
        mutateLogout();
      }
    } else {
      mutateLogout();
    }
  };

  const logout = isExistAuthentication && (
    <Menu.Item key="logout" onClick={() => handleLogout()} icon={<LogoutOutlined />}>
      {translate("buttons.logout", "Logout")}
    </Menu.Item>
  );

  const dashboard = hasDashboard ? (
    <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
      <Link to="/">{translate("dashboard.title", "Dashboard")}</Link>
      {!siderCollapsed && selectedKey === "/" && <div className="ant-menu-tree-arrow" />}
    </Menu.Item>
  ) : null;

  const items = renderTreeView(menuItems, selectedKey);

  const renderSider = () => {
    if (render) {
      return render({
        dashboard,
        items,
        logout,
        collapsed: siderCollapsed,
      });
    }
    return (
      <>
        {dashboard}
        {items}
      </>
    );
  };

  const renderMenu = () => {
    return (
      <Menu
        selectedKeys={selectedKey ? [selectedKey] : []}
        defaultOpenKeys={defaultOpenKeys}
        mode="inline"
        style={{
          paddingTop: "8px",
          border: "none",
          overflow: "auto",
          height: "calc(100% - 110px)",
        }}
        onClick={() => {
          setMobileSiderOpen(false);
        }}
      >
        {renderSider()}
      </Menu>
    );
  };

  const renderAppVersion = () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        {packageJson.version && appVersion && (
          <Typography.Text
            style={{
              color: mode === "light" ? token.colorPrimary : "white",
            }}
          >
            UI v{packageJson.version} | API v{appVersion?.application.version}
          </Typography.Text>
        )}
      </div>
    );
  };

  const renderDrawerSider = () => {
    return (
      <>
        <Drawer
          open={mobileSiderOpen}
          onClose={() => setMobileSiderOpen(false)}
          placement="left"
          closable={false}
          width={200}
          bodyStyle={{
            padding: 0,
          }}
          maskClosable={true}
        >
          <Layout>
            <Layout.Sider
              style={{
                height: "100vh",
                backgroundColor: token.colorBgContainer,
                borderRight: `1px solid ${token.colorBgElevated}`,
              }}
            >
              <>
                <div
                  style={{
                    width: "200px",
                    padding: "0 16px",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    height: "64px",
                    backgroundColor: token.colorBgElevated,
                    borderBottom: `1px solid ${token.colorBorder}`,
                  }}
                >
                  <RenderToTitle collapsed={false} />
                </div>
                {renderMenu()}
                {renderAppVersion()}
              </>
            </Layout.Sider>
          </Layout>
        </Drawer>
        <Button
          style={drawerButtonStyles}
          size="large"
          onClick={() => setMobileSiderOpen(true)}
          icon={<BarsOutlined color="white" />}
        ></Button>
      </>
    );
  };

  if (isMobile) {
    return renderDrawerSider();
  }

  const siderStyles: React.CSSProperties = {
    backgroundColor: token.colorBgContainer,
    borderRight: `1px solid ${token.colorBgElevated}`,
  };

  if (fixed) {
    siderStyles.position = "fixed";
    siderStyles.top = 0;
    siderStyles.height = "100vh";
    siderStyles.zIndex = 999;
  }

  return (
    <>
      {fixed && (
        <div
          style={{
            width: siderCollapsed ? "80px" : "200px",
            transition: "all 0.2s",
          }}
        />
      )}
      <Layout.Sider
        style={siderStyles}
        collapsible
        collapsed={siderCollapsed}
        onCollapse={(collapsed, type) => {
          if (type === "clickTrigger") {
            setSiderCollapsed(collapsed);
          }
        }}
        collapsedWidth={80}
        breakpoint="lg"
        trigger={
          <Button
            type="text"
            style={{
              borderRadius: 0,
              height: "100%",
              width: "100%",
              backgroundColor: token.colorBgElevated,
            }}
          >
            {siderCollapsed ? (
              <RightOutlined
                style={{
                  color: mode === "light" ? token.colorPrimary : "white",
                }}
              />
            ) : (
              <LeftOutlined
                style={{
                  color: mode === "light" ? token.colorPrimary : "white",
                }}
              />
            )}
          </Button>
        }
      >
        <div
          style={{
            width: siderCollapsed ? "80px" : "200px",
            padding: siderCollapsed ? "0" : "0 16px",
            display: "flex",
            justifyContent: siderCollapsed ? "center" : "flex-start",
            alignItems: "center",
            height: "64px",
            backgroundColor: token.colorBgElevated,
            fontSize: "14px",
            borderBottom: `1px solid ${token.colorBorder}`,
          }}
        >
          <RenderToTitle collapsed={siderCollapsed} />
        </div>
        {renderMenu()}
        {!siderCollapsed && renderAppVersion()}
      </Layout.Sider>
    </>
  );
};

import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { ErrorComponent, notificationProvider, ThemedLayoutV2 } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./providers/authProvider";
import { AppIcon } from "./components/app-icon";
import { Header } from "./components/header";
import { AppProvider } from "./contexts/app";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { axiosInstance } from "./utilities/axiosInstance";
import { ENV } from "./utilities";
import { UserList } from "./pages/users";
import { AdminList } from "./pages/admins";
import { ThemedSiderV2 } from "./components/sider";
import { ThemedTitleV2 } from "./components/sider/title";
import UserListIcon from "./components/icons/UserListIcon";
import AdminListIcon from "./components/icons/AdminListIcon";
import "./styles/index.css";
import { AssignmentList } from "./pages/assignments/AssignmentList";
import AssignmentListIcon from "./components/icons/AssignmentListIcon";
import { dataProvider } from "./providers/rest-data-provider";
import accessProvider from "./providers/access-provider";
import { useState } from "react";
import AuthChecker from "./components/AuthChecker";
import { UserTypes } from "./types";

function App() {
  const { t, i18n } = useTranslation();
  const [userType, setUserType] = useState<UserTypes>("GUEST");

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <AppProvider>
          <Refine
            dataProvider={dataProvider(ENV.API_URL, axiosInstance)}
            notificationProvider={notificationProvider}
            authProvider={authProvider}
            i18nProvider={i18nProvider}
            routerProvider={routerBindings}
            accessControlProvider={userType !== "GUEST" ? accessProvider(userType) : undefined}
            resources={[
              {
                name: "users",
                list: "/users",
                meta: {
                  label: t("users.title"),
                  icon: <UserListIcon />,
                },
              },
              {
                name: "admins",
                list: "/admins",
                meta: {
                  label: t("admins.title"),
                  icon: <AdminListIcon />,
                },
              },
              {
                name: "assignments",
                list: "/assignments",
                meta: {
                  label: t("assignments.title"),
                  icon: <AssignmentListIcon />,
                },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated fallback={<CatchAllNavigate to="/login" />}>
                    <ThemedLayoutV2
                      Header={() => <Header sticky />}
                      Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                      Title={({ collapsed }) => (
                        <ThemedTitleV2 collapsed={collapsed} icon={<AppIcon />} text={t("title")} />
                      )}
                    >
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route index element={<NavigateToResource resource={"/"} />} />
                <Route path="/users">
                  <Route index element={<UserList />} />
                </Route>
                <Route path="/admins">
                  <Route index element={<AdminList />} />
                </Route>
                <Route path="/assignments">
                  <Route index element={<AssignmentList />} />
                </Route>
                <Route path="*" element={<ErrorComponent />} />
              </Route>
              <Route
                element={
                  <Authenticated fallback={<Outlet />}>
                    <NavigateToResource />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<Login />} />
                <Route path="/register/:id" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>
            </Routes>

            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
            <AuthChecker setUserType={setUserType} />
          </Refine>
        </AppProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;

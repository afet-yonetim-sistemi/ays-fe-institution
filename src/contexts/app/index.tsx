import { RefineThemes } from "@refinedev/antd";
import { ConfigProvider, theme } from "antd";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

type AppContextType = {
  mode: string;
  setMode: (mode: string) => void;
};

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const colorModeFromLocalStorage = localStorage.getItem("colorMode");
  const isSystemPreferenceDark = window?.matchMedia("(prefers-color-scheme: dark)").matches;

  const systemPreference = isSystemPreferenceDark ? "dark" : "light";
  const [mode, setMode] = useState(colorModeFromLocalStorage || systemPreference);
  useEffect(() => {
    window.localStorage.setItem("colorMode", mode);
  }, [mode]);

  const setApp = () => {
    if (mode === "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  };

  const { darkAlgorithm, defaultAlgorithm, useToken } = theme;

  const token = useToken();

  const lightToken = {
    ...token,
    colorBgBase: "#fff",
  };

  const darkToken = {
    ...token,
    colorBgBase: "#1c2a3f",
  };

  return (
    <AppContext.Provider
      value={{
        setMode: setApp,
        mode,
      }}
    >
      <ConfigProvider
        // you can change the theme colors here. example: ...RefineThemes.Magenta,
        theme={{
          ...RefineThemes.Blue,
          algorithm: mode === "light" ? defaultAlgorithm : darkAlgorithm,
          token: mode === "light" ? lightToken : darkToken,
        }}
      >
        {children}
      </ConfigProvider>
    </AppContext.Provider>
  );
};

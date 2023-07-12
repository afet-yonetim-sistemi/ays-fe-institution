import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type UIState = {
  isDarkMode: boolean;
  isDrawerOpen: boolean;
  isMobile: boolean;
  notification: Notification;
};

type Notification = {
  message: string;
  description: string;
  type: "success" | "error" | "warning" | "info";
};

const initialState: UIState = {
  isDarkMode: false,
  isDrawerOpen: false,
  isMobile: false,
  notification: {
    message: "",
    description: "",
    type: "success",
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleDarkMode(state: UIState) {
      state.isDarkMode = !state.isDarkMode;
    },
    setNotification(state: UIState, action: PayloadAction<Notification>) {
      console.log("set", action.payload);
      state.notification = action.payload;
    },
    clearNotification(state: UIState) {
      state.notification = initialState.notification;
    },
  },
});

export const { toggleDarkMode, setNotification, clearNotification } =
  uiSlice.actions;

export default uiSlice.reducer;

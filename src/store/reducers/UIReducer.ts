import { createSlice } from "@reduxjs/toolkit";

type UIState = {
  isDarkMode: boolean;
  isDrawerOpen: boolean;
  isMobile: boolean;
};

const initialState = {
  isDarkMode: false,
  isDrawerOpen: false,
  isMobile: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleDarkMode(state: UIState) {
      state.isDarkMode = !state.isDarkMode;
    },
  },
});

export const { toggleDarkMode } = uiSlice.actions;

export default uiSlice.reducer;

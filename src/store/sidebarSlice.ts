import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SidebarState {
  collapsed: boolean
  ready: boolean
}

const initialState: SidebarState = {
  collapsed: false,
  ready: false,
}

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setCollapsed(state, action: PayloadAction<boolean>) {
      state.collapsed = action.payload
    },
    setReady(state, action: PayloadAction<boolean>) {
      state.ready = action.payload
    },
  },
})

export const { setCollapsed, setReady } = sidebarSlice.actions
export default sidebarSlice.reducer

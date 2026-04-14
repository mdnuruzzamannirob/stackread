import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type UIState = {
  sidebar: boolean
  theme: 'light' | 'dark' | 'system'
  modal: string | null
  recentlyViewed: string[]
  cmdkOpen: boolean
}

const initialState: UIState = {
  sidebar: false,
  theme: 'system',
  modal: null,
  recentlyViewed: [],
  cmdkOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebar: (state, action: PayloadAction<boolean>) => {
      state.sidebar = action.payload
    },
    setTheme: (state, action: PayloadAction<UIState['theme']>) => {
      state.theme = action.payload
    },
    setModal: (state, action: PayloadAction<string | null>) => {
      state.modal = action.payload
    },
    setCmdkOpen: (state, action: PayloadAction<boolean>) => {
      state.cmdkOpen = action.payload
    },
  },
})

export const { setSidebar, setTheme, setModal, setCmdkOpen } = uiSlice.actions

export default uiSlice.reducer

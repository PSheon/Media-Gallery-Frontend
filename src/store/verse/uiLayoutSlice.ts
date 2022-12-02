// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Types
import { IInitialState } from 'src/types/verse/uiLayoutTypes'

const initialState: IInitialState = {
  loadingScreenShow: true,
  appBarShow: false,
  moveControlShow: false,
  socialPanelShow: false,
  settingPanelShow: false,
  statsBoxShow: false,
  guiContainerShow: false
}

const uiLayoutSlice = createSlice({
  name: 'verse/uiLayout',
  initialState,
  reducers: {
    setLoadingScreenShow: (state, action) => {
      state.loadingScreenShow = action.payload
    },
    setAppBarShow: (state, action) => {
      state.appBarShow = action.payload
    },
    setMoveControlShow: (state, action) => {
      state.moveControlShow = action.payload
    },
    setSocialPanelShow: (state, action) => {
      state.socialPanelShow = action.payload
    },
    setSettingPanelShow: (state, action) => {
      state.settingPanelShow = action.payload
    },
    setStatsBoxShow: (state, action) => {
      state.statsBoxShow = action.payload
    },
    setGuiContainerShow: (state, action) => {
      state.guiContainerShow = action.payload
    }
  },
  extraReducers: {}
})

export const {
  setLoadingScreenShow,
  setAppBarShow,
  setMoveControlShow,
  setSocialPanelShow,
  setSettingPanelShow,
  setStatsBoxShow,
  setGuiContainerShow
} = uiLayoutSlice.actions

export default uiLayoutSlice.reducer

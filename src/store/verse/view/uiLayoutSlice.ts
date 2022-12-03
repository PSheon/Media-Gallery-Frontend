// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Types
import { IInitialState } from 'src/types/verse/view/uiLayoutTypes'

const initialState: IInitialState = {
  loadingScreenShow: true,
  appBarShow: false,
  moveControlShow: false,
  socialPanelShow: false,
  settingPanelShow: false,
  statsBoxShow: false
}

const uiLayoutSlice = createSlice({
  name: 'verse/view/uiLayout',
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
  setStatsBoxShow
} = uiLayoutSlice.actions

export default uiLayoutSlice.reducer

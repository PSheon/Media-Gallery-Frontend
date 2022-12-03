// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Types
import { IInitialState } from 'src/types/verse/edit/uiLayoutTypes'

const initialState: IInitialState = {
  loadingScreenShow: true,
  appBarShow: false,
  settingPanelShow: false,
  moveControlShow: false
}

const uiLayoutSlice = createSlice({
  name: 'verse/edit/uiLayout',
  initialState,
  reducers: {
    setLoadingScreenShow: (state, action) => {
      state.loadingScreenShow = action.payload
    },
    setAppBarShow: (state, action) => {
      state.appBarShow = action.payload
    },
    setSettingPanelShow: (state, action) => {
      state.settingPanelShow = action.payload
    },
    setMoveControlShow: (state, action) => {
      state.moveControlShow = action.payload
    }
  },
  extraReducers: {}
})

export const { setLoadingScreenShow, setAppBarShow, setSettingPanelShow, setMoveControlShow } = uiLayoutSlice.actions

export default uiLayoutSlice.reducer

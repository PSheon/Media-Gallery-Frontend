import { store as STORE } from 'src/store'
import {
  setLoadingScreenShow,
  setAppBarShow,
  setMoveControlShow,
  setSocialPanelShow,
  setSettingPanelShow,
  setStatsBoxShow,
  setGuiContainerShow
} from 'src/store/verse/uiLayoutSlice'
import { setLoadingProgress } from 'src/store/verse/loadingScreenSlice'
import { showStartPanel, setStartPanel } from 'src/store/verse/startPanelSlice'
import { showControlHintPanel, setControlHintPanel, hideControlHintPanel } from 'src/store/verse/controlHintPanelSlice'
import {
  showDialogBox,
  setDialogBoxStep,
  setDialogBox,
  setDialogBoxHover,
  hideDialogBox
} from 'src/store/verse/dialogBoxSlice'

import { generateDialogBoxPayload } from 'src/utils/generate-dialog-box-payload'

const { dispatch, getState } = STORE

/* UI Layout */
export const SHOW_LOADING_SCREEN = () => dispatch(setLoadingScreenShow(true))

export const SET_LOADING_PROGRESS = (payload: { percentage: number; content: string }) =>
  dispatch(setLoadingProgress(payload))

export const HIDE_LOADING_SCREEN = () => dispatch(setLoadingScreenShow(false))

export const SHOW_APP_BAR = () => dispatch(setAppBarShow(true))

export const HIDE_APP_BAR = () => dispatch(setAppBarShow(false))

export const SHOW_MOVE_CONTROL = () => dispatch(setMoveControlShow(true))

export const HIDE_MOVE_CONTROL = () => dispatch(setMoveControlShow(false))

export const SHOW_SOCIAL_PANEL = () => dispatch(setSocialPanelShow(true))

export const HIDE_SOCIAL_PANEL = () => dispatch(setSocialPanelShow(false))

export const SHOW_SETTING_PANEL = () => dispatch(setSettingPanelShow(true))

export const HIDE_SETTING_PANEL = () => dispatch(setSettingPanelShow(false))

export const SHOW_STATS_BOX = () => dispatch(setStatsBoxShow(true))

export const HIDE_STATS_BOX = () => dispatch(setStatsBoxShow(false))

export const SHOW_GUI_CONTAINER = () => dispatch(setGuiContainerShow(true))

export const HIDE_GUI_CONTAINER = () => dispatch(setGuiContainerShow(false))

/* Start Panel */
export const SHOW_START_PANEL_ACTION = () => {
  const startPanelShowStatus = getState().verse.startPanel.show
  if (!startPanelShowStatus) {
    dispatch(hideControlHintPanel())
    dispatch(showStartPanel())
  }
}

export const SET_START_PANEL_ACTION = (payload: {
  title: string
  content: string
  confirmButtonText: string
  closeCallback: () => void
}) => {
  dispatch(setStartPanel(payload))
}

/* Control Hint Panel */
export const SHOW_CONTROL_HINT_PANEL_ACTION = () => {
  const controlHintPanelShowStatus = getState().verse.controlHintPanel.show
  if (!controlHintPanelShowStatus) {
    dispatch(showControlHintPanel())
  }
}

export const SET_CONTROL_HINT_PANEL_ACTION = (payload: { title: string; content: string }) => {
  dispatch(setControlHintPanel(payload))
}

/* Dialog Box */
export const SHOW_DIALOG_BOX_ACTION = () => {
  const dialogBoxShowStatus = getState().verse.dialogBox.show
  if (dialogBoxShowStatus) {
    dispatch(setDialogBoxStep())
  } else {
    dispatch(showDialogBox())
  }
  document?.exitPointerLock()
}

export const SET_DIALOG_BOX_ACTION = (payload: { displayName: string; objectType: string }) => {
  const currentHoverStatus = getState().verse.dialogBox.hover

  if (!currentHoverStatus) {
    const dialogBoxPayload = generateDialogBoxPayload(payload)
    dispatch(setDialogBox(dialogBoxPayload))
  }
}

export const UN_HOVER_DIALOG_BOX_ACTION = () => {
  const currentHoverStatus = getState().verse.dialogBox.hover

  if (currentHoverStatus) {
    dispatch(setDialogBoxHover(false))
  }
}

export const HIDE_DIALOG_BOX_ACTION = () => {
  const dialogBoxShowStatus = getState().verse.dialogBox.show
  if (dialogBoxShowStatus) {
    dispatch(hideDialogBox())
  }
}

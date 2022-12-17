import { store as STORE } from 'src/store'
import {
  setLoadingScreenShow,
  setAppBarShow,
  setMoveControlShow,
  setSocialPanelShow,
  setSettingPanelShow
} from 'src/store/verse/view/uiLayoutSlice'
import { setLoadingProgress } from 'src/store/verse/view/loadingScreenSlice'
import { showStartPanel, setStartPanel } from 'src/store/verse/view/startPanelSlice'
import { setControlHintBox } from 'src/store/verse/view/controlHintBoxSlice'
import {
  showViewDialogBox,
  setViewDialogBox,
  setViewDialogBoxHover,
  hideViewDialogBox
} from 'src/store/verse/view/viewDialogBoxSlice'

import { generateViewDialogBoxPayload } from 'src/utils/generate-view-dialog-box-payload'

const { dispatch, getState } = STORE

export type IHoverObject = {
  hoverObjectType?: string
  hoverObjectMetadata: {
    framePosition: string
    displayName?: string
    position: {
      x: number
      y: number
      z: number
    }
    rotation: {
      x: number
      y: number
      z: number
    }
  }
}

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

/* Start Panel */
export const SHOW_START_PANEL_ACTION = () => {
  const startPanelShowStatus = getState().verse.view.startPanel.show
  if (!startPanelShowStatus) {
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

export const SET_CONTROL_HINT_BOX_ACTION = (payload: { title: string; content: string }) => {
  dispatch(setControlHintBox(payload))
}

/* Dialog Box */
export const SHOW_VIEW_DIALOG_BOX_ACTION = () => {
  const dialogBoxShowStatus = getState().verse.view.viewDialogBox.show

  // NOTE
  // if (dialogBoxShowStatus) {
  //   dispatch(setViewDialogBoxStep())
  // } else {
  //   dispatch(showViewDialogBox())
  // }
  if (!dialogBoxShowStatus) {
    dispatch(showViewDialogBox())
  }

  document?.exitPointerLock()
}

export const SET_VIEW_DIALOG_BOX_ACTION = (payload: IHoverObject) => {
  const currentHoverStatus = getState().verse.view.viewDialogBox.hover

  if (!currentHoverStatus) {
    const viewDialogBoxPayload = generateViewDialogBoxPayload(payload)
    dispatch(setViewDialogBox(viewDialogBoxPayload))
  }
}

export const UN_HOVER_VIEW_DIALOG_BOX_ACTION = () => {
  const currentHoverStatus = getState().verse.view.viewDialogBox.hover

  if (currentHoverStatus) {
    dispatch(setViewDialogBoxHover(false))
  }
}

export const HIDE_VIEW_DIALOG_BOX_ACTION = () => {
  const dialogBoxShowStatus = getState().verse.view.viewDialogBox.show
  if (dialogBoxShowStatus) {
    dispatch(hideViewDialogBox())
  }
}

import { store as STORE } from 'src/store'
import {
  setLoadingScreenShow,
  setAppBarShow,
  setMoveControlShow,
  setSettingPanelShow
} from 'src/store/verse/edit/uiLayoutSlice'
import { setLoadingProgress } from 'src/store/verse/edit/loadingScreenSlice'

import { setControlHintBox } from 'src/store/verse/edit/controlHintBoxSlice'

import {
  showEditDialogBox,
  setEditDialogBox,
  setEditDialogBoxHover,
  hideEditDialogBox
} from 'src/store/verse/edit/editDialogBoxSlice'

import { generateEditDialogBoxPayload } from 'src/utils/generate-edit-dialog-box-payload'

const { dispatch, getState } = STORE

export type IHoverObject = {
  hoverObjectType?: string
  hoverObjectMetadata: {
    displayName?: string
    position?: string
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

export const SHOW_SETTING_PANEL = () => dispatch(setSettingPanelShow(true))

export const HIDE_SETTING_PANEL = () => dispatch(setSettingPanelShow(false))

/* Control Hint Box */
export const SET_CONTROL_HINT_BOX_ACTION = (payload: { title: string; content: string }) => {
  dispatch(setControlHintBox(payload))
}

/* Edit Dialog Box */
export const SHOW_EDIT_DIALOG_BOX_ACTION = () => {
  const dialogBoxShowStatus = getState().verse.edit.editDialogBox.show
  if (!dialogBoxShowStatus) {
    dispatch(showEditDialogBox())
  }
  document?.exitPointerLock()
}

export const SET_EDIT_DIALOG_BOX_ACTION = (payload: IHoverObject) => {
  const currentHoverStatus = getState().verse.edit.editDialogBox.hover

  if (!currentHoverStatus) {
    const editDialogBoxPayload = generateEditDialogBoxPayload(payload)
    dispatch(setEditDialogBox(editDialogBoxPayload))
  }
}

export const UN_HOVER_EDIT_DIALOG_BOX_ACTION = () => {
  const currentHoverStatus = getState().verse.edit.editDialogBox.hover

  if (currentHoverStatus) {
    dispatch(setEditDialogBoxHover(false))
  }
}

export const HIDE_EDIT_DIALOG_BOX_ACTION = () => {
  const dialogBoxShowStatus = getState().verse.edit.editDialogBox.show
  if (dialogBoxShowStatus) {
    dispatch(hideEditDialogBox())
  }
}

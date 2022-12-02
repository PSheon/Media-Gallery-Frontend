import {
  SHOW_APP_BAR,
  HIDE_APP_BAR,
  SHOW_LOADING_SCREEN,
  HIDE_LOADING_SCREEN,
  SHOW_SETTING_PANEL,
  HIDE_SETTING_PANEL
} from 'src/views/verse/book/actions'

export class UIManager {
  public static setUserInterfaceVisible(show: boolean): void {
    if (show) {
      SHOW_APP_BAR()
      SHOW_SETTING_PANEL()

      // SHOW_MOVE_CONTROL()
      // SHOW_SOCIAL_PANEL()
    } else {
      HIDE_APP_BAR()
      HIDE_SETTING_PANEL()

      // HIDE_MOVE_CONTROL()
      // HIDE_SOCIAL_PANEL()
    }
  }

  public static setLoadingScreenVisible(show: boolean): void {
    if (show) {
      SHOW_LOADING_SCREEN()
    } else {
      HIDE_LOADING_SCREEN()
    }
  }

  public static setFPSVisible(value: boolean): void {
    const element = document.getElementById('statsBox') as HTMLElement
    element.style.display = value ? 'block' : 'none'

    // document.getElementById('dat-gui-container').style.top = value ? '48px' : '0px'
  }
}

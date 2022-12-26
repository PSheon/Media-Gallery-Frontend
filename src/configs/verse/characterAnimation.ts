interface IAnimation {
  clip: string
  fade: number
  duration: number
}

export const DEFAULT_ANIMATION_TABLE: IAnimation = {
  clip: 'wave_right_hand',
  fade: 0.1,
  duration: 2
}

/* TODO: Integrate ANIMATION_TABLE into API */
export const ANIMATION_TABLE: Record<string, IAnimation> = {
  wave_right_hand: {
    clip: 'wave_right_hand',
    fade: 0.1,
    duration: 2
  },
  sprint: {
    clip: 'sprint',
    fade: 0.1,
    duration: 3
  }
}

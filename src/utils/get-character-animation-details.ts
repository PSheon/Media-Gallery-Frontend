import { DEFAULT_ANIMATION_TABLE, ANIMATION_TABLE } from 'src/configs/verse/characterAnimation'

export const getAnimationDetails = (animationClip: string) => {
  return Object.assign(DEFAULT_ANIMATION_TABLE, ANIMATION_TABLE[animationClip])
}

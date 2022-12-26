export interface IInitialState {
  title: string
  content: IContent[]
}

interface IContent {
  keys: string[]
  desc: string
}

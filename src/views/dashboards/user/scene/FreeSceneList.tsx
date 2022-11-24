// ** React Imports
import { ChangeEvent, Dispatch, SetStateAction } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'

// ** Type Import
import { IScene } from './SceneCard'

// ** Components Imports
import SceneCard from './SceneCard'

interface Props {
  isLoading: boolean
  selected: string
  setSelected: Dispatch<SetStateAction<string>>
  sceneModels: IScene[]
}

const FreeSceneList = (props: Props) => {
  // ** Props
  const { isLoading, selected, setSelected, sceneModels } = props

  const handleChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === 'string' || typeof prop === 'number') {
      setSelected(prop)
    } else {
      setSelected((prop.target as HTMLInputElement).value)
    }
  }

  return (
    <Grid container spacing={4}>
      {isLoading &&
        [...Array(3).keys()].map(sIndex => (
          <Grid key={`scene-models-skeleton-${sIndex}`} item sm={4} xs={12}>
            <Skeleton variant='rounded' height={240} />
          </Grid>
        ))}
      {sceneModels?.map((scene, index) => (
        <SceneCard
          key={`scene-models-${index}`}
          selected={selected}
          handleChange={handleChange}
          radioName='scene-models-radios'
          {...scene}
        />
      ))}
    </Grid>
  )
}

export default FreeSceneList

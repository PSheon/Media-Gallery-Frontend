// ** React Imports
import { useState, Fragment } from 'react'

// ** Redux Imports
import { useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'

// ** Components Imports
import SceneCard from 'src/views/verse/components/edit/settingPanel/leftSection/SceneCard'
import CreateSceneCard from 'src/views/verse/components/edit/settingPanel/leftSection/CreateSceneCard'

// ** Utils Imports
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Types
import { RootState } from 'src/store'
import { IScene } from 'src/types/scene/sceneTypes'

const SceneListMenu = () => {
  // ** Hooks
  const auth = useAuth()
  const worldInstance = useSelector(({ verse }: RootState) => verse.edit.scene.worldInstance)
  const {
    isLoading: isQueryLoading,
    data: ownSceneList = [],
    refetch
  } = useQuery({
    queryKey: ['own-scene-list'],
    queryFn: () =>
      axios({
        method: 'GET',
        url: `/api/scenes/`,
        params: {
          filter: {
            owner: auth.user.id!
          },
          populate: {
            cover: true,
            assetList: {
              populate: {
                cover: true
              }
            }
          }
        }
      }).then(response => response.data.data as IScene[]),
    retry: 0
  })

  // ** States
  const [sceneListOpen, setSceneListOpen] = useState(false)

  // ** Logics
  const handleSceneListOpen = () => {
    refetch()
    setSceneListOpen(true)
  }
  const handleSceneListClose = () => setSceneListOpen(false)
  const handleRedirectToSceneEdit = (sid: number) => {
    window.location.href = `/verse/edit/${sid}`
  }

  // ** Side Effect
  if (worldInstance) {
    if (sceneListOpen) {
      worldInstance.setDialogMode(true)
    } else {
      worldInstance.setDialogMode(false)
    }
  }

  return (
    <Fragment>
      <Box
        onClick={handleSceneListOpen}
        sx={{
          p: 4,
          height: '100%',
          display: 'flex',
          borderRadius: 1,
          cursor: 'pointer',
          position: 'relative',
          alignItems: 'center',
          flexDirection: 'column',
          border: theme => `1px solid ${theme.palette.divider}`,
          '&:hover': { borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.25)` }
        }}
      >
        <Icon icon='ic:baseline-view-list' fontSize={24} />
      </Box>

      <Dialog fullWidth maxWidth='sm' onClose={handleSceneListClose} open={sceneListOpen}>
        <DialogContent sx={{ backgroundColor: theme => theme.palette.action.hover }}>
          <IconButton
            size='small'
            onClick={handleSceneListClose}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close-circle' fontSize={20} />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3 }}>
              My Scene List
            </Typography>
          </Box>

          <Grid container spacing={4} sx={{ flexGrow: 1 }}>
            {isQueryLoading &&
              [...Array(3).keys()].map(sIndex => (
                <Grid key={`own-scene-skeleton-${sIndex}`} item xs={12}>
                  <Skeleton variant='rounded' height={80} />
                </Grid>
              ))}
            {ownSceneList.map((scene, index) => (
              <Grid key={`own-scene-${index}`} item xs={12} onClick={() => handleRedirectToSceneEdit(scene.id)}>
                <SceneCard sceneBase={scene} withControl />
              </Grid>
            ))}
            {ownSceneList.length < 3 && (
              <Grid item xs={12}>
                <CreateSceneCard />
              </Grid>
            )}
          </Grid>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

export default SceneListMenu

// ** React Imports
import { useState, Fragment } from 'react'

// ** Redux Imports
import { useSelector } from 'react-redux'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'

// ** Utils Imports
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Config
import apiConfig from 'src/configs/api'

// ** Types
import { RootState } from 'src/store'
import { IScene } from 'src/types/scene/sceneTypes'

const CollaboratorsGroup = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()
  const { sid } = router.query
  const worldInstance = useSelector(({ verse }: RootState) => verse.edit.scene.worldInstance)
  const {
    // isLoading: isQueryLoading,
    data: sceneBase
  } = useQuery({
    queryKey: [
      'scene',
      sid,
      {
        collaborators: true
      }
    ],
    queryFn: () =>
      axios({
        method: 'GET',
        url: `/api/scenes/${sid}`,
        params: {
          populate: {
            collaborators: true
          }
        }
      }).then(response => response.data.data as IScene),
    enabled: !!sid,
    retry: 0
  })

  // ** States
  const [collaboratorsGroupDialogOpen, setCollaboratorsGroupDialogOpen] = useState(false)

  // ** Logics
  const handleCollaboratorsGroupDialogOpen = () => setCollaboratorsGroupDialogOpen(true)
  const handleCollaboratorsGroupDialogClose = () => setCollaboratorsGroupDialogOpen(false)

  // ** Side Effect
  if (worldInstance) {
    if (collaboratorsGroupDialogOpen) {
      worldInstance.setDialogMode(true)
    } else {
      worldInstance.setDialogMode(false)
    }
  }

  return (
    <Fragment>
      <Tooltip title='Collaborators' placement='top' arrow>
        <AvatarGroup className='pull-up' max={4} onClick={handleCollaboratorsGroupDialogOpen}>
          <Avatar
            src={
              auth.user.avatar ? `${apiConfig.publicFolderUrl}${auth.user.avatar as string}` : '/images/avatars/1.png'
            }
            alt={auth.user.username}
          />
          {sceneBase?.attributes?.collaborators?.data &&
            sceneBase.attributes.collaborators.data.map(collaborator => (
              <Avatar
                key={`scene-collaborator-${collaborator.id}`}
                src={
                  collaborator.attributes?.avatar?.data?.attributes?.url
                    ? `${apiConfig.publicFolderUrl}${collaborator.attributes.avatar.data.attributes.url as string}`
                    : collaborator.attributes.username
                }
                alt={collaborator.attributes.username}
              />
            ))}
          <Avatar alt='Add collaborators' sx={{ background: 'transparent' }}>
            <Icon icon='uiw:user-add' />
          </Avatar>
        </AvatarGroup>
      </Tooltip>

      <Dialog fullWidth maxWidth='sm' onClose={handleCollaboratorsGroupDialogClose} open={collaboratorsGroupDialogOpen}>
        <DialogContent sx={{ backgroundColor: theme => theme.palette.action.hover }}>
          <IconButton
            size='small'
            onClick={handleCollaboratorsGroupDialogClose}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close-circle' fontSize={20} />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3 }}>
              Collaborators
            </Typography>
          </Box>
          <Box sx={{ mb: 8 }}>
            {/* TODO */}
            <Typography variant='h5' sx={{ mb: 3 }}>
              TODO List here
            </Typography>
          </Box>
          <Box sx={{ mb: 8 }}>
            <Typography variant='h6' sx={{ mb: 4, lineHeight: '2rem' }}>
              Invite link
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
              <TextField
                fullWidth
                size='small'
                id='refer-email'
                sx={{ mr: { xs: 0, sm: 4 } }}
                value='something something something something something'
              />
              <Button variant='contained' sx={{ mt: { xs: 2, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}>
                Copy
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

export default CollaboratorsGroup

// ** React Imports
import { useState, Fragment, ReactElement } from 'react'

// ** Redux Imports
import { useSelector } from 'react-redux'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Services Imports
import { useSceneQuery } from 'src/services/queries/scene.query'

// ** Utils Imports
import { getInitials } from 'src/@core/utils/get-initials'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Config
import apiConfig from 'src/configs/api'

// ** Types
import { RootState } from 'src/store'

interface TableBodyRowType {
  id: number
  name: string
  email: string
  username: string
  avatarSrc?: string
  status: 'active' | 'pending' | 'inactive'
  role: 'admin' | 'editor' | 'author' | 'maintainer' | 'subscriber'
}

interface CellType {
  row: TableBodyRowType
}

interface RoleObj {
  [key: string]: {
    icon: ReactElement
  }
}

const roleObj: RoleObj = {
  admin: {
    icon: (
      <Box component='span' sx={{ display: 'flex', mr: 2, color: 'error.main' }}>
        <Icon icon='mdi:laptop' />
      </Box>
    )
  },
  author: {
    icon: (
      <Box component='span' sx={{ display: 'flex', mr: 2, color: 'warning.main' }}>
        <Icon icon='mdi:cog' />
      </Box>
    )
  },
  maintainer: {
    icon: (
      <Box component='span' sx={{ display: 'flex', mr: 2, color: 'success.main' }}>
        <Icon icon='mdi:chart-donut' />
      </Box>
    )
  },
  editor: {
    icon: (
      <Box component='span' sx={{ display: 'flex', mr: 2, color: 'info.main' }}>
        <Icon icon='mdi:pencil-outline' />
      </Box>
    )
  },
  subscriber: {
    icon: (
      <Box component='span' sx={{ display: 'flex', mr: 2, color: 'primary.main' }}>
        <Icon icon='mdi:account-outline' />
      </Box>
    )
  }
}

const rows: TableBodyRowType[] = [
  {
    id: 1,
    role: 'admin',
    status: 'pending',
    name: 'Jordan Stevenson',
    username: '@jstevenson5c',
    email: 'susanna.Lind57@gmail.com',
    avatarSrc: '/images/avatars/1.png'
  },
  {
    id: 2,
    role: 'editor',
    status: 'active',
    name: 'Robert Crawford',
    username: '@rcrawford1d',
    avatarSrc: '/images/avatars/3.png',
    email: 'estelle.Bailey10@gmail.com'
  },
  {
    id: 3,
    role: 'author',
    status: 'inactive',
    name: 'Lydia Reese',
    username: '@lreese3b',
    email: 'milo86@hotmail.com',
    avatarSrc: '/images/avatars/2.png'
  },
  {
    id: 4,
    role: 'editor',
    status: 'pending',
    name: 'Richard Sims',
    username: '@rsims6f',
    email: 'lonnie35@hotmail.com',
    avatarSrc: '/images/avatars/5.png'
  },
  {
    id: 5,
    status: 'active',
    role: 'maintainer',
    name: 'Lucile Young',
    username: '@lyoung4a',
    email: 'ahmad_Collins@yahoo.com',
    avatarSrc: '/images/avatars/4.png'
  }
]

const renderUserAvatar = (row: TableBodyRowType) => {
  if (row.avatarSrc) {
    return <CustomAvatar src={row.avatarSrc} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar skin='light' sx={{ mr: 3, width: 34, height: 34, fontSize: '.8rem' }}>
        {getInitials(row.name ? row.name : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const columns: GridColDef[] = [
  {
    flex: 0.7,
    field: 'collaborator',
    minWidth: 200,
    headerName: 'Collaborator',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderUserAvatar(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
              {row.name}
            </Typography>
            <Typography variant='caption' sx={{ lineHeight: 1.6667 }}>
              {row.username}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.3,
    minWidth: 50,
    field: 'status',
    headerName: 'Action',
    renderCell: ({ row }: CellType) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {roleObj[row.role].icon}
        <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{row.role}</Typography>
      </Box>
    )
  }
]

const CollaboratorsGroup = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()
  const { sid } = router.query
  const worldInstance = useSelector(({ verse }: RootState) => verse.edit.scene.worldInstance)
  const {
    // isLoading: isQueryLoading,
    data: queryData
  } = useSceneQuery({ sid: sid as string })
  const sceneBase = queryData?.data

  // ** States
  const [collaboratorsGroupDialogOpen, setCollaboratorsGroupDialogOpen] = useState(false)

  // ** Logics
  const handleCollaboratorsGroupDialogOpen = () => {
    setCollaboratorsGroupDialogOpen(true)
    if (worldInstance) {
      worldInstance.setDialogMode(true)
    }
  }
  const handleCollaboratorsGroupDialogClose = () => {
    setCollaboratorsGroupDialogOpen(false)
    if (worldInstance) {
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
            <Card>
              <DataGrid
                autoHeight
                hideFooter
                rows={rows}
                columns={columns}
                disableSelectionOnClick
                pagination={undefined}
              />
            </Card>
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
                inputProps={{ readOnly: true }}
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

// ** React Imports
import { MouseEvent, useState } from 'react'

// ** MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Config
import apiConfig from 'src/configs/api'

// ** Types
import { IScene } from 'src/types/sceneTypes'

const ITEM_HEIGHT = 48

interface Props {
  sceneBase?: IScene
  isCurrentScene?: boolean
  withControl?: boolean
}

const SceneCard = (props: Props) => {
  // ** Props
  const { sceneBase, isCurrentScene = false, withControl = false } = props

  // ** Hooks
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // ** Logics
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box
      sx={{
        px: 4,
        py: 2,
        width: '100%',
        height: '100%',
        display: 'flex',
        borderRadius: 1,
        cursor: 'pointer',
        alignItems: 'center',
        border: theme => `1px solid ${theme.palette.divider}`,
        '&:hover': { borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.25)` }
      }}
    >
      <Box>
        {sceneBase?.attributes?.cover?.data?.attributes?.url ? (
          <Avatar
            src={`${apiConfig.publicFolderUrl}${sceneBase.attributes.cover.data.attributes.url}`}
            alt={sceneBase?.attributes.owner?.data?.attributes?.username}
            sx={{
              width: isDesktop ? '5.8rem' : '4.5rem',
              height: isDesktop ? '3.6rem' : '2.4rem',
              borderRadius: '.2rem',
              boxShadow: theme => theme.shadows[9]
            }}
          />
        ) : (
          <Box
            sx={{
              width: isDesktop ? '5.8rem' : '4.5rem',
              height: isDesktop ? '3.6rem' : '2.4rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '.2rem',
              border: theme => `1px dashed ${theme.palette.divider}`
            }}
          >
            <Icon icon='material-symbols:add' fontSize={24} />
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', maxWidth: '8rem', ml: 4, mr: 2, flexDirection: 'column' }}>
        <Typography sx={{ fontWeight: 600 }} noWrap>
          {sceneBase?.attributes.displayName || 'Untitled'}
        </Typography>
        <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }} noWrap>
          {sceneBase?.attributes.description || 'description...'}
        </Typography>
      </Box>

      {withControl && (
        <Box
          sx={{
            display: 'flex',
            ml: 4,
            flexGrow: 1,
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}
        >
          {isCurrentScene && (
            <Box sx={{ mr: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Icon icon='material-symbols:check-circle-rounded' fontSize={24} />
            </Box>
          )}
          <IconButton aria-label='more' aria-controls='long-menu' aria-haspopup='true' onClick={handleClick}>
            <Icon icon='mdi:dots-vertical' fontSize={24} />
          </IconButton>
          <Menu
            keepMounted
            id='long-menu'
            anchorEl={anchorEl}
            onClose={handleClose}
            open={Boolean(anchorEl)}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5
              }
            }}
          >
            <MenuItem disabled onClick={handleClose}>
              Delete scene
            </MenuItem>
          </Menu>
        </Box>
      )}
    </Box>
  )
}

export default SceneCard

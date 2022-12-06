// ** React Imports
import { ChangeEvent } from 'react'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Radio from '@mui/material/Radio'
import Chip from '@mui/material/Chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Config
import apiConfig from 'src/configs/api'

export interface IScene {
  id: string
  creator: {
    data: {
      attributes: {
        username: string
      }
    }
  }
  tagIcon?: string
  tagTitle?: string
  banner?: {
    data: {
      attributes: {
        url: string
      }
    }
  }
  displayName: string
  description?: string
  frames: number
}
interface Props extends IScene {
  selected: string
  handleChange: (prop: string | ChangeEvent<HTMLInputElement>) => void
  radioName: string
}

// ** Styled Box Components
const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  transition: theme.transitions.create(['background']),
  background:
    'linear-gradient(to top, rgba(0, 0, 0, 0.89), rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1), transparent)'
}))

const SceneCard = (props: Props) => {
  // ** Props
  const {
    selected,
    handleChange,
    radioName,
    id,
    creator,
    tagIcon = 'gg:radio-check',
    tagTitle = 'Free',
    banner,
    displayName,
    frames
  } = props

  return (
    <Grid item sm={4} xs={12}>
      <Box
        onClick={() => handleChange(id)}
        sx={{
          height: '100%',
          display: 'flex',
          borderRadius: 1,
          cursor: 'pointer',
          overflow: 'hidden',
          position: 'relative',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          border: theme => `2px solid ${theme.palette.divider}`,
          ...(selected === id
            ? { borderColor: 'primary.main' }
            : { '&:hover': { borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.25)` } }),
          '& img': {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }
        }}
      >
        <img
          src={
            banner?.data.attributes.url
              ? `${apiConfig.publicFolderUrl}${banner?.data.attributes.url}`
              : '/images/avatars/1.png'
          }
          alt={`scene-models-${displayName}`}
        />
        <StyledBox>
          <Box sx={{ position: 'absolute', top: 0, right: 0, px: 4, pt: 3 }}>
            <Chip
              label={tagTitle}
              icon={<Icon icon={tagIcon} fontSize={12} style={{ marginLeft: '0.6rem' }} />}
              sx={{ background: '#070707' }}
            />
          </Box>
          <Grid container sx={{ position: 'absolute', bottom: 0, px: 4, pb: 3 }}>
            <Grid item xs={6}>
              <Typography variant='h5' sx={{ fontWeight: 600 }}>
                {displayName}
              </Typography>
              <Typography variant='body2'>{`By ${creator.data.attributes.username}`}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='h5' textAlign='right'>
                {frames}
              </Typography>
              <Typography variant='body2' textAlign='right'>
                Frames
              </Typography>
            </Grid>
          </Grid>
        </StyledBox>
        <Radio
          name={radioName}
          size='small'
          value={id}
          onChange={handleChange}
          checked={selected === id}
          sx={{ zIndex: -1, position: 'absolute', visibility: 'hidden' }}
        />
      </Box>
    </Grid>
  )
}

export default SceneCard

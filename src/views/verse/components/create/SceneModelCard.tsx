// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

interface Props {
  id: number
  coverURL: string
  displayName?: string
  tagIcon?: string
  tagTitle?: string
  frameCount: number
  published: boolean
  creatorName?: string
  selectedSceneModelId: number
  handleChange: (prop: number) => void
}

const SceneModelCard = (props: Props) => {
  // ** Props
  const {
    id,
    coverURL,
    displayName = 'Untitled',
    tagIcon,
    tagTitle,
    frameCount,
    published,
    creatorName = 'Media.app',
    selectedSceneModelId,
    handleChange
  } = props

  return (
    <Box
      onClick={() => handleChange(id)}
      sx={{
        height: '20rem',
        display: 'flex',
        borderRadius: 1,
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        border: theme => `2px solid ${theme.palette.divider}`,
        ...(selectedSceneModelId === id
          ? { borderColor: `primary.main` }
          : { '&:hover': { borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.25)` } }),
        '& img': {
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }
      }}
    >
      <img width={200} height={80} src={coverURL} alt={`scene-model-${id}`} />
      <Box sx={{ position: 'absolute', top: 0, p: 2, width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        {tagTitle && (
          <Box
            sx={{
              px: 2,
              py: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme => theme.palette.background.paper,
              borderRadius: theme => theme.shape.borderRadius
            }}
          >
            <Box
              sx={{
                width: '8px',
                height: '8px',
                mr: 2,
                backgroundColor: theme => theme.palette.success.main,
                borderRadius: '50%'
              }}
            />
            <Typography variant='subtitle2'>{tagTitle}</Typography>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          p: 2,
          width: '100%',
          height: '80%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          background: `linear-gradient(to top, rgba(0, 0, 0, 0.89), rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1), transparent)`
        }}
      >
        <Box sx={{ px: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant='h6'>{displayName}</Typography>
          <Typography variant='body2'>{`Create by ${creatorName}`}</Typography>
        </Box>

        <Box sx={{ px: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <Typography variant='h6'>{frameCount}</Typography>
          <Typography variant='body2'>Frames</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default SceneModelCard

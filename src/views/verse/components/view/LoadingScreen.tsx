// ** React Imports
import { useSelector } from 'react-redux'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress, { LinearProgressProps, linearProgressClasses } from '@mui/material/LinearProgress'

// ** Types
import { RootState } from 'src/store'

// ** Styled RootBox Components
const RootBox = styled(Box)<BoxProps>(({ theme }) => ({
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  textAlign: 'center',
  height: '100%',
  width: '100%',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'
}))

const BackgroundStarWarp = styled(Box)<BoxProps>(({ theme }) => ({
  top: '50%',
  left: '50%',
  height: '1px',
  width: '1px',
  borderRadius: '50%',
  boxShadow:
    theme.palette.mode === 'dark'
      ? `6vw 43vh 0px 3px #fee, 23vw 20vh 2px 0px #fee, -11vw 31vh 1px 0px #fee, 15vw 17vh 2px 0px #fee,
    -14vw -16vh 1px 1px #fee, -34vw -33vh 2px 3px #fee, -3vw 49vh 3px 1px #fee, 47vw -32vh 2px 1px #fee,
    -9vw 16vh 3px 2px #fee, -16vw 0vh 0px 0px #fee, -25vw -49vh 0px 1px #fee, 2vw -39vh 2px 1px #fee,
    14vw 44vh 1px 3px #fee, -48vw -22vh 1px 0px #fee, 14vw -10vh 2px 1px #fee, -32vw 45vh 1px 2px #fee,
    27vw 10vh 3px 3px #fee, 38vw 36vh 2px 1px #fee, 33vw -20vh 0px 1px #fee, 37vw -4vh 1px 0px #fee,
    46vw 48vh 0px 1px #fee, -50vw 26vh 0px 2px #fee, -40vw -5vh 1px 2px #fee, 41vw -12vh 0px 0px #fee,
    -5vw -47vh 1px 3px #fee, -17vw -10vh 1px 3px #fee, 3vw 4vh 0px 0px #fee, -1vw -45vh 0px 2px #fee,
    -37vw -30vh 1px 2px #fee, 3vw -20vh 0px 1px #fee, 21vw -21vh 3px 1px #fee, 6vw -33vh 3px 0px #fee,
    19vw 19vh 2px 1px #fee, -19vw -41vh 0px 1px #fee, -4vw 24vh 2px 0px #fee, -14vw -25vh 1px 3px #fee,
    -45vw -3vh 3px 2px #fee, 42vw -2vh 0px 0px #fee, -43vw 48vh 0px 2px #fee, -22vw -36vh 3px 0px #fee,
    -44vw 27vh 3px 1px #fee, 8vw -34vh 2px 3px #fee, 13vw 15vh 2px 3px #fee, 7vw -30vh 0px 3px #fee,
    6vw -10vh 3px 1px #fee, -10vw 42vh 1px 2px #fee, -26vw 28vh 1px 2px #fee, -23vw 22vh 3px 2px #fee,
    -29vw 25vh 3px 2px #fee, -25vw 23vh 2px 2px #fee, 41vw -1vh 3px 2px #fee, -15vw 26vh 3px 1px #fee,
    -14vw 32vh 1px 1px #fee, 11vw -27vh 0px 2px #fee, -20vw -38vh 1px 1px #fee, -14vw -2vh 0px 1px #fee,
    37vw 23vh 3px 2px #fee, 25vw 9vh 1px 2px #fee, -12vw 11vh 0px 0px #fee, -27vw -27vh 3px 0px #fee,
    35vw 30vh 0px 2px #fee, -32vw 50vh 3px 2px #fee, -25vw 24vh 0px 0px #fee, -47vw -14vh 0px 0px #fee,
    -38vw 50vh 1px 0px #fee, 44vw -16vh 3px 3px #fee, 37vw -16vh 1px 0px #fee, 30vw -10vh 1px 1px #fee,
    29vw -15vh 0px 1px #fee, -32vw 41vh 0px 2px #fee, -4vw 43vh 0px 2px #fee, -41vw 10vh 2px 3px #fee,
    -22vw -8vh 1px 1px #fee, -32vw 8vh 2px 1px #fee, 38vw 0vh 0px 0px #fee, 46vw -26vh 1px 0px #fee,
    -15vw -16vh 1px 2px #fee, -50vw 50vh 2px 1px #fee, 4vw 13vh 2px 2px #fee, 30vw -3vh 1px 0px #fee,
    2vw 31vh 0px 1px #fee, -1vw -16vh 1px 2px #fee, -16vw 34vh 1px 2px #fee, -14vw -14vh 3px 3px #fee,
    17vw -13vh 3px 3px #fee, -8vw 31vh 0px 3px #fee, -4vw -47vh 1px 1px #fee, 38vw 50vh 1px 3px #fee,
    42vw 4vh 2px 2px #fee, 37vw -4vh 0px 1px #fee, 42vw 9vh 0px 2px #fee, 45vw 10vh 1px 1px #fee, 11vw 7vh 1px 1px #fee,
    0vw -6vh 1px 2px #fee, 31vw -24vh 2px 3px #fee, 28vw 0vh 3px 2px #fee, -13vw -22vh 3px 3px #fee,
    -16vw -38vh 1px 2px #fee, -27vw 22vh 3px 1px #fee, -39vw -40vh 0px 2px #fee`
      : `6vw 43vh 0px 3px #666, 23vw 20vh 2px 0px #666, -11vw 31vh 1px 0px #666, 15vw 17vh 2px 0px #666,
    -14vw -16vh 1px 1px #666, -34vw -33vh 2px 3px #666, -3vw 49vh 3px 1px #666, 47vw -32vh 2px 1px #666,
    -9vw 16vh 3px 2px #666, -16vw 0vh 0px 0px #666, -25vw -49vh 0px 1px #666, 2vw -39vh 2px 1px #666,
    14vw 44vh 1px 3px #666, -48vw -22vh 1px 0px #666, 14vw -10vh 2px 1px #666, -32vw 45vh 1px 2px #666,
    27vw 10vh 3px 3px #666, 38vw 36vh 2px 1px #666, 33vw -20vh 0px 1px #666, 37vw -4vh 1px 0px #666,
    46vw 48vh 0px 1px #666, -50vw 26vh 0px 2px #666, -40vw -5vh 1px 2px #666, 41vw -12vh 0px 0px #666,
    -5vw -47vh 1px 3px #666, -17vw -10vh 1px 3px #666, 3vw 4vh 0px 0px #666, -1vw -45vh 0px 2px #666,
    -37vw -30vh 1px 2px #666, 3vw -20vh 0px 1px #666, 21vw -21vh 3px 1px #666, 6vw -33vh 3px 0px #666,
    19vw 19vh 2px 1px #666, -19vw -41vh 0px 1px #666, -4vw 24vh 2px 0px #666, -14vw -25vh 1px 3px #666,
    -45vw -3vh 3px 2px #666, 42vw -2vh 0px 0px #666, -43vw 48vh 0px 2px #666, -22vw -36vh 3px 0px #666,
    -44vw 27vh 3px 1px #666, 8vw -34vh 2px 3px #666, 13vw 15vh 2px 3px #666, 7vw -30vh 0px 3px #666,
    6vw -10vh 3px 1px #666, -10vw 42vh 1px 2px #666, -26vw 28vh 1px 2px #666, -23vw 22vh 3px 2px #666,
    -29vw 25vh 3px 2px #666, -25vw 23vh 2px 2px #666, 41vw -1vh 3px 2px #666, -15vw 26vh 3px 1px #666,
    -14vw 32vh 1px 1px #666, 11vw -27vh 0px 2px #666, -20vw -38vh 1px 1px #666, -14vw -2vh 0px 1px #666,
    37vw 23vh 3px 2px #666, 25vw 9vh 1px 2px #666, -12vw 11vh 0px 0px #666, -27vw -27vh 3px 0px #666,
    35vw 30vh 0px 2px #666, -32vw 50vh 3px 2px #666, -25vw 24vh 0px 0px #666, -47vw -14vh 0px 0px #666,
    -38vw 50vh 1px 0px #666, 44vw -16vh 3px 3px #666, 37vw -16vh 1px 0px #666, 30vw -10vh 1px 1px #666,
    29vw -15vh 0px 1px #666, -32vw 41vh 0px 2px #666, -4vw 43vh 0px 2px #666, -41vw 10vh 2px 3px #666,
    -22vw -8vh 1px 1px #666, -32vw 8vh 2px 1px #666, 38vw 0vh 0px 0px #666, 46vw -26vh 1px 0px #666,
    -15vw -16vh 1px 2px #666, -50vw 50vh 2px 1px #666, 4vw 13vh 2px 2px #666, 30vw -3vh 1px 0px #666,
    2vw 31vh 0px 1px #666, -1vw -16vh 1px 2px #666, -16vw 34vh 1px 2px #666, -14vw -14vh 3px 3px #666,
    17vw -13vh 3px 3px #666, -8vw 31vh 0px 3px #666, -4vw -47vh 1px 1px #666, 38vw 50vh 1px 3px #666,
    42vw 4vh 2px 2px #666, 37vw -4vh 0px 1px #666, 42vw 9vh 0px 2px #666, 45vw 10vh 1px 1px #666, 11vw 7vh 1px 1px #666,
    0vw -6vh 1px 2px #666, 31vw -24vh 2px 3px #666, 28vw 0vh 3px 2px #666, -13vw -22vh 3px 3px #666,
    -16vw -38vh 1px 2px #666, -27vw 22vh 3px 1px #666, -39vw -40vh 0px 2px #666`,
  animation: 'zoom 10s alternate infinite',

  '@keyframes zoom': {
    '0%': {
      transform: 'scale(1)'
    },
    '100%': {
      transform: 'scale(1.5)'
    }
  }
}))

const BorderLinearProgress = styled(LinearProgress)<LinearProgressProps>(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  boxShadow: theme.shadows[3],
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'dark' ? 800 : 200]
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5
  }
}))

const LoadingScreen = () => {
  const UI_LAYOUT = useSelector(({ verse }: RootState) => verse.view.uiLayout)
  const LOADING_SCREEN = useSelector(({ verse }: RootState) => verse.view.loadingScreen)

  return (
    <RootBox sx={{ display: UI_LAYOUT.loadingScreenShow ? 'flex' : 'none' }}>
      <BackgroundStarWarp />
      <Avatar
        src='/images/logos/media-app.png'
        alt='media.app'
        sx={{ width: 96, height: 96, mb: 4, boxShadow: theme => theme.shadows[9] }}
      />
      <Typography variant='h4' sx={{ fontWeight: 600, lineHeight: 1.05 }}>
        Media Verse
      </Typography>

      <Box sx={{ position: 'absolute', width: '80%', bottom: '5rem', mt: 8 }}>
        <Typography variant='h6' sx={{ mb: 2 }}>
          {LOADING_SCREEN.content}
        </Typography>
        <BorderLinearProgress variant='determinate' value={LOADING_SCREEN.percentage} />
      </Box>
    </RootBox>
  )
}

export default LoadingScreen

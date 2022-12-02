// ** React Imports
import { useState, Fragment } from 'react'
import { useSelector } from 'react-redux'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Utils Imports
import clsx from 'clsx'

// ** Types
import { RootState } from 'src/store'

// ** Styled CardContent component
const StyledContentBox = styled(Box)(({ theme }) => ({
  '& .ctrl-key': {
    fontWeight: 600,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    textAlign: 'center',
    background: '#eff0f2',
    boxShadow: 'inset 0 0 25px #e8e8e8, 0 1px 0 #c3c3c3, 0 2px 0 #c9c9c9, 0 2px 3px #000',
    color: '#111',
    borderRadius: '2px',
    fontSize: '12px'
  }
}))

const ControlHintBox = () => {
  // ** Hooks
  const CONTROL_HINT_PANEL = useSelector(({ verse }: RootState) => verse.view.controlHintPanel)

  // ** States
  const [chatControlHintPanelOpen, setControlHintPanelOpen] = useState(false)

  const handleControlHintPanelOpen = () => setControlHintPanelOpen(true)
  const handleControlHintPanelClose = () => setControlHintPanelOpen(false)

  return (
    <Fragment>
      <Tooltip title='Control Hint' placement='top' arrow>
        <IconButton color='secondary' onClick={handleControlHintPanelOpen}>
          <Icon icon='mdi:gamepad-variant' fontSize={20} />
        </IconButton>
      </Tooltip>

      <Dialog fullWidth maxWidth='xs' onClose={handleControlHintPanelClose} open={chatControlHintPanelOpen}>
        <DialogContent sx={{ backgroundColor: theme => theme.palette.action.hover }}>
          <IconButton
            size='small'
            onClick={handleControlHintPanelClose}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close-circle' fontSize={20} />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3 }}>
              Control
            </Typography>
          </Box>
          <StyledContentBox>
            {CONTROL_HINT_PANEL.content.map((row, rid) => (
              <Box
                key={`row-${rid}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  ...(rid !== CONTROL_HINT_PANEL.content.length - 1 ? { mb: 4 } : {})
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box sx={{ mr: 2, display: 'flex' }}>
                    {row.keys.map((key, kid) => (
                      <Typography
                        key={`keys-${kid}`}
                        variant='body1'
                        sx={{ fontWeight: 500, fontSize: '0.875rem' }}
                        className={clsx(!(key === '+' || key === 'and' || key === 'or' || key === '&') && 'ctrl-key')}
                      >
                        {key}
                      </Typography>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant='body2' sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                      {row.desc}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </StyledContentBox>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

export default ControlHintBox

// ** React Imports
import { useState, Fragment } from 'react'
import { useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { RootState } from 'src/store'

const ControlHintBox = () => {
  // ** Hooks
  const CONTROL_HINT_PANEL = useSelector(({ verse }: RootState) => verse.view.controlHintPanel)

  // ** States
  const [controlHintPanelOpen, setControlHintPanelOpen] = useState(false)

  const handleControlHintPanelOpen = () => setControlHintPanelOpen(true)
  const handleControlHintPanelClose = () => setControlHintPanelOpen(false)

  return (
    <Fragment>
      <Tooltip title='Control Hint' placement='top' arrow>
        <IconButton color='secondary' onClick={handleControlHintPanelOpen}>
          <Icon icon='mdi:gamepad-variant' fontSize={20} />
        </IconButton>
      </Tooltip>

      <Dialog fullWidth maxWidth='xs' onClose={handleControlHintPanelClose} open={controlHintPanelOpen}>
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
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                  {row.keys.map((key, kid) =>
                    key === '+' || key === 'and' || key === 'or' || key === '&' ? (
                      <Box key={`keys-${kid}`} sx={{ m: 1 }}>
                        <Typography variant='body1' sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                          {key}
                        </Typography>
                      </Box>
                    ) : (
                      <Card key={`keys-${kid}`} sx={{ m: 1 }}>
                        <CardContent sx={{ px: '.8rem !important', py: '.5rem !important' }}>
                          <Typography variant='body1' sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                            {key}
                          </Typography>
                        </CardContent>
                      </Card>
                    )
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant='body2' sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                    {row.desc}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

export default ControlHintBox

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

interface Props {
  sceneId: string
  displayName: string
  description?: string
  cover?: {
    id?: number
    data: any
  }
  worldScenePaths: string
  nftList: string
  published: boolean
  featured: boolean
  publishedAt: string
  createdAt: string
  updatedAt: string
}

const SceneCard = (props: Props) => {
  return (
    <Card sx={{ position: 'relative' }}>
      <CardMedia
        sx={{ height: 200 }}
        image={
          props?.cover?.data?.attributes?.url
            ? `http://localhost:1337${props.cover.data.attributes.url}`
            : '/images/cards/background-user.png'
        }
      />
      <Avatar
        alt='Robert Meyer'
        src='/images/avatars/3.png'
        sx={{
          top: 160,
          left: 20,
          width: 78,
          height: 78,
          position: 'absolute',
          border: theme => `5px solid ${theme.palette.background.paper}`
        }}
      />
      <CardContent>
        <Box
          sx={{
            mt: 5.75,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ mr: 2, mb: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h6'>{props.displayName}</Typography>
            <Typography variant='caption'>{props?.description ? props.description : 'nothing'}</Typography>
          </Box>
          <Button variant='contained'>Check</Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default SceneCard

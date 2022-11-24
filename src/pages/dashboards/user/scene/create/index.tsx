// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** React Query Imports
import { useQuery } from '@tanstack/react-query'

// ** Third Party Imports
import axios, { AxiosError } from 'axios'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import FreeSceneList from 'src/views/dashboards/user/scene/FreeSceneList'
import AdvancedSceneList from 'src/views/dashboards/user/scene/AdvancedSceneList'

// ** Type Import
import { IScene } from 'src/views/dashboards/user/scene/SceneCard'

const CreateScenePage = () => {
  // ** Hooks
  const {
    isLoading: isQueryLoading,
    isError: isQueryError,
    data: sceneModels,
    error: queryError
  } = useQuery({
    queryKey: ['scene-models'],
    queryFn: () =>
      axios({
        method: 'GET',

        // url: `http://localhost:1337/api/scene-models?${qs.stringify({
        //   populate: ['creator', 'banner']
        // })}`
        url: `http://localhost:1337/api/scene-models`,
        params: {
          populate: ['creator', 'banner']
        }
      }).then(
        response =>
          response.data.data.map((item: Record<string, any>) => ({
            id: item.id,
            ...item.attributes
          })) as IScene[]
      )
  })

  // const {
  //   mutate: createScene,
  //   isLoading: isCreateSceneLoading,
  //   isError: isCreateSceneError,
  //   data,
  //   error: createSceneError
  // } = useMutation({

  // ** State
  const [selected, setSelected] = useState<string>('')

  // ** Logics
  const handleSubmit = () => {
    // axios({
    //   method: 'POST',
    //   url: 'http://localhost:1337/api/scene',
    //   data: {
    //     selectedSceneModelId: selected
    //   }
    // })
    //   .then(response => {
    //     console.log('response, ', response)
    //   })
    //   .catch(error => {
    //     if (error.response) {
    //       console.log('error.response, ', error.response)
    //     }
    //   })
  }

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant='h5'>Choose a base</Typography>}
        subtitle={
          <Typography variant='body2'>
            Select the base world you'll use to show your NFTs. Some are designed by select architects and minted in
            limited editions as NFTs.
          </Typography>
        }
      />
      {isQueryError && (
        <Grid item xs={12} sx={{ mb: 5 }}>
          <Alert severity='warning'>{(queryError as AxiosError).message}</Alert>
        </Grid>
      )}

      <Grid item xs={12} sx={{ mb: 5 }}>
        <FreeSceneList
          isLoading={isQueryLoading}
          selected={selected}
          setSelected={setSelected}
          sceneModels={sceneModels!}
        />
      </Grid>

      <PageHeader title={<Typography variant='h5'>Free</Typography>} />
      <Grid item xs={12}>
        <AdvancedSceneList />
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            disabled={selected === ''}
            onClick={handleSubmit}
            variant='contained'
            color='primary'
            endIcon={<Icon icon='mdi:arrow-right' />}
          >
            Next
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}

CreateScenePage.acl = {
  action: 'read',
  subject: 'user-page'
}

export default CreateScenePage

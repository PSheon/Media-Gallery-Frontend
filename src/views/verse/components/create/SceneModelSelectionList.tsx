// ** React Imports
import { useState, SyntheticEvent } from 'react'

// ** Next Imports
import Image from 'next/image'
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import LoadingButton from '@mui/lab/LoadingButton'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import Skeleton from '@mui/material/Skeleton'

// ** React Query Imports
import { useQuery, useMutation } from '@tanstack/react-query'

// ** Utils Imports
import axios from 'axios'
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import SceneModelCard from 'src/views/verse/components/create/SceneModelCard'

// ** Config
import apiConfig from 'src/configs/api'

// ** Types Imports
import { ISceneModel } from 'src/types/scene/sceneModelTypes'

interface FormData {
  selectedSceneModelId: number
}

// ** Styled TabList component
const MuiBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(8),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
  }
}))

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  overflow: 'visible',
  '& .MuiTabs-flexContainer': {
    flexDirection: 'column'
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minHeight: 40,
    minWidth: 280,
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderRadius: theme.shape.borderRadius,
    '& svg': {
      marginBottom: 0,
      marginRight: theme.spacing(1)
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: '100%'
    }
  }
}))

const SceneModelSelectionList = () => {
  // ** Hooks
  const router = useRouter()
  const {
    isLoading: isQueryLoading,

    // isError: isQueryError,
    data: sceneModels

    // error: queryError
  } = useQuery({
    queryKey: ['scene-model-list'],
    queryFn: () =>
      axios({
        method: 'GET',
        url: '/api/scene-models',
        params: {
          populate: '*'
        }
      }).then(response => response.data.data as ISceneModel[]),
    retry: 0
  })
  const { mutate: createScene, isLoading: isCreateSceneLoading } = useMutation({
    mutationFn: (newData: FormData) => axios.post(`/api/scene`, newData),
    onSuccess: response => {
      const newSceneId = response.data.createdSceneId
      router.replace(`/verse/edit/${newSceneId}`)
    },
    onError: () => {
      toast.error('Create scene failed.')
    },
    retry: 0
  })

  // ** States
  const [activeTab, setActiveTab] = useState<string>('free')
  const [selectedSceneModelId, setSelectedSceneModelId] = useState<number>(0)

  // ** Logics
  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
  }
  const handleSceneModelChange = (newSelectedSceneModelId: number) => {
    setSelectedSceneModelId(newSelectedSceneModelId)
  }
  const handleCreateScene = () => {
    createScene({ selectedSceneModelId })
  }

  return (
    <MuiBox>
      <TabContext value={activeTab}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <TabList onChange={handleTabChange}>
            <Tab
              value={'free'}
              label={'Free'}
              icon={<Icon icon={'material-symbols:star-rounded'} fontSize={20} />}
              sx={{ my: 2 }}
            />
            <Tab
              disabled
              value={'coming'}
              label={'Coming soon'}
              icon={<Icon icon={'tabler:comet'} fontSize={20} />}
              sx={{ my: 2 }}
            />
          </TabList>
          <Box
            sx={{
              mt: 12,
              display: 'flex',
              justifyContent: 'center',
              '& img': { maxWidth: '100%', display: { xs: 'none', md: 'block' } }
            }}
          >
            <Image width={135} height={195} alt='illustration' src='/images/pages/faq-illustration.png' />
          </Box>
        </Box>

        <TabPanel value='free' sx={{ p: 6, pt: 0, width: '100%' }}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CustomAvatar skin='light' variant='rounded' sx={{ height: 42, width: 42 }}>
                  <Icon icon='material-symbols:star-rounded' fontSize={28} />
                </CustomAvatar>
                <Box sx={{ ml: 4 }}>
                  <Typography variant='h5'>Free</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>All Free</Typography>
                </Box>
              </Box>

              <LoadingButton
                onClick={handleCreateScene}
                disabled={selectedSceneModelId === 0}
                loading={isCreateSceneLoading}
                variant='contained'
                endIcon={<Icon icon='material-symbols:arrow-outward-rounded' />}
              >
                Create
              </LoadingButton>
            </Box>

            <Grid container spacing={4} sx={{ mt: 4 }}>
              {isQueryLoading &&
                [...Array(6).keys()].map(sIndex => (
                  <Grid key={`scene-models-skeleton-${sIndex}`} item xs={12} sm={6}>
                    <Skeleton variant='rounded' height={240} />
                  </Grid>
                ))}

              {sceneModels?.map(sceneModel => {
                return (
                  <Grid item key={`scene-model-${sceneModel.id}`} xs={12} sm={6}>
                    <SceneModelCard
                      id={sceneModel.id}
                      coverURL={
                        sceneModel.attributes.cover?.data?.attributes.url
                          ? `${apiConfig.publicFolderUrl}${sceneModel.attributes.cover.data.attributes.url}`
                          : '/images/avatars/5.png'
                      }
                      displayName={sceneModel.attributes?.displayName}
                      tagIcon={sceneModel.attributes?.tagIcon}
                      tagTitle={sceneModel.attributes?.tagTitle}
                      frameCount={sceneModel.attributes.frameCount}
                      published={sceneModel.attributes.published}
                      creatorName={sceneModel.attributes.creator?.data?.attributes.username}
                      selectedSceneModelId={selectedSceneModelId}
                      handleChange={handleSceneModelChange}
                    />
                  </Grid>
                )
              })}
            </Grid>
          </Box>
        </TabPanel>
      </TabContext>
    </MuiBox>
  )
}

export default SceneModelSelectionList

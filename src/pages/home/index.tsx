// ** Next Imports
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import MuiCardContent, { CardContentProps } from '@mui/material/CardContent'

// ** Third Party Imports
import axios from 'axios'

// ** Types
import { PricingDataType } from 'src/@core/components/plan-details/types'

// ** Component Imports
import NftTable from 'src/views/home/NftTable'
import FaqFooter from 'src/views/home/FaqFooter'

// ** Styled Components
const CardContent = styled(MuiCardContent)<CardContentProps>(({ theme }) => ({
  padding: `${theme.spacing(20, 36)} !important`,
  [theme.breakpoints.down('xl')]: {
    padding: `${theme.spacing(20)} !important`
  },
  [theme.breakpoints.down('sm')]: {
    padding: `${theme.spacing(10, 5)} !important`
  }
}))

const HomePage = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Card>
      <CardContent>
        <NftTable data={apiData} />
      </CardContent>
      <CardContent sx={{ backgroundColor: 'action.hover' }}>
        <FaqFooter data={apiData} />
      </CardContent>
    </Card>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get('/pages/pricing')
  const apiData: PricingDataType = res.data

  return {
    props: {
      apiData
    }
  }
}

HomePage.acl = {
  action: 'read',
  subject: 'guest-page'
}

export default HomePage

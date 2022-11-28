// ** Next Imports
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import MuiCardContent, { CardContentProps } from '@mui/material/CardContent'

// ** Third Party Imports
// import axios from 'axios'

// ** Types
import { PricingDataType } from 'src/@core/components/plan-details/types'

// ** Component Imports
// import NftTable from 'src/views/home/NftTable'
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
      {/* <CardContent>
        <NftTable data={apiData} />
      </CardContent> */}
      <CardContent sx={{ backgroundColor: 'action.hover' }}>
        <FaqFooter data={apiData} />
      </CardContent>
    </Card>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // const res = await axios.get('/pages/pricing')
  // const apiData: PricingDataType = res.data
  const apiData: PricingDataType = {
    pricingPlans: [],
    faq: [
      {
        id: 'faq-001',
        question: '此階段主島數量分配為何',
        answer: 'S土地總量1350個，M土地數量620個，L土地數量30個，因此此階段共釋出2000個土地，佔1/3土地總數'
      },
      {
        id: 'faq-002',
        question: '如何獲得主島S土地Free mint資格',
        answer:
          '只要擁有首都藝廊展館與進階展館即可獲得主島S土地Free mint資格，尚未擁有的朋友可至https://lab.media.app 立即獲取哦，只需0.051E，展館與土地通通帶回家'
      },
      {
        id: 'faq-003',
        question: '如何獲得主島 M 土地',
        answer: '持有3個S土地並持有時間達兩週以上即可免費(需支付Gas Fee)合成 M 土地'
      },
      {
        id: 'faq-004',
        question: '如何獲得主島 L 土地',
        answer: '持有3個S土地、3個M土地與T2E Token並且總持有時間達三週以上即可免費(需支付Gas Fee)合成 L 土地'
      },
      {
        id: 'faq-005',
        question: '燒毀機制如何',
        answer:
          'M土地將於12/15開始開放合成，並且於12/17開始進行每日燒毀，我們將每天燒毀15個未被合成的M土地，直至此階段450個M土地燒光為止'
      }
    ],
    pricingTable: {
      header: [],
      rows: []
    }
  }

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

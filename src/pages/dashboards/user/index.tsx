// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Components Imports
import StatisticSection from 'src/views/dashboards/user/StatisticSection'
import CongratulationsSection from 'src/views/dashboards/user/CongratulationsSection'
import MintLargeCard from 'src/views/dashboards/user/mintCard/Large'
import MintMediumCard from 'src/views/dashboards/user/mintCard/Medium'
import MintStandardCard from 'src/views/dashboards/user/mintCard/Standard'
import ActivityTimelineSection from 'src/views/dashboards/user/ActivityTimelineSection'
import NetworkDetectDialog from 'src/views/dashboards/user/NetworkDetectDialog'

const UserDashboard = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12} md={4}>
          <CongratulationsSection />
        </Grid>
        <Grid item xs={12} md={8}>
          <StatisticSection />
        </Grid>
        <Grid item xs={12} md={3}>
          <MintLargeCard />
        </Grid>
        <Grid item xs={12} md={3}>
          <MintMediumCard />
        </Grid>
        <Grid item xs={12} md={3}>
          <MintStandardCard />
        </Grid>
        {/* <Grid item xs={12} md={7}>
          <ScenesOverviewWithTabsSection />
        </Grid> */}
        <Grid item xs={12} md={3}>
          <ActivityTimelineSection />
        </Grid>
      </Grid>

      <NetworkDetectDialog />
    </ApexChartWrapper>
  )
}

UserDashboard.acl = {
  action: 'read',
  subject: 'user-page'
}

export default UserDashboard

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Components Imports
import StatisticSection from 'src/views/dashboards/user/StatisticSection'
import ScenesOverviewWithTabsSection from 'src/views/dashboards/user/ScenesOverviewWithTabsSection'
import CongratulationsSection from 'src/views/dashboards/user/CongratulationsSection'
import ActivityTimelineSection from 'src/views/dashboards/user/ActivityTimelineSection'

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
        <Grid item xs={12} md={9}>
          <ScenesOverviewWithTabsSection />
        </Grid>
        <Grid item xs={12} md={3}>
          <ActivityTimelineSection />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

UserDashboard.acl = {
  action: 'read',
  subject: 'user-page'
}

export default UserDashboard

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Components Imports
import CrmAward from 'src/views/dashboards/staff/CrmAward'
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import CrmTotalProfit from 'src/views/dashboards/staff/CrmTotalProfit'
import CrmTotalGrowth from 'src/views/dashboards/staff/CrmTotalGrowth'
import CrmWeeklyOverview from 'src/views/dashboards/staff/CrmWeeklyOverview'
import CrmSocialNetworkVisits from 'src/views/dashboards/staff/CrmSocialNetworkVisits'
import CrmMonthlyBudget from 'src/views/dashboards/staff/CrmMonthlyBudget'
import CrmMeetingSchedule from 'src/views/dashboards/staff/CrmMeetingSchedule'
import CrmExternalLinks from 'src/views/dashboards/staff/CrmExternalLinks'
import CrmPaymentHistory from 'src/views/dashboards/staff/CrmPaymentHistory'
import CrmMostSalesInCountries from 'src/views/dashboards/staff/CrmMostSalesInCountries'
import CrmTable from 'src/views/dashboards/staff/CrmTable'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const StaffDashboard = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12} md={4}>
          <CrmAward />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <CardStatisticsVertical
            stats='155k'
            color='primary'
            trendNumber='+22%'
            title='Total Orders'
            chipText='Last 4 Month'
            icon={<Icon icon='mdi:cart-plus' />}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <CardStatisticsVertical
            stats='$13.4k'
            color='success'
            trendNumber='+38%'
            title='Total Sales'
            chipText='Last Six Month'
            icon={<Icon icon='mdi:currency-usd' />}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <CrmTotalProfit />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <CrmTotalGrowth />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CrmWeeklyOverview />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CrmSocialNetworkVisits />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CrmMonthlyBudget />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CrmMeetingSchedule />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CrmExternalLinks />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CrmPaymentHistory />
        </Grid>
        <Grid item xs={12} md={4}>
          <CrmMostSalesInCountries />
        </Grid>
        <Grid item xs={12} md={8}>
          <CrmTable />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

StaffDashboard.acl = {
  action: 'read',
  subject: 'staff-page'
}

export default StaffDashboard

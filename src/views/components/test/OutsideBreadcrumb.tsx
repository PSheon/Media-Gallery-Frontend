// ** React Imports
import { MouseEvent } from 'react'

// ** MUI Imports
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const OutsideBreadcrumb = () => {
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault()
    console.info('You clicked a breadcrumb.')
  }

  return (
    <>
      <Breadcrumbs aria-label='breadcrumb'>
        <Link color='inherit' href='/' onClick={handleClick}>
          MUI
        </Link>
        <Link color='inherit' href='/' onClick={handleClick}>
          Core
        </Link>
        <Typography color='textPrimary'>Breadcrumb</Typography>
      </Breadcrumbs>

      <Breadcrumbs separator='-' aria-label='breadcrumb'>
        <Link color='inherit' href='/' onClick={handleClick}>
          MUI
        </Link>
        <Link color='inherit' href='/' onClick={handleClick}>
          Core
        </Link>
        <Typography color='textPrimary'>Breadcrumb</Typography>
      </Breadcrumbs>

      <Breadcrumbs aria-label='breadcrumb' separator={<Icon icon='mdi:chevron-right' fontSize={20} />}>
        <Link color='inherit' href='/' onClick={handleClick}>
          MUI
        </Link>
        <Link color='inherit' href='/' onClick={handleClick}>
          Core
        </Link>
        <Typography color='textPrimary'>Breadcrumb</Typography>
      </Breadcrumbs>

      <Breadcrumbs aria-label='breadcrumb' sx={{ mt: 2 }}>
        <Link color='inherit' href='/' onClick={handleClick} sx={{ display: 'flex', alignItems: 'center' }}>
          <Icon icon='mdi:home-outline' fontSize={20} />
          MUI
        </Link>
        <Link color='inherit' href='/' onClick={handleClick} sx={{ display: 'flex', alignItems: 'center' }}>
          <Icon icon='mdi:bookmark-outline' fontSize={20} />
          Core
        </Link>
        <Typography color='textPrimary' sx={{ display: 'flex', alignItems: 'center' }}>
          <Icon icon='mdi:file-outline' fontSize={20} />
          Breadcrumb
        </Typography>
      </Breadcrumbs>
    </>
  )
}

export default OutsideBreadcrumb

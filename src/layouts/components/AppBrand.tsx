// ** Next Import
import Link from 'next/link'
import Image from 'next/Image'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Styled Components
const HeaderTitle = styled(Typography)<TypographyProps>({
  fontWeight: 700,
  lineHeight: 1.2,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out'
})
const StyledLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
})

const AppBrand = () => {
  return (
    <StyledLink href='/'>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Image width={30} height={30} src='/images/logos/media-app.png' alt='media logo' />
        <HeaderTitle variant='h6' sx={{ ml: 2 }}>
          {themeConfig.templateName}
        </HeaderTitle>
      </Box>
    </StyledLink>
  )
}

export default AppBrand

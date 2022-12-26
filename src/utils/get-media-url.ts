// ** Config Import
import apiConfig from 'src/configs/api'

interface IBanner {
  data?: {
    attributes: {
      url: string
    }
  }
}

export const getBannerUrl = (banner: IBanner): string => {
  if (!banner?.data) return '/images/logos/media-app.png'

  return `${apiConfig.publicFolderUrl}${banner.data.attributes.url}`
}

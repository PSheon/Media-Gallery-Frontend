export default {
  meEndpoint: '/auth/me',
  loginEndpoint: '/jwt/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken', // logout | refreshToken
  publicFolderUrl: process.env.NODE_ENV === 'production' ? 'https://mint.media.app' : 'http://localhost:1337'
}

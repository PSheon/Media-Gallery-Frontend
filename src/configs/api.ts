export default {
  baseUrl: process.env.NODE_ENV === 'production' ? 'https://mint.media.app' : 'http://localhost:1337',
  publicFolderUrl: process.env.NODE_ENV === 'production' ? 'https://mint.media.app' : 'http://localhost:1337'
}

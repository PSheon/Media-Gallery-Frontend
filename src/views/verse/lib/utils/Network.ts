// ** Colyseus Imports
import { Client } from 'colyseus.js'

const PROTOCOL = window.location.protocol.replace('http', 'ws')
const PATH = process.env.NODE_ENV === 'production' ? '/multiple' : ':2657'

const ENDPOINT =
  window.location.hostname.indexOf('heroku') >= 0 || window.location.hostname.indexOf('now.sh') >= 0
    ? `${PROTOCOL}//${window.location.hostname}${PATH}` // port 80 on heroku or now
    : `${PROTOCOL}//${window.location.hostname}${PATH}` // port 2657 on localhost

export const ColyseusClient = new Client(ENDPOINT)

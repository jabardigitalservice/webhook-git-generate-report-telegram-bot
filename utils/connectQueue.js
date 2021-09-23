import Queue from 'bull'
import Config from '../config'

const connectQueue = (git) => {
  return new Queue(git, {
    redis: {
      host: Config.get('redis.host'),
      port: Config.get('redis.port')
    }
  })
}

export default connectQueue

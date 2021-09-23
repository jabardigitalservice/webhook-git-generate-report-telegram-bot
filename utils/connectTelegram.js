import { TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions/index.js'
import input from 'input'
import Config from '../config'

const stringSession = new StringSession('')

const connectTelegram = async () => {
  console.log('Loading interactive example...')
  const client = new TelegramClient(stringSession, Number(Config.get('api.id')), Config.get('api.hash'), {
    connectionRetries: 5
  })
  await client.start({
    phoneNumber: async () => await input.text('Please enter your number: '),
    password: async () => await input.password('Please enter your password: '),
    phoneCode: async () => await input.text('Please enter the code you received: '),
    onError: (err) => console.log(err)
  })
  console.log('You should now be connected.')
  console.log(client.session.save()) // Save this string to avoid logging in again
}

connectTelegram()

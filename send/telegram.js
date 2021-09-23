import fs from 'fs'
import { Api, TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions/index.js'
import random from 'random-bigint'
import screenshot from '../capture/screenshot.js'
import { sendBodyIsValid } from '../send/elastic.js'
import Config from '../config/index.js'
import { messageValid } from '../template/message.js'
import sendRequest from './request.js'

const CHAT_ID = Number(Config.get('chat_id'))
const apiTelegram = `https://api.telegram.org/${Config.get('telegram.bot')}`
const client = new TelegramClient(new StringSession(Config.get('api.session')), Number(Config.get('api.id')), Config.get('api.hash'), {})

const sendMessageWithUser = async (message, replyToMsgId = null) => {
  if (client.disconnected) await client.connect()
  await client.invoke(
    new Api.messages.SendMessage({
      peer: CHAT_ID,
      message: message,
      randomId: random(128),
      noWebpage: true,
      replyToMsgId: replyToMsgId
    })
  )
}

const sendMessageWithBoth = async (message) => {
  await sendRequest({
    url: apiTelegram + '/sendMessage',
    formData: {
      chat_id: CHAT_ID,
      text: message
    }
  })
}

const sendPhotoWithBoth = async (picture) => {
  try {
    const response = await sendRequest({
      url: apiTelegram + '/sendPhoto',
      formData: {
        chat_id: CHAT_ID,
        photo: {
          value: fs.createReadStream(picture),
          options: {
            filename: picture,
            contentType: 'image/png'
          }
        }
      }
    })
    const { message_id: messageId } = response.result
    return messageId
  } catch (error) {
    console.log(error.message)
    throw error
  }
}

const sendTelegram = async (git, payload) => {
  try {
    const image = await screenshot(payload.url, git)
    const message = messageValid(payload)
    if (!image) {
      await sendMessageWithBoth(message)
    } else {
      const messageId = await sendPhotoWithBoth(image)
      await sendMessageWithUser(message, messageId)
    }
    sendBodyIsValid(payload)
    return true
  } catch (error) {
    console.log(error.message)
    throw error
  }
}

export default sendTelegram

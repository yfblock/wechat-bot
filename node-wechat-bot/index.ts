import { Message, WechatyBuilder } from 'wechaty'

// const wechaty = WechatyBuilder.build() // get a Wechaty instance
const bot = WechatyBuilder.build({
  name: 'WechatEveryDay',
  puppet: 'wechaty-puppet-wechat4u', // 如果有token，记得更换对应的puppet
})

async function onMessage(message: Message) {
  // if the message is received from room, return
  if(message.room() != null) return;

  console.log(`message received from ${message.talker()}`);
  console.log("message value: " + message.text());
  console.log("message date: " + message.date());
  
  const yf = await bot.Contact.find( { name: '御风'});
  
  // if the contact is found, then forward  the message to it.
  if(yf) {
    await yf.say(`receive a message from ${message.talker().name()}`);
    message.forward(yf);
  }
}

bot
  .on('scan', (qrcode, status) => console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`))
  .on('login',            user => console.log(`User ${user} logged in`))
  .on('message', onMessage)
  bot.start()
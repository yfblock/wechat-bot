import { Message, WechatyBuilder } from 'wechaty';
import { ReplyCommand } from './consts';

// get a wechaty builder instance.
const bot = WechatyBuilder.build({
  name: 'WechatEveryDay',
  puppet: 'wechaty-puppet-wechat4u', 
})

async function handleReplyCommand(message: Message, mixedData: string) {
  let replyNameIndex = mixedData.indexOf(' ');
  // split the mixedData to get the replyName and the replyNameIndex
  let replyName = mixedData.substring(0, replyNameIndex);
  let data = mixedData.substring(replyNameIndex + 1);
  
  // find reply data
  let replyContact = await bot.Contact.find({ name: replyName});

  // send the reply data to replyContact
  if (replyContact) replyContact.say(data);
  else message.talker().say(`can't send the data to ${replyName}`);
}

async function messageFromMaster(message: Message) {
  // just handle the text message, so return if the message is not a text message.
  if (message.type() != bot.Message.Type.Text) return;

  const cmd = message.text();

  // if the command is reply command, use the handleReplyCommand function to handle.
  if(cmd.indexOf(ReplyCommand) == 0) await handleReplyCommand(message, cmd.substring(ReplyCommand.length).trim());
  

}

async function messageFromOther(message: Message) {
  console.log(`message received from ${message.talker()}`);
  console.log(`message type ${message.type()}`)
  console.log("message value: " + message.text());
  console.log("message date: " + message.date());
  
  const yf = await bot.Contact.find( { name: '御风'});
  
  // if the contact is found, then forward  the message to it.
  if(yf) {
    await yf.say(`receive a message from ${message.talker().name()}`);
    message.forward(yf);
  }
}

async function onMessage(message: Message) {
  // if the message is received from room, 
  if(message.room() != null || message.type() == bot.Message.Type.Unknown) return;

  // if the message is received from self, return.
  if(message.talker().self()) return;

  // judge if the message is from the master user or the other user.
  if(message.talker().name() == '御风') await messageFromMaster(message);
  else await messageFromOther(message);
}

bot
  .on('scan', (qrcode, status) => console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`))
  .on('login',            user => console.log(`User ${user} logged in`))
  .on('message', onMessage)
bot.start()
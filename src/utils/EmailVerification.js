// const User=require('../database/user')
const MailSocket = require('@sendgrid/mail')
const {EmailAPIKey,EmailAddress,Url} =require('./variables')
const  {SUBJECT,HTML} = require('./mail-helper')

/**
 * sending verification email to registered email adress for respective users
 * @param {String} email 
 * @param {String} user_id 
 */
async function sendEmailForVerification(email,user_id){
  MailSocket.setApiKey(EmailAPIKey)
  const chunck = {
    to:email, 
    from: EmailAddress,
    subject:SUBJECT,
    html:HTML(Url,user_id),
  }
  MailSocket.send(chunck).then(() => {
      console.log('sent')
    })
    .catch((error) => {
      console.error(error)
    })
}
module.exports={
    sendEmailForVerification,
  }
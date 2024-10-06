const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: 'a.bazan@conecta.com.bo',
    pass: 'Ia260523***',
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMain() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'a.bazan@conecta.com.bo', // sender address
    to: 'jc.gutierrezg@conecta.com.bo', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>', // html body
  });

  console.log('Message sent: %s', info.messageId);
  //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

sendMain();

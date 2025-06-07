// mailer.js
const nodemailer = require('nodemailer');

const sendUserEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,    
        pass: process.env.APP_PASS,    
      },
    });

    const mailOptions = {
      from: '"Your App Name" <your-email@gmail.com>',
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
  } catch (err) {
    res.send({message:err})
  }
};

module.exports = {sendUserEmail};

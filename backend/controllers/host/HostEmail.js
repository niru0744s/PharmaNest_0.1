const nodemailer = require('nodemailer');

const sendHostEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,     // Replace with your Gmail
        pass: process.env.APP_PASS,        // Use App Password (not your Gmail password)
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

module.exports = sendHostEmail;
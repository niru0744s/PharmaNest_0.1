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
      from: `"PharmaNest" <${process.env.EMAIL}>`,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
};

module.exports = { sendUserEmail };

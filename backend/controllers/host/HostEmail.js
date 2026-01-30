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
      from: `"PharmaNest" <${process.env.EMAIL}>`,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    console.error('Error sending host email:', err);
    throw err;
  }
};

module.exports = sendHostEmail;
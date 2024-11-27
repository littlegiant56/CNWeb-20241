
import nodemailer from 'nodemailer';

// Tạo một transporter để gửi email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'luanngx1190@gmail.com',
    pass: 'tvqp lglf xskq uvfy'
  }
});

// Gửi email thông báo
export const sendNotificationEmail = (email) => {
    // set Date
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();

    if (day < 10) {
    day = "0" + day;
    }
    if (month < 10) {
    month = "0" + month;
    }
    const date = day + "/" + month + "/" + year;

  const mailOptions = {
    from: 'luanngx1190@gmail.com',
    to: email,
    subject: 'Đăng ký thành công',
    html: `
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Thông báo đăng ký tài khoản thành công</title>
        </head>
        <body>
        <div style="text-align: center; background-color: #f5f5f5; padding: 20px;">
            <h2>Thông báo đăng ký tài khoản thành công</h2>
            <p>Xin chào,</p>
            <p>Cảm ơn bạn đã đăng ký tài khoản mạng xã hội của chúng tôi. Dưới đây là thông tin tài khoản của bạn:</p>
            <ul style="list-style-type: none; padding-left: 0;">
            <li><strong>Email:</strong> ${email} </li>
            <li><strong>Ngày đăng ký:</strong> ${date}</li>
            </ul>
            <p>Cảm ơn bạn đã tham gia cùng chúng tôi!</p>
            <p>Trân trọng,</p>
            <p>FACEHUST</p>
        </div>
        </body>
        </html>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Lỗi khi gửi email thông báo:', error);
    } else {
      console.log('Email thông báo đã được gửi:', info.response);
    }
  });
};

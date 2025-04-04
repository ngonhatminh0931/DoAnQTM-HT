// server/routes/contact.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');

// Route lưu thông tin liên hệ và gửi email
router.post('/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // 1. Lưu vào database
    const newContact = new Contact({
      name,
      email,
      message
    });
    
    await newContact.save();
    
    // 2. Gửi email thông báo
    const transporter = nodemailer.createTransport({
      service: 'gmail', // hoặc dịch vụ email khác
      auth: {
        user: '23521081@gm.uit.edu.vn', // Thay bằng email của bạn
        pass: 'saey zupv zlzw gxjf'     // Thay bằng mật khẩu ứng dụng
      }
    });
    
    const mailOptions = {
      from: `"Website Contact" <23521081@gm.uit.edu.vn>`,
      to: 'nguyenletrongnhan0805@gmail.com', // Thay bằng email người nhận
      subject: `Yêu cầu liên hệ mới từ ${name}`,
      html: `
        <h2>Thông tin liên hệ mới</h2>
        <p><strong>Tên:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Nội dung:</strong> ${message}</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    // Trả về thông báo thành công
    res.status(200).json({ 
      success: true, 
      message: 'Thông tin liên hệ đã được lưu và gửi email thành công' 
    });
  } catch (error) {
    console.error('Lỗi khi xử lý liên hệ:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi khi xử lý thông tin liên hệ. Vui lòng thử lại sau.' 
    });
  }
});

// Route lấy tất cả liên hệ (dành cho admin)
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu liên hệ:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
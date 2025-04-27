const mongoose = require('mongoose');

// Thêm các tùy chọn cần thiết cho kết nối
const connect = mongoose.connect("mongodb+srv://nhansprite:JxjQeU7zaTdaQpyp@cluster0.gpn2s9g.mongodb.net/authweb?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
});

// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch((err) => {
    console.log("Database cannot be Connected:", err);
});

// Create Schema
const Loginschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true }); // Thêm timestamps để theo dõi thời gian tạo và cập nhật

// Collection part
// Đảm bảo tên collection là "users" (không phải ở số ít)
const collection = mongoose.model("users", Loginschema);

module.exports = collection;
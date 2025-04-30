const mongoose = require('mongoose');

const connectDB = async () => {
  
    try {
      mongoose.set('strictQuery', false);
      const conn = await mongoose.connect(process.env.MONGODB_URL);
      console.log(`Database Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
    }
}

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

module.exports = {
    connectDB,
    collection
};

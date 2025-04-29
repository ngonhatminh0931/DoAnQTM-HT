require('dotenv').config();

const express = require("express");
const path = require("path");
const { connectDB, collection } = require('./config');
const bcrypt = require('bcrypt');

connectDB();

const app = express();
// convert data into json format
app.use(express.json());
// Static file
app.use(express.static(path.join(__dirname, "../public")));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '../views'));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register User
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }

    // Kiểm tra tài khoản đã tồn tại
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        // Trả về trang đăng ký với thông báo
        res.render("signup", { message: "Tài khoản đã tồn tại. Vui lòng chọn tên khác." });
    } else {
        // Mã hoá mật khẩu
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;

        await collection.create(data);

        // Trả về trang login với thông báo thành công
        res.render("login", { message: "Đăng ký thành công! Vui lòng đăng nhập." });
    }
});

// Login user 
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("User name cannot found")
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("wrong Password");
        }
        else {
            res.render("home");
        }
    }
    catch {
        res.send("wrong Details");
    }
});


// Define Port for Application
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});


const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register
exports.register = asyncHandler(async (req, res) => {
  // التحقق من أن المستخدم الحالي هو أدمن
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  // قراءة البيانات من الطلب
  const { username, email, password, isAdmin } = req.body;

  // التحقق من صحة البيانات
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // توليد كلمة مرور مشفرة
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // إنشاء مستخدم جديد
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    isAdmin: isAdmin || false, // افتراضيًا ليس أدمن
  });

  // حفظ المستخدم وإرسال الرد
  try {
    const user = await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to register user",
      error: err.message,
    });
  }
});

// Login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // البحث عن المستخدم باستخدام البريد الإلكتروني
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // التحقق من صحة كلمة المرور
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(400).json({ message: "Wrong password" });
  }

  // إنشاء توكن JWT
  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );


  const response=({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });

  // if Admin Print that Else Do Nothing 
  if (user.isAdmin) {
    response.user.isAdmin = user.isAdmin;
  }
  res.status(200).json(response);

});

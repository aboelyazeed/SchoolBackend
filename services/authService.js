const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register
exports.register = asyncHandler(async (req, res) => {
  // توليد كلمة مرور مشفرة
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // إنشاء مستخدم جديد
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
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

  // إرسال الرد النهائي
  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

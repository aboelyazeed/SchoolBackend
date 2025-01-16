const express = require("express");
const {
  registerValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const {
  register,
  login,
} = require("../services/authService");

const router = express.Router();

router
  .route("/register")
  .post(registerValidator, register); 
router
  .route("/login")
  .post(loginValidator, login); 

module.exports = router;

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// Update user
exports.updateUser = asyncHandler(async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
    res.status(200).json("Account has been updated");
  } else {
    res.status(403).json("You can update only your account!");
  }
});

// Delete user
exports.deleteUser = asyncHandler(async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("Account has been deleted");
  } else {
    res.status(403).json("You can delete only your account!");
  }
});

// Get user
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  const { password, updatedAt, ...other } = user._doc;
  res.status(200).json(other);
});

// // Follow user
// exports.followUser = asyncHandler(async (req, res) => {
//   if (req.body.userId !== req.params.id) {
//     const user = await User.findById(req.params.id);
//     const currentUser = await User.findById(req.body.userId);

//     if (!user.followers.includes(req.body.userId)) {
//       await user.updateOne({ $push: { followers: req.body.userId } });
//       await currentUser.updateOne({ $push: { followings: req.params.id } });
//       res.status(200).json("User has been followed");
//     } else {
//       res.status(403).json("You already follow this user");
//     }
//   } else {
//     res.status(403).json("You can't follow yourself");
//   }
// });

// // Unfollow user
// exports.unfollowUser = asyncHandler(async (req, res) => {
//   if (req.body.userId !== req.params.id) {
//     const user = await User.findById(req.params.id);
//     const currentUser = await User.findById(req.body.userId);

//     if (user.followers.includes(req.body.userId)) {
//       await user.updateOne({ $pull: { followers: req.body.userId } });
//       await currentUser.updateOne({ $pull: { followings: req.params.id } });
//       res.status(200).json("User has been unfollowed");
//     } else {
//       res.status(403).json("You don't follow this user");
//     }
//   } else {
//     res.status(403).json("You can't follow yourself");
//   }
// });

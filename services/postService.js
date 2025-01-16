const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const User = require("../models/userModel");

// Create a post
exports.createPost = asyncHandler(async (req, res) => {
  const newPost = new Post(req.body);
  const savedPost = await newPost.save();
  res.status(200).json(savedPost);
});

// Update a post
exports.updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.userId === req.body.userId) {
    await post.updateOne({ $set: req.body });
    res.status(200).json("The Post has been updated");
  } else {
    res.status(403).json("You can update only your post");
  }
});

// Delete a post
exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.userId === req.body.userId) {
    await post.deleteOne();
    res.status(200).json("The Post has been deleted");
  } else {
    res.status(403).json("You can delete only your post");
  }
});

// Like or dislike a post
exports.likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post.likes.includes(req.body.userId)) {
    await post.updateOne({ $push: { likes: req.body.userId } });
    res.status(200).json("The Post has been liked");
  } else {
    await post.updateOne({ $pull: { likes: req.body.userId } });
    res.status(200).json("The Post has been disliked");
  }
});

// Get a post
exports.getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.status(200).json(post);
});

// Get timeline posts (all posts sorted by newest first)
exports.getTimelinePosts = asyncHandler(async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 }); // Fetch all posts, sorted by creation date (newest first)
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch timeline posts", error: err });
    }
  });
  

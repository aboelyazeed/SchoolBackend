const asyncHandler = require("express-async-handler");
const Comment = require("../models/commentModel");
const Post = require("../models/postModel");

// Add Comment
exports.addComment = asyncHandler(async (req, res) => {
    const comment = new Comment({
        postId: req.body.postId,
        userId: req.body.userId,
        text: req.body.text,
        img: req.body.img || "",
    });

    const savedComment = await comment.save();

    // Update Number Of Comments
    await Post.findByIdAndUpdate(req.body.postId, { $inc: { commentsCount: 1 } });

    res.status(200).json(savedComment);
});

// Get Comments in a Post
exports.getCommentsInPost = asyncHandler(async (req, res) => {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
});

// Like or Dislike Comment
exports.likeComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const alreadyLiked = comment.likes.includes(req.body.userId);

    if (alreadyLiked) {
        await comment.updateOne({ $pull: { likes: req.body.userId } });
        res.status(200).json({ message: "Like removed" });
    } else {
        await comment.updateOne({ $push: { likes: req.body.userId } });
        res.status(200).json({ message: "Comment liked" });
    }
});

// Update Comment
exports.updateComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() === req.body.userId) {
        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    text: req.body.text,
                    img: req.body.img,
                },
            },
            { new: true }
        );
        res.status(200).json(updatedComment);
    } else {
        res.status(403).json({ message: "You can update only your comment" });
    }
});

// Delete Comment
exports.deleteComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const post = await Post.findById(comment.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isAuthorized =
        comment.userId.toString() === req.body.userId || // comment maker
        post.userId === req.body.userId || // post maker
        req.body.isAdmin; // admin

    if (isAuthorized) {
        await comment.deleteOne();
        await Post.findByIdAndUpdate(comment.postId, { $inc: { commentsCount: -1 } });
        res.status(200).json({ message: "Comment deleted" });
    } else {
        res.status(403).json({ message: "Unauthorized to delete this comment" });
    }
});

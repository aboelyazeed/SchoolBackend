const express = require("express");
const {
  addComment,
  getCommentsInPost,
  likeComment,
  updateComment,
  deleteComment,
} = require("../services/commentService");
const {
  addCommentValidator,
  likeCommentValidator,
  updateCommentValidator,
  deleteCommentValidator,
} = require("../utils/validators/commentValidator");

const router = express.Router();

router
  .route("/")
  .post(addCommentValidator, addComment);

router
  .route("/:postId")    //post ID
  .get(getCommentsInPost);

router
  .route("/:id/like")   //comment ID
  .put(likeCommentValidator, likeComment);

router
  .route("/:id")        //comment ID
  .put(updateCommentValidator, updateComment)
  .delete(deleteCommentValidator, deleteComment);

module.exports = router;

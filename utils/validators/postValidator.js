const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

// Validator for creating a post
exports.createPostValidator = [
  check("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID format"),
  check("desc")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  check("img")
    .optional()
    .isURL()
    .withMessage("Image must be a valid URL"),
  validatorMiddleware,
];

// Validator for updating a post
exports.updatePostValidator = [
  check("id")
    .notEmpty()
    .withMessage("Post ID is required")
    .isMongoId()
    .withMessage("Invalid Post ID format"),
  check("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID format"),
  check("desc")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  check("img")
    .optional()
    .isURL()
    .withMessage("Image must be a valid URL"),
  validatorMiddleware,
];

// Validator for liking or disliking a post
exports.likePostValidator = [
  check("id")
    .notEmpty()
    .withMessage("Post ID is required")
    .isMongoId()
    .withMessage("Invalid Post ID format"),
  check("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID format"),
  validatorMiddleware,
];

// Validator for deleting a post
exports.deletePostValidator = [
  check("id")
    .notEmpty()
    .withMessage("Post ID is required")
    .isMongoId()
    .withMessage("Invalid Post ID format"),
  check("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID format"),
  validatorMiddleware,
];

// Validator for getting a post
exports.getPostValidator = [
  check("id")
    .notEmpty()
    .withMessage("Post ID is required")
    .isMongoId()
    .withMessage("Invalid Post ID format"),
  validatorMiddleware,
];

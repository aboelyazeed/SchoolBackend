const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createCourseValidator = [
  check("name")
    .notEmpty()
    .withMessage("Course name is required")
    .isLength({ min: 3 })
    .withMessage("Course name is too short")
    .isLength({ max: 32 })
    .withMessage("Course name is too long"),
  check("level")
    .notEmpty()
    .withMessage("Course level is required")
    .isMongoId()
    .withMessage("Course level must be a valid MongoDB ID"),
  check("image").notEmpty().withMessage("Course image is required"),
  validatorMiddleware,
];

exports.updateCourseValidator = [
  check("id").isMongoId().withMessage("Invalid course id format"),
  check("level")
    .notEmpty()
    .withMessage("Course must belong to level")
    .isMongoId()
    .withMessage("Invalid course level id format"),
  validatorMiddleware,
];

exports.deleteCourseValidator = [
  check("id").isMongoId().withMessage("Invalid course id format"),
  validatorMiddleware,
];

exports.getCourseValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory id format"),
  validatorMiddleware,
];

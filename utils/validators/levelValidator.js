const { check } = require("express-validator");
const validatorMeddlware = require("../../middlewares/validatorMiddleware");

exports.createLevelValidator = [
  check("name")
    .notEmpty()
    .withMessage("Level name is required")
    .isLength({ min: 5 })
    .withMessage("Level name is too shorte")
    .isLength({ max: 32 })
    .withMessage("Level name is too long"),
  validatorMeddlware,
];

exports.getLevelValidator = [
  check("id").isMongoId().withMessage("Invalid Level ID format"),
  validatorMeddlware,
];

exports.updateLevelValidator = [
  check("id").isMongoId().withMessage("Invalid Level ID format"),
  validatorMeddlware,
];

exports.deleteLevelValidator = [
  check("id").isMongoId().withMessage("Invalid Level ID format"),
  validatorMeddlware,
];

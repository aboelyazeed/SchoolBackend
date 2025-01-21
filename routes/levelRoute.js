const express = require("express");
const {
  getLevelValidator,
  createLevelValidator,
  updateLevelValidator,
  deleteLevelValidator,
} = require("../utils/validators/levelValidator");

const {
  getLevels,
  getLevel,
  createLevel,
  updateLevel,
  deleteLevel,
} = require("../services/levelServices");
const coursesRoute = require("./courseRoute");

const router = express.Router();

router.use("/:levelId/courses", coursesRoute);

router.route("/").get(getLevels).post(createLevelValidator, createLevel);

router
  .route("/:id")
  .get(getLevelValidator, getLevel)
  .put(updateLevelValidator, updateLevel)
  .delete(deleteLevelValidator, deleteLevel);

module.exports = router;

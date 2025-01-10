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

const router = express.Router();

router.route("/").get(getLevels).post(createLevelValidator, createLevel);

router
  .route("/:id")
  .get(getLevelValidator, getLevel)
  .put(updateLevelValidator, updateLevel)
  .delete(deleteLevelValidator, deleteLevel);

module.exports = router;

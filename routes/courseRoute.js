const express = require("express");

const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  setLevelIdToBody,
  createFilterObj,
} = require("../services/courseService");

const {
  createCourseValidator,
  getCourseValidator,
  deleteCourseValidator,
  updateCourseValidator,
} = require("../utils/validators/courseValidator");

// mergeParams allow us to access prametars on the other routers
// Ex: We need to access levelId from the level router
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(setLevelIdToBody, createCourseValidator, createCourse)
  .get(createFilterObj, getCourses);
router
  .route("/:id")
  .get(getCourseValidator, getCourse)
  .put(updateCourseValidator, updateCourse)
  .delete(deleteCourseValidator, deleteCourse);

module.exports = router;

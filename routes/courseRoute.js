const express = require("express");

const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require("../services/courseService");

const {
  createCourseValidator,
  getCourseValidator,
  deleteCourseValidator,
  updateCourseValidator,
} = require("../utils/validators/courseValidator");

const router = express.Router();

router.route("/").get(getCourses).post(createCourseValidator, createCourse);
router
  .route("/:id")
  .get(getCourseValidator, getCourse)
  .put(updateCourseValidator, updateCourse)
  .delete(deleteCourseValidator, deleteCourse);

module.exports = router;

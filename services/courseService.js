const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Course = require("../models/courseModel");

exports.setLevelIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.level) req.body.level = req.params.levelId;
  next();
};
// @desc  Create course
// @route POST /api/v1/courses
// @access Private
exports.createCourse = asyncHandler(async (req, res) => {
  const { name, level, image } = req.body;
  const course = await Course.create({
    name,
    slug: slugify(name),
    level,
    image,
  });
  res.status(201).json({ data: course });
});

// @desc  Get all courses by level
// @route GET /api/v1/levels/:levelId/courses
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.levelId) filterObject = { level: req.params.levelId };
  req.filterObj = filterObject;
  next();
};
// @desc  Get all courses
// @route GET /api/v1/courses
// @access Public
exports.getCourses = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 20;
  const skip = (page - 1) * limit; // Ex: (2-1) * 5 = 5

  const courses = await Course.find(req.filterObj)
    .skip(skip)
    .limit(limit)
    .populate({ path: "level", select: "name -_id" });
  res.status(200).json({ results: courses.length, page, data: courses });
});

// @desc  Get specific course by id
// @route GET /api/v1/courses/:id
// @access Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findById(id).populate({
    path: "level",
    select: "name -_id",
  });
  if (!course) {
    return next(new ApiError(`No course for this id ${id}`, 404));
  }
  res.status(200).json({ data: course });
});

// @desc  Update course by id
// @route PUT /api/v1/courses/:id
// @access Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, level, image } = req.body;
  const course = await Course.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), level, image },
    { new: true }
  );

  if (!course) {
    return next(new ApiError(`No course for this id ${id}`, 404));
  }
  res.status(200).json({ data: course });
});

// @desc  Delete course by id
// @route DELETE /api/v1/courses/:id
// @access Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findByIdAndDelete(id);
  if (!course) {
    return next(new ApiError(`No course for this id ${id}`, 404));
  }
  res.status(204).send();
});

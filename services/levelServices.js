// @Author @Aboelyazeed
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Level = require("../models/levelModel");

// @desc Get List of levels
// @route GET /api/v1/levels
// @access Public
exports.getLevels = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit; // Ex: (2-1) * 5 = 5
  const levels = await Level.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: levels.length, page, data: levels });
});

// @desc Get specific level by id
// @route GET /api/v1/levels/:id
// @access Public
exports.getLevel = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const level = await Level.findById(id);
  if (!level) {
    // res.status(404).json({ msg: `No level for this id ${id}` });
    return next(new ApiError(`No level for this id ${id}`, 404));
  }
  res.status(200).json({ data: level });
});

// @desc Create new level
// @route POST /api/v1/levels
// @access Private
exports.createLevel = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const level = await Level.create({ name, slug: slugify(name) });
  res.status(201).json({ data: level });
});

// @desc Update level by id
// @route PUT /api/v1/levels/:id
// @access Private
exports.updateLevel = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const level = await Level.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );

  if (!level) {
    return next(new ApiError(`No level for this id ${id}`, 404));
  }
  res.status(200).json({ data: level });
});

// @desc Delete level by id
// @route DELETE /api/v1/levels/:id
// @access Private
exports.deleteLevel = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const level = await Level.findByIdAndDelete(id);
  if (!level) {
    return next(new ApiError(`No level for this id ${id}`, 404));
  }
  res.status(204).json({ data: null });
});

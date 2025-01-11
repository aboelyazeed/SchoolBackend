const mongoose = require("mongoose");

// Create Course Schema
const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Course name is required"],
      unique: [true, "Course must be unique"],
      minlength: [3, "Course name is too short"],
      maxlength: [32, "Course name is too long"],
    },
    // A and B => website.com/*a-and-b*
    slug: {
      type: String,
      lowercase: true,
    },
    level: {
      type: mongoose.Schema.ObjectId,
      ref: "Level",
      required: [true, "course must belong to a level"],
    },
    image: String,
  },
  { timestamps: true }
);

// Create Courses Model
module.exports = mongoose.model("Course", courseSchema);

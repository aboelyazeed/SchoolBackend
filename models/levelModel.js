const mongoose = require("mongoose");

// Create Level Schema
const levelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Level name is required"],
      unique: [true, "Level must be unique"],
      minlength: [5, "Level name must be at least 5 characters long"],
      maxlength: [32, "Level name must be at most 32 characters long"],
    },
    // A and B => website.com/*a-and-b*
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

// Create Level Model
module.exports = mongoose.model("Level", levelSchema);

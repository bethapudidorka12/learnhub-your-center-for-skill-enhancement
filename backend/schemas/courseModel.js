// backend/schemas/courseModel.js

const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to Teacher
      required: true,
    },
    C_educator: {
      type: String,
      required: true,
      trim: true,
    },
    C_categories: {
      type: String,
      required: true,
      trim: true,
    },
    C_title: {
      type: String,
      required: true,
      trim: true,
    },
    C_description: {
      type: String,
      default: "",
      trim: true,
    },
    sections: [
      {
        type: String,
        trim: true,
      },
    ],
    C_price: {
      type: Number,
      default: 0,
    },

    enrolledStudents: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        progress: { type: Number, default: 0 },
        completed: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);

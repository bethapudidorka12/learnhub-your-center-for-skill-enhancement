const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: {
      type: String,
      enum: ["admin", "teacher", "student"], // ✅ includes student
      required: true,
    },
  },
  { timestamps: true } // ✅ this was outside before, now it's in the right place
);

module.exports = mongoose.model('User', userSchema);

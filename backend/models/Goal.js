const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  name: String,
  targetAmount: Number,
  savedAmount: Number,
  dueDate: Date
});

module.exports = mongoose.model("Goal", goalSchema);
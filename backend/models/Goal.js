const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  savedAmount: { type: Number, required: true },
  dueDate: { type: Date, required: true }
});

module.exports = mongoose.model("Goal", goalSchema);
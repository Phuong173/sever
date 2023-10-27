const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Topic = new Schema({
  title: { type: String },
  desc: { type: String },
  image: { type: String },
}, {
  timestamps: true,
});

module.exports = mongoose.model("topic", Topic);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = new Schema(
  {
    postId: { type: String },
    userId: { type: String },
    content: { type: String },
    parentCommentId: { type: String },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
);

module.exports = mongoose.model("comment", Comment);
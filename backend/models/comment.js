const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const commentSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    postId: {
      type: String,
      ref: 'Post',
      required: true,
    },
    author: {
      type: String,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Comment = model('Comment', commentSchema);

module.exports = Comment;

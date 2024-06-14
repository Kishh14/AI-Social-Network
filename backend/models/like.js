const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const likeSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    postId: {
      type: String,
      ref: 'Post',
    }
  },
  { timestamps: true }
);

const Like = model('Like', likeSchema);

module.exports = Like;

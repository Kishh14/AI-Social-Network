const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const postSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    author: {
      type: String,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: String,
    video: String,
    likes: [
      {
        type: String,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: String,
        ref: 'Comment',
      },
    ],
    isMedia: Boolean
  },
  { timestamps: true }
);

const Post = model('Post', postSchema);

module.exports = Post;

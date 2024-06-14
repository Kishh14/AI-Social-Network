const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    online: {
      type: Boolean,
      default: false
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImg: String,
    bio: {
      type: String,
      default: ""
    },
    followers: [
      {
        type: String,
        ref: 'User',
      },
    ],
    following: [
      {
        type: String,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

const User = model('User', userSchema);

module.exports = User;

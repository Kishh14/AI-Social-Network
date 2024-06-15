const UserModel = require("../models/user");
const Post = require("../models/post");
const Like = require("../models/like");
const Comment = require("../models/comment");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const AddUser = async (req, res) => {
    try {
        const { username, email, password, image } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are mandatory!" });
        }

        const findEmail = await UserModel.findOne({ email });
        if (findEmail) {
            return res.status(400).json({ message: "Email already registered!" });
        }

        const findUsername = await UserModel.findOne({ username });
        if (findUsername) {
            return res.status(400).json({ message: "Username already registered!" });
        }

        const hashPassword = await bcrypt.hash(password, 8);
        const newUser = new UserModel({ username, email, password: hashPassword, profileImg: image });
        const resp = await newUser.save();

        return res.status(200).json({ message: "User Registered Successfully!", user: resp });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!", error });
    }
};

const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are mandatory!" });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email is not registered!" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Email or Password is Incorrect!" });
        }

        const token = jwt.sign(user.email, process.env.JWT_TOKEN);
        const userInfo = { "_id": user._id, "username": user.username, "email": user.email, "profileImg": user.profileImg, "followers": user.followers, "following": user.following, "bio": user.bio };

        return res.status(200).json({ message: "User Logged In Successfully!", token, user: userInfo });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!", error });
    }
};

const SingleUserSearchbyName = async (req, res) => {
    const name = req.params.name;

    try {
        const getUser = await UserModel.findOne({ username: name }, { password: 0 });
        if (!getUser) {
            return res.status(400).json({ message: "User not found!" });
        }

        return res.status(200).json({ message: "User found!", user: getUser });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!", error });
    }
};

const SingleUserSearchbyId = async (req, res) => {
    const { id } = req.params;

    try {
        const getUser = await UserModel.findById(id);
        if (!getUser) {
            return res.status(400).json({ message: "User ID not found!" });
        }

        return res.status(200).json({ message: "User found!", user: getUser });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!", error });
    }
};

const followUser = async (req, res) => {
    const userAcc = req.user;
    const followId = req.params.id;

    if (userAcc._id == followId) {
        return res.status(500).json({ message: "You cannot follow your own account!" });
    }

    try {
        const user = await UserModel.findOne({ _id: followId });

        if (!user) {
            return res.status(500).json({ message: "User not Found!" });
        }

        const checkFollowing = userAcc.following.includes(followId);
        if (checkFollowing) {
            return res.status(500).json({ message: "You are already following this account" });
        }

        // Update follower and following arrays
        const updateFollower = await user.updateOne({ $push: { followers: userAcc._id } });
        const updateFollowing = await userAcc.updateOne({ $push: { following: user._id } });

        if (!updateFollower || !updateFollowing) {
            return res.status(500).json({ message: "Error Occurred while following" });
        }

        return res.status(200).json({ message: "You followed the account", updateFollower, updateFollowing });
    } catch (error) {
        res.status(500).json({ message: "Error Occurred!", error });
    }
};

const unfollowUser = async (req, res) => {
    const userAcc = req.user;
    const followId = req.params.id;

    if (userAcc._id == followId) {
        return res.status(500).json({ message: "You cannot unfollow your own account!" });
    }

    try {
        const user = await UserModel.findOne({ _id: followId });

        if (!user) {
            return res.status(500).json({ message: "User not Found!" });
        }

        const checkFollowing = userAcc.following.includes(followId);

        if (!checkFollowing) {
            return res.status(500).json({ message: "You are not following this account" });
        }

        // Update follower and following arrays
        const updateFollower = await user.updateOne({ $pull: { followers: userAcc._id } });
        const updateFollowing = await userAcc.updateOne({ $pull: { following: user._id } });

        if (!updateFollower || !updateFollowing) {
            return res.status(500).json({ message: "Error Occurred while unfollowing" });
        }

        return res.status(200).json({ message: "You unfollowed the account", updateFollower, updateFollowing });
    } catch (error) {
        return res.status(500).json({ message: "Error Occurred!", error });
    }
};

const editUsername = async (req, res) => {
    const userId = req.user._id;
    const { username: newUsername } = req.body;

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { username: newUsername },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ message: "User not found!" });
        }

        return res.status(200).json({ message: "Username updated!", user: updatedUser });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!", error });
    }
};

const editBio = async (req, res) => {
    const userId = req.user._id;
    const { bio: newBio } = req.body;

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { bio: newBio },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ message: "User not found!" });
        }

        return res.status(200).json({ message: "Bio updated!", user: updatedUser });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!", error });
    }
};

const editPassword = async (req, res) => {
    const userId = req.user._id;
    const { password: newPassword } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 8);
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ message: "User not found!" });
        }

        return res.status(200).json({ message: "Password updated!", user: updatedUser });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!", error });
    }
};

const uploadImage = async (req, res) => {
    const image = req.file.path;
    const paramsId = req.params.id;

    try {
        if (!image) {
            return res.status(500).json({ message: "No file uploaded!" });
        }

        const cloudinaryResult = await cloudinary.uploader.upload(image);
        if (!cloudinaryResult) {
            return res.status(500).json({ message: "Error while storing image!" });
        }

        const findUser = await UserModel.findById({ _id: paramsId });
        if (!findUser) {
            return res.status(500).json({ message: "Error while finding User!" });
        }

        const storeImage = await findUser.updateOne({ profileImg: cloudinaryResult.secure_url });
        if (!storeImage) {
            return res.status(500).json({ message: "Error while updating image in user" });
        }

        // Delete the file from the local filesystem
        fs.unlink(image, (err) => {
            if (err) {
                console.error("Failed to delete local image:", err);
            } else {
                console.log("Local image deleted");
            }
        });

        return res.status(200).json({ message: "Image uploaded successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "Error Occurred!", error });
    }
};

const handleLike = async (req, res) => {
    const { postId } = req.body;

    try {
        const findPost = await Post.findById(postId);
        if (!findPost) {
            return res.status(404).json({ message: "Post not found!" });
        }

        const findLike = await Like.findOne({ postId, userId: req.user._id });
        if (findLike) {
            return res.status(400).json({ message: "Post already liked!" });
        }

        const generateLike = new Like({ userId: req.user._id, postId });
        const likeCreated = await generateLike.save();

        findPost.likes.push(req.user._id);
        await findPost.save();

        return res.status(201).json({ message: "Post Liked!", like: likeCreated });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

const handleUnlike = async (req, res) => {
    const { postId } = req.body;

    try {
        const findPost = await Post.findById(postId);
        if (!findPost) {
            return res.status(404).json({ message: "Post not found!" });
        }

        const findLike = await Like.findOne({ postId, userId: req.user._id });
        if (!findLike) {
            return res.status(400).json({ message: "Post not liked yet!" });
        }

        await findLike.deleteOne();

        findPost.likes = findPost.likes.filter(userId => userId !== req.user._id);
        await findPost.save();

        return res.status(200).json({ message: "Post Disliked!" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

const createComment = async (req, res) => {
    const { postId, content } = req.body;

    try {
        const findPost = await Post.findById(postId);
        if (!findPost) {
            return res.status(404).json({ message: "Post not found!" });
        }

        const newComment = new Comment({
            postId,
            author: req.user._id,
            content
        });
        const commentCreated = await newComment.save();

        findPost.comments.push(commentCreated._id);
        await findPost.save();

        return res.status(201).json({ message: "Comment created!", comment: commentCreated });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

const deleteComment = async (req, res) => {
    const { commentId } = req.body;

    try {
        const findComment = await Comment.findById(commentId);
        if (!findComment) {
            return res.status(404).json({ message: "Comment not found!" });
        }

        const findPost = await Post.findById(findComment.postId);
        if (!findPost) {
            return res.status(404).json({ message: "Post not found!" });
        }

        if (findComment.author.toString() !== req.user._id && findPost.author.toString() !== req.user._id) {
            return res.status(403).json({ message: "Unauthorized action!" });
        }

        await Comment.deleteOne({ _id: commentId });

        findPost.comments = findPost.comments.filter(id => id.toString() !== commentId);
        await findPost.save();

        return res.status(200).json({ message: "Comment deleted!" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

const uploadImagePost = async (req, res) => {
    const { content } = req.body;
    const image = req.file.path;

    try {
        if (!image) {
            return res.status(500).json({ message: "No file uploaded!" });
        }

        const cloudinaryResult = await cloudinary.uploader.upload(image);
        if (!cloudinaryResult) {
            return res.status(500).json({ message: "Error while storing image!" });
        }

        const findUser = await UserModel.findById({ _id: req.user._id });
        if (!findUser) {
            return res.status(500).json({ message: "Error while finding User!" });
        }

        const newPost = new Post({
            author: req.user._id,
            content: content || "",
            isMedia: true,
            image: cloudinaryResult.secure_url,
            video: null,
        });
        const postCreated = await newPost.save();


        // Delete the file from the local filesystem
        fs.unlink(image, (err) => {
            if (err) {
                console.error("Failed to delete local image:", err);
            } else {
                console.log("Local image deleted");
            }
        });

        return res.status(200).json({ message: "Image uploaded successfully!", post: postCreated });
    } catch (error) {
        return res.status(500).json({ message: "Error Occurred!", error });
    }
}

const uploadAIimagePost = async (req, res) => {
    const { aiLink, content } = req.body;

    try {
        if (!aiLink) {
            return res.status(400).json({ message: "Image is not present!" });
        }

        const findUser = await UserModel.findById({ _id: req.user._id });
        if (!findUser) {
            return res.status(500).json({ message: "Error while finding User!" });
        }

        const newPost = new Post({
            author: req.user._id,
            content: content || "",
            isMedia: true,
            image: aiLink,
            video: null,
        });

        const postCreated = await newPost.save();

        return res.status(200).json({ message: "Image uploaded successfully!", post: postCreated });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error });
    }
}

const uploadTextPost = async (req, res) => {
    const { content } = req.body;

    try {
        if (!content) {
            return res.status(400).json({ message: "Content is mandatory!" });
        }

        const findUser = await UserModel.findById({ _id: req.user._id });
        if (!findUser) {
            return res.status(500).json({ message: "Error while finding User!" });
        }

        const newPost = new Post({
            author: req.user._id,
            content,
            isMedia: false,
            image: null,
            video: null,
        });

        const postCreated = await newPost.save();

        return res.status(200).json({ message: "Image uploaded successfully!", post: postCreated });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error });
    }
}

const uploadAIvideoPost = async (req, res) => {
    const { aiLink, content } = req.body;

    try {
        if (!aiLink) {
            return res.status(400).json({ message: "Video is not present!" });
        }

        const findUser = await UserModel.findById({ _id: req.user._id });
        if (!findUser) {
            return res.status(500).json({ message: "Error while finding User!" });
        }

        const newPost = new Post({
            author: req.user._id,
            content: content || "",
            isMedia: true,
            image: null,
            video: aiLink,
        });

        const postCreated = await newPost.save();

        return res.status(200).json({ message: "Image uploaded successfully!", post: postCreated });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error });
    }
}

const deletePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.author !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this post" });
        }

        await Post.findByIdAndDelete(postId);

        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error occurred while deleting the post", error });
    }
};

const getAllPosts = async(req,res)=> {
    try {
        const allPosts = await Post.find();
        return res.status(200).json({message:"Posts found!",posts: allPosts});
    } catch (error) {
        return res.status(400).json({message:"Error",error});
    }
}

const getSingleUserPosts = async(req,res)=> {
    const userId = req.params.id;

    try {
        const findUser = await UserModel.findById(userId);
        if(!findUser){
            return res.status(404).json({message:"User not found"});
        }

        const posts = await Post.find({author:userId});

        return res.status(200).json({message:"Posts Found!",post:posts});
    } catch (error) {
        return res.status(400).json({message:"Error",error});
    }
}

const getSinglePost = async(req,res)=> {
    const postId = req.params.id;

    try {
        const findPost = await Post.findById(postId);
        if (!findPost) {
            return res.status(400).json({message:"Post not found!"});
        }

        return res.status(200).json({message:"Post found!",post:findPost});
    } catch (error) {
        return res.status(400).json({message:"Error",error});
    }
}

const getAllCommentsOfSinglePost = async (req, res) => {
    const  postId  = req.params.id;
  
    try {
      const findPost = await Post.findById(postId);
      if (!findPost) {
        return res.status(400).json({ message: "Post not found!" });
      }
  
      const findComments = await Comment.find({ postId: postId }); 
      return res.status(200).json({ message: "Comments found", comments: findComments });
    } catch (error) {
      return res.status(400).json({ message: "Error", error });
    }
  };
  

module.exports = {
    AddUser,
    LoginUser,
    SingleUserSearchbyName,
    SingleUserSearchbyId,
    followUser,
    unfollowUser,
    editUsername,
    editBio,
    editPassword,
    uploadImage,
    handleLike,
    handleUnlike,
    createComment,
    deleteComment,
    uploadImagePost,
    uploadAIimagePost,
    uploadTextPost,
    uploadAIvideoPost,
    deletePost,
    getAllPosts,
    getSinglePost,
    getSingleUserPosts,
    getAllCommentsOfSinglePost
};

const { Router } = require("express");
const {
  SingleUserSearchbyId,
  SingleUserSearchbyName,
  editBio,
  editPassword,
  editUsername,
  followUser,
  unfollowUser,
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
  getSingleUserPosts,
  getSinglePost
} = require("../controllers/userController");
const  upload  = require("../middlewares/uploadImage");
const authenticate = require("../middlewares/protectedRoute");

const router = Router();

router.get('/:name/getByName', SingleUserSearchbyName);
router.get('/:id/getbyid', SingleUserSearchbyId);
router.put('/:id/follow', authenticate, followUser);
router.put('/:id/unfollow', authenticate, unfollowUser);
router.put('/editUsername', authenticate, editUsername);
router.put('/editBio', authenticate, editBio);
router.put('/editPassword', authenticate, editPassword);
router.put('/:id/uploadImage', authenticate, upload.single('image'), uploadImage);
router.post('/like',authenticate,handleLike);
router.delete('/unlike',authenticate,handleUnlike);
router.post('/createComment',authenticate,createComment);
router.delete('/deleteComment',authenticate,deleteComment);
router.post('/uploadImagePost',authenticate,upload.single('image'),uploadImagePost);
router.post('/uploadAIimagePost',authenticate,uploadAIimagePost);
router.post('/uploadTextPost',authenticate,uploadTextPost);
router.post('/uploadAIvideoPost',authenticate,uploadAIvideoPost); 
router.delete('/:id/deletePost',authenticate,deletePost); 
router.get('/allPosts',getAllPosts);
router.get('/:id/singleUserPosts',getSingleUserPosts);
router.get('/:id/singlePost',getSinglePost);

module.exports = router;

import { React, useState } from "react";
import {
  FaEllipsisH,
  FaHeart,
  FaComment,
  FaShare,
  FaTimes,
} from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import CommentCard from "../CommentCard/CommentCard";
import "./PostCard.css";
import { useClickAway } from "../../../hooks/useClickAway";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const PostCard = ({
  userName,
  time,
  postCaption,
  postImage,
  likeCount,
  likedUserName,
  userImage,
  authorId,
  postId,
  post
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useClickAway(() => {
    console.log("Clicked!");
    setIsModalOpen(false);
  });

  const [currentComments,setCurrentComments]=useState()
  const [currentAuthors, setCurrentAuthors] = useState();
  const [comment,setComment] = useState();

  const toggleModal = async(postId) => {
    try {
      await fetchComments(postId)
      setIsModalOpen(!isModalOpen);
      
    } catch (error) {
      console.error("Error fetching comments or author details:", error);
    } finally {
      setIsModalOpen(!isModalOpen);
    }
  };

  const fetchComments = async(postId)=>{
    const getComments = await axios.get(
      `${import.meta.env.VITE_API_USER_URL}/getSinglePostComments/${postId}`
    );
    const comments = getComments.data.comments;
    setCurrentComments(comments);
    
    // Fetch author details for each comment asynchronously
    const authorDetailsPromises = comments.map(async (comment) => {
      const getAuthor = await axios.get(
        `${import.meta.env.VITE_API_USER_URL}/${comment.author}/getbyid`
      );
      return getAuthor.data.user;
    });

    const authors = await Promise.all(authorDetailsPromises);
    setCurrentAuthors(authors);
  }

  const [like,setLike] = useState(likeCount);
  const [postLike,setPostLike] = useState();
  const navigate=useNavigate()

  const user = useSelector(state => state.user.user);

  const reqConfig = {
    headers: {
      Authorization:`Bearer ${user.token}`
    }
  }

  const handleLike = async (postId) => {
    try {
      const payload = { postId };
      const like = await axios.post(
        `${import.meta.env.VITE_API_USER_URL}/liked`,
        payload,
        reqConfig
      );
      navigate('/PostPage')
    } catch (error) {
      console.log(error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const payload = { postId };
      const unlike = await axios.delete(
        `${import.meta.env.VITE_API_USER_URL}/unlike`,
        {
          ...reqConfig,
          data: payload,
        }
      );
    } catch (error) {
      console.error(
        "Error disliking the post:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // const fetchPost =async()=>{
  //   try {
  //     const resp = await axios.get(`${import.meta.env.VITE_API_USER_URL}/${postId}/singlePost`);
  //     setPostLike(resp.data.post.like)
  //     setLike(resp.data.post.likes.length)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const handleComment = async()=>{
    try {
      const resp = await axios.post(`${import.meta.env.VITE_API_USER_URL}/createComment`,{postId,content:comment},reqConfig);
      setComment('');
      setIsModalOpen(!isModalOpen);
      toast.success(resp.data.message)
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <div className="rounded-md overflow-hidden mx-3 glass-effect my-3">
      {/* User Profile Section */}
      <div className="flex items-center p-4">
        <img
          className="w-12 h-12 rounded-full mr-4"
          src={userImage}
          alt="User Profile"
        />
        <div>
          <p className="font-semibold text-white cursor-pointer" onClick={()=>{navigate(`/profile/${userName}`)}}>{userName}</p>
        </div>
        <div className="ml-auto items-center flex justify-between gap-4">
          <p className="text-xs text-white mr-2">{time} ago</p>
          {authorId === user.details._id ? <FaEllipsisH className="text-white" /> : ''}
        </div>
      </div>

      {/* Post Image Section */}
      <div className="px-4 pb-1 border-l border-gray-400 ml-10">
        <p className="font-semibold text-white">{postCaption}</p>
        <img
          className="mt-3 rounded-md"
          src={postImage}
          alt="Post"
          style={{ width: "400px", height: "350px", objectFit: "cover" }}
        />
      </div>

      {/* Like, Comment, Share Section */}
      <div className="flex flex-col p-4">
        <div className="flex items-center gap-1 mb-1 ml-3">
          {post?.likes.includes(pos=>pos===authorId) ? (
            <FaHeart
              className="mr-2 text-red-500 cursor-pointer"
              size={22}
              onClick={() => handleDislike(postId)}
            />
          ) : (
            <FaHeart
              className="text-white mr-2 cursor-pointer"
              size={22}
              onClick={() => handleLike(postId)}
            />
          )}
          <FaComment
            className="text-white mr-2 cursor-pointer hover:text-gray-300"
            size={22}
            onClick={()=>toggleModal(post._id)}
          />
          <FaShare
            size={22}
            className="text-white mr-2 hover:text-gray-300 cursor-pointer"
          />
        </div>

        <div className="text-gray-400 ml-3">
          <p>
            {like} Likes
          </p>
        </div>
        {isModalOpen && (
          <div
            ref={modalRef}
            className="py-4  absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded shadow-lg w-1/2 overflow-y-auto overflow-x-hidden no-scrollbar"
            style={{
              backdropFilter: "blur(20px)",
              background: "rgba(000,000,000, 0.8)",
            }}
          >
            <div className="flex justify-between border-b border-gray-300 pb-3 px-8 items-center mb-4">
              <h2 className="text-xl text-white">Comments</h2>
              <FaTimes
                className="text-white text-xl cursor-pointer"
                onClick={toggleModal}
              />
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              <input
                type="text"
                className="form-control bg-gray-300 w-[70%]"
                placeholder="Say Something..."
                value={comment}
                onChange={(e)=>setComment(e.target.value)}
              />
              <button className="btn bg-gray-200" onClick={()=>handleComment()}>
                <IoMdSend size={26} />
              </button>
            </div>

            <div className="border-white-400 max-h-80 overflow-y-auto no-scrollbar">
            {!currentComments || currentComments.length === 0 ? (
              <p className="text-light text-center">No Comments!</p>
            ) : (
              currentComments.map((comment, index) => {
                const authorNow = currentAuthors.find(
                  (author) => author._id === comment.author
                );
                return (
                  <CommentCard
                    key={index}
                    image={authorNow.profileImg}
                    userName={authorNow ? authorNow.username : "Unknown Author"}
                    postCaption={comment.content}
                  />
                );
              })
            )}
              {/* Add more CommentCard components as needed */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;

import { React, useState } from "react";
import {
  FaEllipsisH,
  FaHeart,
  FaComment,
  FaShare,
  FaTimes,
} from "react-icons/fa";
import user from "../../../assets/user.png";
import CommentCard from "../CommentCard/CommentCard";
import "./PostCard.css";
import { useClickAway } from "../../../hooks/useClickAway";
const PostCard = ({
  userName,
  time,
  postCaption,
  postImage,
  likeCount,
  likedUserName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useClickAway(() => {
    console.log("Clicked!");
    setIsModalOpen(false);
  });
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="rounded-md overflow-hidden mx-3 glass-effect my-3">
      {/* User Profile Section */}
      <div className="flex items-center p-4">
        <img
          className="w-12 h-12 rounded-full mr-4"
          src={user}
          alt="User Profile"
        />
        <div>
          <p className="font-semibold text-white">{userName}</p>
        </div>
        <div className="ml-auto items-center flex justify-between gap-4">
          <p className="text-xs text-white mr-2">{time} ago</p>
          <FaEllipsisH className="text-white" />
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
          <FaHeart
            className="text-white mr-2 hover:text-red-500 cursor-pointer"
            size={22}
          />
          <FaComment
            className="text-white mr-2 cursor-pointer hover:text-gray-300"
            size={22}
            onClick={toggleModal}
          />
          <FaShare
            size={22}
            className="text-white mr-2 hover:text-gray-300 cursor-pointer"
          />
        </div>

        <div className="text-gray-400 ml-3">
          <p>
            {likeCount} Likes by - {likedUserName}
          </p>
        </div>
        {isModalOpen && (
          <div
            ref={modalRef}
            className="py-4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded shadow-lg w-1/2 overflow-y-auto overflow-x-hidden no-scrollbar"
            style={{
              backdropFilter: "blur(20px)",
              background: "rgba(999,999,999, 0.2)",
            }}
          >
            <div className="flex justify-between border-b border-gray-300 pb-3 px-8 items-center mb-4">
              <h2 className="text-xl">Comments</h2>
              <FaTimes
                className="text-black text-xl cursor-pointer"
                onClick={toggleModal}
              />
            </div>
            <div className="border-white-400 max-h-80 overflow-y-auto no-scrollbar">
              <CommentCard
                userName="John Doe"
                postCaption="This is a comment caption"
              />
              <CommentCard
                userName="Jane Smith"
                postCaption="This is another comment caption"
              />
              <CommentCard
                userName="Alice Johnson"
                postCaption="Yet another comment caption"
              />
              <CommentCard
                userName="Bob Brown"
                postCaption="And another one!"
              />
              {/* Add more CommentCard components as needed */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;

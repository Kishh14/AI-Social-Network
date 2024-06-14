import React from "react";
import user from "../../../assets/user.png";
const CommentCard = ({ userName, postCaption }) => {
  return (
    <div className="mb-7 px-8">
      <div className="flex items-center">
        <img
          className="w-10 h-10 rounded-full mr-4"
          src={user}
          alt="User Profile"
        />
        <p className="font-semibold text-white">{userName}</p>
      </div>
      <div className="pl-4 border-white-400 ml-10">
        <p className="font-semibold text-gray-300">{postCaption}</p>
      </div>
    </div>
  );
};

export default CommentCard;

import React from "react";
import user from "../../../../assets/user.png";

const FollowCard = ({ userName }) => {
  return (
    <>
      <div className="p-2 flex items-center ">
        <img src={user} alt="" className="h-7 w-7" />
        <p className="text-white font-semibold ml-2">{userName}</p>
        <button className="text-white bg-blue-500 hover:shadow-lg hover:border hover:border-white rounded btn ml-auto">
          Follow
        </button>
      </div>
    </>
  );
};

export default FollowCard;

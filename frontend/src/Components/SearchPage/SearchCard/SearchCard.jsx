import React from "react";
import user from "../../../assets/user.png";
import './SearchCard.css'
const SearchCard = ({ userName, followedBy }) => {
  return (
    <>
      <div className="p-3 flex justify-between items-center gap-2">
        <img src={user} alt="" className="h-12 w-12" />
        <div className="">
          <p className="text-white font-semibold ml-2">{userName}</p>
          <p className="text-gray-300 font-semibold ml-2">{followedBy}</p>
        </div>

        <button className="text-white bg-blue-500 hover:shadow-lg hover:border hover:border-white rounded btn ml-auto">
          Follow
        </button>
      </div>
    </>
  );
};

export default SearchCard;

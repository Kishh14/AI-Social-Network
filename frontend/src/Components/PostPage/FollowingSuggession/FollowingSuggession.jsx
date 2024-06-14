import { RiUserFollowFill } from "react-icons/ri";
import React from "react";
import FollowCard from "./FollowCard/FollowCard";

const FollowingSuggession = () => {
  return (
    <>
      <div className="p-4 flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <RiUserFollowFill size={23} color="white" />
          <p className="text-white" style={{ fontSize: "20px" }}>
            Follow suggestions
          </p>
        </div>
      </div>

      <div className="p-4 flex flex-col px-3">
        <FollowCard userName="John Doe" />
        <FollowCard userName="Jack Sparrow" />
      </div>
    </>
  );
};

export default FollowingSuggession;

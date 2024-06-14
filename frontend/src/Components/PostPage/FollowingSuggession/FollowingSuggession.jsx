import React from "react";
import FollowCard from "./FollowCard/FollowCard";

const FollowingSuggession = () => {
  return (
    <>
      <div className="p-4 flex justify-between items-center ml-4">
        <p className="text-white" style={{ fontSize: "20px" }}>
          Follow suggestions
        </p>
        <button className="rounded bg-gray-500 py-1 px-3 text-white">
          View All
        </button>
      </div>

      <div className="p-4 flex flex-col ml-4">
        <FollowCard userName="John Doe" />
        <FollowCard userName="Jack Sparrow" />
      </div>
    </>
  );
};

export default FollowingSuggession;

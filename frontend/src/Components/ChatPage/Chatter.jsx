import React from "react";

const Chatter = ({ searchResult, handleMessageContainer }) => {
  return (
    <div
      onClick={() => handleMessageContainer(searchResult.username)}
      className="flex items-center mb-4 cursor-pointer hover:bg-gray-200 p-2 rounded-lg"
    >
      <img
        src={searchResult.profileImg || "/path/to/default/image.jpg"}
        alt="user"
        className="h-9 w-9 mr-4 rounded-full"
      />
      <div>
        <strong className="block">{searchResult.username}</strong>
        <p>{searchResult.email}</p>
      </div>
    </div> 
  );
};

export default Chatter;

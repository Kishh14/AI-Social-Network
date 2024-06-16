import React, { useState, useEffect } from "react";
import ChatPage from "./ChatPage";
import Chatter from "./Chatter";
import { FaRegEdit } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { FaRegCircle } from "react-icons/fa";
const Messenger = ({
  accounts,
  performSearch,
  socket,
  chatter,
  handleSearchChange,
  searchQuery,
  handleSearch,
  showSearch,
  chatterRendered,
  currentUser,
}) => {
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [chatKey, setChatKey] = useState(0);

  useEffect(() => {
    const handleMessageResponse = () => {
      setChatKey((prevKey) => prevKey + 1);
    };

    socket.on("messageResponse", handleMessageResponse);

    return () => {
      socket.off("messageResponse", handleMessageResponse);
    };
  }, [socket]);

  const handleMessageContainer = (recipient) => {
    setSelectedRecipient(recipient);
  };

  const renderChatter = () => {
    const seenEmails = new Set();

    return chatter
      .filter((chatterData) => chatterData.name !== currentUser)
      .map((chatterData, index) => {
        const isDuplicate = seenEmails.has(chatterData.email);
        seenEmails.add(chatterData.email);

        if (isDuplicate) return null;

        return (
          <div
            key={index}
            onClick={() => handleMessageContainer(chatterData.name)}
            className="flex items-center mb-4 cursor-pointer hover:bg-gray-900 p-2 rounded-lg"
          >
            <img
              src={chatterData.profileImg || "/path/to/default/image.jpg"}
              alt="user"
              className="h-9 w-9 mr-4 rounded-full"
            />
            <div>
              <strong className="block">{chatterData.name}</strong>
              <p>{chatterData.email}</p>
            </div>
          </div>
        );
      });
  };

  const renderAccounts = () => {
    return accounts.length > 0
      ? accounts.map((chatter, index) => (
          <div key={index}>
            <Chatter
              id={index}
              handleMessageContainer={handleMessageContainer}
              searchResult={chatter}
              userImage="/path/to/default/image.jpg"
              socket={socket}
            />
          </div>
        ))
      : null;
  };

  return (
    <div className="flex justify-center items-center mx-9 mt-3 rounded-lg">
      <div className="flex w-full rounded-lg shadow-lg overflow-hidden glass-effect">
        <div className="w-1/3 shadow-2xl text-white p-4 relative border-r border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold">{currentUser}</span>
            {!showSearch ? (
              <FaRegEdit
                className="text-2xl cursor-pointer"
                onClick={handleSearch}
                size={28}
              />
            ) : (
              <div className="absolute top-[8vh] left-[35px] flex items-center">
                <input
                  type="text"
                  className="border-gray-800 p-2 form-control inline rounded-lg rounded-r-none shadow-md"
                  placeholder="Search username..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button
                  className="border-none w-[125px] bg-blue-700 hover:bg-blue-900 text-white rounded-tr-none rounded-br-none p-2"
                  onClick={performSearch}
                >
                  Search
                </button>
                <button
                  className="border-none p-2 bg-red-800 hover:bg-red-900 text-white w-12 rounded-md rounded-tl-none rounded-bl-none"
                  onClick={handleSearch}
                >
                  X
                </button>
              </div>
            )}
          </div>
          <div className="overflow-y-auto mt-[50px] h-[100vh]">
            {renderAccounts()}
            {!chatterRendered && chatter.length > 0 ? (
              <div>{renderChatter()}</div>
            ) : (
              <p className="relative top-[250px] text-center text-gray-400"></p>
            )}
          </div>
        </div>
        <div className="w-2/4 flex flex-col items-center justify-center p-8">
          {selectedRecipient ? (
            <ChatPage
              key={chatKey}
              socket={socket}
              recipient={selectedRecipient}
            />
          ) : (
            <div className="text-center text-gray-200">
              <FaRegCircle
                className="text-gray-300 flex m-auto"
                style={{
                  fontSize: "70px",
                }}
              />
              <FiSend
                className="flex m-auto text-gray-200 translate-y-[-160%]"
                style={{
                  fontSize: "30px",
                }}
              />
              <h2 className="text-2xl font-bold mb-2">Your Messages</h2>
              <p>Send private messages or video chat wtih a friend.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messenger;

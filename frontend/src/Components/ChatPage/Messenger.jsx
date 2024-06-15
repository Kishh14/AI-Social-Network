import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaRegEdit } from "react-icons/fa";
import ChatPage from "./ChatPage";
import Chatter from "./Chatter";
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
  currentUser
}) => {
  const [messages, setMessages] = useState({});
  const [username, setUsername] = useState(
    sessionStorage.getItem("username") || ""
  );
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [chatKey, setChatKey] = useState(0); 

  useEffect(() => {
    socket.on("messageResponse", (message) => {
      setMessages((prevMessages) => ({
        ...prevMessages
      }));
      setChatKey((prevKey) => prevKey + 1); 
    });
    return () => {
      socket.off("messageResponse");
    };
  }, [socket, currentUser]);

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
            className="flex items-center mb-4 cursor-pointer hover:bg-gray-200 p-2 rounded-lg"
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
    <div className="min-h-screen w-[70vw] flex justify-center items-center bg-gradient-to-r from-blue-400 to-purple-600 p-8 rounded-lg">
      <div className="flex w-full h-[95vh] max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-1/3 h-[100vh] bg-gray-100 p-4 relative">
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold">{username}</span>
            {showSearch ? (
              <FaRegEdit
                className="text-2xl cursor-pointer"
                onClick={handleSearch}
                size={28}
              />
            ) : (
              <div className="absolute top-[15vh] left-[35px]">
                <input
                  type="text"
                  className="border-gray-800 rounded-lg mr-8 shadow-md"
                  placeholder="Search username..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button
                  className="border-none w-[125px] mt-2 bg-blue-700 hover:bg-blue-900 text-white rounded-md rounded-tr-none rounded-br-none p-1"
                  onClick={performSearch}
                >
                  Search
                </button>
                <button
                  className="border-none mt-2 bg-red-600 hover:bg-red-900 text-white p-1 w-12 rounded-md rounded-tl-none rounded-bl-none"
                  onClick={handleSearch}
                >
                  X
                </button>
              </div>
            )}
          </div>
          <div className="overflow-y-auto mt-[100px] h-[100vh]">
            {renderAccounts()}
            {!chatterRendered && chatter.length > 0 ? (
              <div>{renderChatter()}</div>
            ) : (
              <p className="relative top-[250px] text-center text-gray-400"></p>
            )}
          </div>
        </div>
        <div className="w-2/3 flex flex-col items-center justify-center p-8 bg-gray-50">
          {selectedRecipient && (
            <ChatPage
              key={chatKey} // Update key prop for re-rendering
              socket={socket}
              recipient={selectedRecipient}
              messages={messages[selectedRecipient] || []}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Messenger;

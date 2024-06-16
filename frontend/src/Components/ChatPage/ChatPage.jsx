import React, { useEffect, useState, useRef } from "react";
import ChatFooter from "./ChatFooter";
import ChatBody from "./ChatBody";
import { FaVideo } from "react-icons/fa";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useNavigate } from "react-router-dom";
const ChatPage = ({ socket, recipient }) => {
  const [localMessages, setLocalMessages] = useState([]);
  const [typing, setTyping] = useState("");
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const lastMessageRef = useRef(null);
  const videoCallContainerRef = useRef(null);
  const zegoRef = useRef(null);
  const navigate = useNavigate();
  const generateRoomId = (user1, user2) => {
    return [user1, user2].sort().join("-");
  };

  const handleVideo = async () => {
    const appID = 1665605466;
    const serverSecret = "43702c120437b5301a7d484678da4c7c";
    const username = sessionStorage.getItem("username");
    const roomId = generateRoomId(username, recipient);
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(),
      username
    );
    const zego = ZegoUIKitPrebuilt.create(kitToken);
    zegoRef.current = zego;
    zego.joinRoom({
      container: videoCallContainerRef.current,
      onLeaveRoom: () => window.location.reload(),
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
    });
    setIsVideoCallActive(true);
  };

  const handleCloseVideo = () => {
    if (zegoRef.current) {
      zegoRef.current.destroy();
      zegoRef.current = null;
    }
    setIsVideoCallActive(false);
  };

  const emitCallingMessage = () => {
    const username = sessionStorage.getItem("username");
    const messageData = {
      sender: username,
      recipient: recipient,
      text: `${username} is calling you 🤙`,
      timestamp: new Date().toISOString(),
    };
    socket.emit("message", messageData);
  };

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    if (username) {
      socket.emit("userConnected", username);
    }

    const handleNewMessage = (data) => {
      if (data.recipient === recipient || data.name === recipient) {
        setLocalMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    const handleTyping = (data) => setTyping(data.typing);

    const handleMessageHistory = (data) => {
      const relevantMessages = data.filter(
        (message) =>
          message.recipient === recipient || message.name === recipient
      );
      setLocalMessages(relevantMessages);
    };

    socket.on("messageResponse", handleNewMessage);
    socket.on("typingResponse", handleTyping);
    socket.on("messageHistory", handleMessageHistory);

    return () => {
      socket.off("messageResponse", handleNewMessage);
      socket.off("typingResponse", handleTyping);
      socket.off("messageHistory", handleMessageHistory);
    };
  }, [socket, recipient]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView();
  }, [localMessages]);

  useEffect(() => {
    if (isVideoCallActive) {
      emitCallingMessage();
    }
  }, [isVideoCallActive]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 to-purple-600">
      <div className="w-[600px] h-[95vh] max-w-4xl p-4 absolute top-8 rounded-lg bg-white bg-opacity-10 shadow-lg">
        <FaVideo
          onClick={handleVideo}
          className="absolute top-0 right-8 my-1 text-2xl text-gray-200 hover:text-green-500 cursor-pointer"
        />
        <ChatBody
          messages={localMessages}
          lastMessageRef={lastMessageRef}
          typing={typing}
          isVideoCallActive={isVideoCallActive}
          videoCallContainerRef={videoCallContainerRef}
          handleCloseVideo={handleCloseVideo}
        />
        {!isVideoCallActive && (
          <ChatFooter
            socket={socket}
            handleSendMessage={(messageData) => {
              setLocalMessages((prevMessages) => [
                ...prevMessages,
                messageData,
              ]);
              socket.emit("message", messageData);
            }}
            recipient={recipient}
          />
        )}
      </div>
    </div>
  );
};

export default ChatPage;

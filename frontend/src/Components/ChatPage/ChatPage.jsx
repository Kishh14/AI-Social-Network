import React, { useEffect, useState, useRef } from "react";
import ChatFooter from "./ChatFooter";
import ChatBody from "./ChatBody";
import { FaVideo, FaTimes } from "react-icons/fa";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const ChatPage = ({ socket, recipient, messages }) => {
  const [localMessages, setLocalMessages] = useState(messages);
  const [typing, setTyping] = useState("");
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const lastMessageRef = useRef(null);
  const videoCallContainerRef = useRef(null);
  const zegoRef = useRef(null);

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
    const messageData = {
      sender: username,
      recipient: recipient,
      text: `${username} is calling you 🤙`,
      timestamp: new Date().toISOString(),
    };
    socket.emit("message", messageData);
  };

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  const handleSendMessage = (messageData) => {
    // Add the sender's message to local messages
    setLocalMessages((prevMessages) => [...prevMessages, messageData]);
    // Emit the message to the server
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
      <div className="w-[600px] h-[95vh] rounded-tl-none rounded-bl-none max-w-4xl p-4 absolute top-8 rounded-lg bg-white shadow-lg">
        <FaVideo
          onClick={handleVideo}
          className="absolute top-0 right-8 text-2xl text-gray-600 hover:text-green-500 cursor-pointer"
        />
        {isVideoCallActive && (
          <div className="relative w-full h-full">
            <FaTimes
              onClick={handleCloseVideo}
              className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-red-500 cursor-pointer"
            />
            <div
              ref={videoCallContainerRef}
              className="w-full h-full bg-black"
            ></div>
          </div>
        )}
        {!isVideoCallActive && (
          <>
            <ChatBody
              messages={localMessages}
              lastMessageRef={lastMessageRef}
              typing={typing}
            />
            <ChatFooter
              socket={socket}
              handleSendMessage={handleSendMessage}
              recipient={recipient}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

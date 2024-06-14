import React, { useEffect, useState, useRef } from "react";
import ChatFooter from "./ChatFooter";
import ChatBody from "./ChatBody";

const ChatPage = ({ socket, recipient, messages }) => {
  const [localMessages, setLocalMessages] = useState(messages);
  const [typing, setTyping] = useState("");
  const lastMessageRef = useRef(null);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  const handleSendMessage = (messageData) => {
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
        (message) => message.recipient === recipient || message.name === recipient
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
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 to-purple-600">
      <div className="w-[600px] h-[95vh] rounded-tl-none rounded-bl-none max-w-4xl p-4 absolute top-8 rounded-lg bg-white shadow-lg">
        <ChatBody messages={localMessages} lastMessageRef={lastMessageRef} typing={typing} />
        <ChatFooter socket={socket} handleSendMessage={handleSendMessage} recipient={recipient} />
      </div>
    </div>
  );
};

export default ChatPage;

import React, { useState, useRef } from "react";
import { FaMicrophoneAlt } from "react-icons/fa";

const ChatFooter = ({ socket, handleSendMessage, recipient }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const typingTimeoutRef = useRef(null);
  window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new window.SpeechRecognition();
  recognition.interimResults = true;

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { typing: "typing...", recipient });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("typing", { typing: "", recipient });
    }, 1000);
  };

  const handleMic = () => {
    setMicOn(!micOn);
    recognition.start();
    recognition.onresult = (e) => {
      console.log(e.results);
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      setMessage(transcript);
    };
  };

  const onSendMessage = (e) => {
    e.preventDefault();
    const username = sessionStorage.getItem("username");
    if (message.trim() && username) {
      handleSendMessage({ text: message, name:username, recipient:recipient});
      setMessage("");
      setIsTyping(false);
      socket.emit("typing", { typing: "", recipient });
      clearTimeout(typingTimeoutRef.current);
    }
  };

  return (
    <div className="w-full p-2 border-t border-gray-200 bg-white flex items-center justify-between">
      <form className="form w-full flex items-center" onSubmit={onSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message flex-1 p-2 border border-gray-300 rounded-lg outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
        />
        <FaMicrophoneAlt
          onClick={handleMic}
          className="ml-2 text-gray-500 cursor-pointer text-2xl hover:text-gray-900"
        />
        <button
          className="sendBtn ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          SEND
        </button>
      </form>
    </div>
  );
};

export default ChatFooter;

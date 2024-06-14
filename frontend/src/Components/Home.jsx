import React, { useEffect, useState, useMemo } from "react";
import Header from "./Header";
import PostPage from "./PostPage/PostPage";
import SearchPage from "./SearchPage/SearchPage";
import CreatePost from "./CreatePost/CreatePost";
import socketIO from "socket.io-client";
import Messenger from "./ChatPage/Messenger";
import UserProfile from "./UserProfile/UserProfile";
import Explore from "./Explore/Explore";
import axios from "axios";
function Home() {
  const [currentPage, setCurrentPage] = useState("PostPage");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchSidebar, setShowSearchSidebar] = useState(false);
  const [userList, setUserList] = useState({});
  const [chatter, setChatter] = useState(() => {
    const storedChatter = sessionStorage.getItem("chatter");
    return storedChatter ? JSON.parse(storedChatter) : [];
  });
  const [accounts, setAccounts] = useState(JSON.parse(sessionStorage.getItem("accounts")) || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const username = useMemo(() => sessionStorage.getItem("username"), []);
  const [chatterRendered, setChatterRendered] = useState(false);
  const socket = useMemo(() => socketIO.connect("http://localhost:3000"), []);
  const currentUser = sessionStorage.getItem("username");

  // Inside Home component
useEffect(() => {
  console.log("Chatter state initialized:", chatter);
}, []); // Run only once on mount

useEffect(() => {
  console.log("Chatter state updated:", chatter);
}, [chatter]); // Log whenever chatter state changes


  useEffect(() => {
    sessionStorage.setItem("chatter", JSON.stringify(chatter));
    sessionStorage.setItem("accounts", JSON.stringify(accounts));
  }, [chatter, accounts]);
  useEffect(() => {
    console.log("Setting up Home component...");

    socket.on("messageResponse", (message) => {
      if (message.recipient === currentUser) {
        setChatterRendered(false);
      }
      if (message.sender !== username) {
        setChatter((prevChatter) => {
          const exists = prevChatter.some((chat) => chat.name !== message.name);
          if (!exists) {
            return [...prevChatter, message];
          }
          return prevChatter;
        });
      }
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      if (username) {
        console.log(`Emitting userConnected for ${username}`);
        socket.emit("userConnected", username);
      }
    });

    socket.on("userList", (users) => {
      setUserList(Object.fromEntries(users));
      console.log("Connected users:", Object.fromEntries(users));
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      console.log("Cleaning up Home component...");
      socket.disconnect();
    };
  }, [socket, username]);

  const performSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/messageSearch/${searchQuery}`
      );
      setSearchResults(response.data);
      console.log(response.data);
      setAccounts((prev) => [...prev, response.data]);
      handleSearch();
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleSearch = () => {
    setShowSearch(!showSearch);
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  return (
    <div className="flex items-center body-image">
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setShowSearchSidebar={setShowSearchSidebar}
        showSearchSidebar={showSearchSidebar}
      />
      <SearchPage showSearchSidebar={showSearchSidebar} />

      {currentPage === "PostPage" ? (
        <PostPage socket={socket} />
      ) : currentPage === "SearchPage" ? (
        <SearchPage />
      ) : currentPage === "CreatePost" ? (
        <CreatePost />
      ) : currentPage === "ChatPage" ? (
        <Messenger
          socket={socket}
          handleSearch={handleSearch}
          showSearch={showSearch}
          chatter={chatter}
          accounts={accounts}
          performSearch={performSearch}
          handleSearchChange={handleSearchChange}
          searchQuery={searchQuery}
          chatterRendered={chatterRendered}
          currentUser={currentUser}
        />
      ) : currentPage === "UserProfile" ? (
        <UserProfile />
      ) : currentPage === "Explore" ? (
        <Explore />
      ) : null}
    </div>
  );
}

export default Home;
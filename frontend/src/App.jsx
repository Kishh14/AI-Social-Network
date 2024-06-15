import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useMemo, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import socketIO from "socket.io-client";
import Messenger from "./Components/ChatPage/Messenger";
import VideoGen from "./Components/PostPage/VideoGen/VideoGen";
import Authentication from "./Components/AuthenticationPage/Authentication";
import UserProfile from "./Components/UserProfile/UserProfile";
import { trpc } from "./lib/trpc";
import LandingPage from "./Components/LandingPage/LandingPage";
import Header from "./Components/Header";
import SearchPage from "./Components/SearchPage/SearchPage";
import Explore from "./Components/Explore/Explore";
import PostPage from "./Components/PostPage/PostPage";
import CreatePost from "./Components/CreatePost/CreatePost";

function App() {
  const [showSearchSidebar, setShowSearchSidebar] = useState(false);
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/trpc",
        }),
      ],
    })
  );

  const socket = useMemo(() => socketIO.connect("http://localhost:4000"), []);
  const [currentPage, setCurrentPage] = useState("PostPage");
  const [searchResults, setSearchResults] = useState([]);
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
        `http://localhost:4000/api/messageSearch/${searchQuery}`
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
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <main className="flex overflow-x-hidden no-scrollbar">
            <Header
              showSearchSidebar={showSearchSidebar}
              setShowSearchSidebar={setShowSearchSidebar}
            />
            <SearchPage showSearchSidebar={showSearchSidebar} />
            <div className="App flex-1 overflow-x-hidden">
              <Routes>
                <Route path="/" element={<PostPage socket={socket} />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/createPost" element={<CreatePost />} />
                <Route
                  path="/messenger"
                  element={
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
                  }
                />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/profile/:name" element={<UserProfile />} />
                <Route path="/videoGen" element={<VideoGen />} />
                <Route path="/authentication" element={<Authentication />} />
                <Route path="/LandingPage" element={<LandingPage />} />
              </Routes>
            </div>
          </main>
        </Router>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;

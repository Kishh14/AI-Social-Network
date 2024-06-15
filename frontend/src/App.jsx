import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import socketIO from "socket.io-client";

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

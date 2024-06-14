import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import VideoGen from "./Components/PostPage/VideoGen/VideoGen";
import Home from "./Components/Home";
import Authentication from "./Components/AuthenticationPage/Authentication";
import UserProfile from "./Components/UserProfile/UserProfile";
import { trpc } from './lib/trpc';
import LandingPage from './Components/LandingPage/LandingPage';

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/trpc',
        }),
      ],
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home  />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/profile/:name" element={<UserProfile />} />
              <Route path="/videoGen" element={<VideoGen />} />
              <Route path="/authentication" element={<Authentication />} />
              <Route path="/LandingPage" element={<LandingPage />} />
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import PostCard from "./postCard/PostCard";
import Notification from "./Notification/Notification";
import FollowSuggestion from "./FollowingSuggession/FollowingSuggession";
import "./PostPage.css";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

function PostPage({ socket, setIsLandingPage }) {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const page = window.location.pathname === "/";
    setIsLandingPage(page);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all users first
      const userResponse = await axios.get(`${import.meta.env.VITE_API_USER_URL}/getAllUsers`);
      const allUsers = userResponse.data.allUsers;
      setUsers(allUsers);

      // Fetch all posts
      const postResponse = await axios.get(`${import.meta.env.VITE_API_USER_URL}/allPosts`);
      const filteredPosts = postResponse.data.posts.filter(post => post.image !== null);
      setPosts(filteredPosts);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <main className="w-full flex" style={{ height: "100vh" }}>
        <div
          className="main-div w-3/4 border-r border-gray-400 flex flex-col"
          style={{ height: "100%" }}
        >
          <div
            className="post-card overflow-y-auto flex-grow no-scrollbar"
          >
            {posts?.map((post) => {
              const likeText =
                post.likes.length > 3
                  ? `Alice, Bob and ${post.likes.length - 2} others`
                  : post.likes.length === 3
                  ? `Alice, Bob and ${post.likes.length - 2} other`
                  : post.likes.length === 2
                  ? `Alice and Bob`
                  : post.likes.length === 1
                  ? `Alice`
                  : "";

              const postUser = users?.find(user => user._id === post.author);
              const timeAgo = postUser ? formatDistanceToNow(new Date(post.createdAt)) : "";
              
              return (
                <PostCard
                  key={post._id}
                  userName={postUser ? postUser.username : "Unknown User"}
                  time={timeAgo}
                  postCaption={post.content}
                  postImage={post.image}
                  likeCount={post.likes.length}
                  likedUserName={likeText}
                  authorId={post.author}
                  userImage={postUser?.profileImg}
                  postId={post._id}
                  post={post}
                  fetchData={fetchData}
                />
              );
            })}
          </div>
        </div>
        <div className="w-1/4 glass-effect no-scrollbar overflow-y-hidden">
          <div className="border-b overflow-y-scroll h-[350px] border-gray-400 no-scrollbar">
            <Notification socket={socket} />
          </div>

          <FollowSuggestion />
        </div>
      </main>
    </>
  );
}

export default PostPage;

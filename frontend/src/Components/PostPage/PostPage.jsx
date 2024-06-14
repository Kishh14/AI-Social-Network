import React from "react";
import PostCard from "./postCard/PostCard";
import Notification from "./Notification/Notification";
import FollowSuggestion from "./FollowingSuggession/FollowingSuggession";
import "./PostPage.css";
import NewPost from "./NewPost/NewPost";
function PostPage({ socket }) {
  return (
    <>
      <main className="w-full flex" style={{ height: "100vh" }}>
        <div
          className="main-div w-3/4 border-r border-gray-400 flex flex-col"
          style={{ height: "100%" }}
        >
          {/* <div className="story-bar flex items-center space-x-6 p-5 m-2 overflow-x-auto overflow-y-hidden no-scrollbar">
            <img src={user} alt="" className="h-14 w-14 mt-5 mb-2" />
            <img src={user} alt="" className="h-14 w-14 mt-5 mb-2" />
            <img src={user} alt="" className="h-14 w-14 mt-5 mb-2" />
            <img src={user} alt="" className="h-14 w-14 mt-5 mb-2" />
            <img src={user} alt="" className="h-14 w-14 mt-5 mb-2" />
            <img src={user} alt="" className="h-14 w-14 mt-5 mb-2" />
            <img src={user} alt="" className="h-14 w-14 mt-5 mb-2" />
            <img src={user} alt="" className="h-14 w-14 mt-5 mb-2" />
            <img src={user} alt="" className="h-14 w-14 mt-5 mb-2" />
            <img src={user} alt="" className="h-14 w-14 mt-5 mb-2" />
            <img src={user} alt="" className="h-14 w-14 mt-5 mb-2" />
            <img src={user} alt="" className="h-14 w-14 mt-5 mb-2" />
          </div> */}

          <div
            className="post-card overflow-y-auto flex-grow no-scrollbar"
            // style={{ maxHeight: "calc(100vh - 180px)" }}
          >
            <NewPost />
            <PostCard
              userName="John Doe"
              time="6m"
              postCaption="This is a post caption"
              postImage={
                "https://i.pinimg.com/564x/33/e1/cc/33e1cc97ea4cf9f119e5873def4658a7.jpg"
              }
              likeCount={1300}
              likedUserName="Alice, Bob and 8 others"
            />
            <PostCard
              userName="John Doe"
              time="6m"
              postCaption="This is a post caption"
              postImage={
                "https://i.pinimg.com/564x/33/e1/cc/33e1cc97ea4cf9f119e5873def4658a7.jpg"
              }
              likeCount={2550}
              likedUserName="Alice, Bob and 8 others"
            />
          </div>
        </div>
        <div className="w-1/4 glass-effect">
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

import { TiTickOutline } from "react-icons/ti";
import { BiEditAlt } from "react-icons/bi";
import React, { useState } from "react";
import user from "../../assets/user.png";
import { FaComment, FaHeart, FaShare } from "react-icons/fa";
import CaptionGen from "./CaptionGen/CaptionGen";

function PostPreview({ imageUrl, caption, video, currentTool, setCaption }) {
  const [isEditingCaption, setIsEditingCaption] = useState(false);

  return (
    <section className="text-white w-[550px]">
      <div className="rounded-md overflow-hidden mx-10">
        {/* User Profile Section */}
        <div className="flex items-center p-4">
          <img
            className="w-12 h-12 rounded-full mr-4"
            src={user}
            alt="User Profile"
          />
          <div>
            <p className="font-semibold text-white">{"John Doe"}</p>
          </div>
          <div className="ml-auto items-center flex justify-between gap-4"></div>
        </div>

        {/* Post Image Section */}
        <div className="px-4 pb-1 border-l border-gray-400 ml-10">
          <div className="flex justify-between items-end">
            {/* If not editing the caption, show caption else show input */}
            {!isEditingCaption ? (
              <p className="font-semibold text-white pr-2">{caption}</p>
            ) : (
              <input
                className="bg-transparent outline-none w-full mr-3 pr-3 p-1"
                style={{ borderBottom: "1px solid gray" }}
                type="text"
                placeholder="Edit Caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            )}

            {/* Generate the captions only for Images else let the user add caption manually */}
            {currentTool === "ImageGen" ? (
              <div className="flex flex-col gap-1">
                <CaptionGen setCaption={setCaption} imageUrl={imageUrl} />
                <button className="btn text-white border-0">
                  {!isEditingCaption ? (
                    <BiEditAlt
                      size={24}
                      onClick={() => setIsEditingCaption(!isEditingCaption)}
                    />
                  ) : (
                    <TiTickOutline
                      size={24}
                      onClick={() => setIsEditingCaption(!isEditingCaption)}
                    />
                  )}
                </button>
              </div>
            ) : (
              <button className="btn text-white border-0">
                {!isEditingCaption ? (
                  <BiEditAlt
                    size={24}
                    onClick={() => setIsEditingCaption(!isEditingCaption)}
                  />
                ) : (
                  <TiTickOutline
                    size={24}
                    onClick={() => setIsEditingCaption(!isEditingCaption)}
                  />
                )}
              </button>
            )}
          </div>

          {/* Change the post type according to the tool */}
          {currentTool === "ImageGen" ? (
            <img
              className="mt-3 rounded-md"
              src={imageUrl}
              alt="Post"
              style={{ width: "400px", height: "350px", objectFit: "cover" }}
            />
          ) : currentTool === "VideoGen" ? (
            <video
              src={video}
              controls
              loop
              className="mt-3 rounded-md"
              style={{ width: "400px", height: "320px", objectFit: "cover" }}
            />
          ) : currentTool === "MemeGen" ? (
            <img
              className="mt-3 rounded-md"
              src={imageUrl}
              alt="Post"
              style={{ width: "400px", height: "350px", objectFit: "cover" }}
            />
          ) : null}
        </div>

        {/* Like, Comment, Share Section */}
        <div className="flex flex-col p-4">
          <div className="flex items-center gap-1 mb-1 ml-3">
            <FaHeart className="text-gray-400 mr-2" size={22} />
            <FaComment className="text-gray-400 mr-2" size={22} />
            <FaShare size={22} className="text-gray-400 mr-2" />
          </div>

          <div className="text-gray-400 ml-3">
            <p>
              {1000} Likes by - {"Alice, Bob and 9998 others"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PostPreview;

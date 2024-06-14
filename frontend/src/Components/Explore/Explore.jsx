import { useState } from "react";
import Carousel from "./Carousel/Carousel";
import "./Explore.css";

function Explore() {
  const [posts] = useState([
    { image: "https://placeholder.co/400x400" },
    { image: "https://placeholder.co/400x400" },
    { image: "https://placeholder.co/400x400" },
  ]);

  const handlePostClick = () => {
    // Redirect the user to the respective user's profile
  };

  return (
    <div className="w-full h-screen overflow-hidden px-4">
      <div className="mx-auto h-full overflow-y-scroll no-scrollbar">
        <Carousel />

        {/* Post Grid */}
        <div className="flex gap-5 glass-effect rounded flex-wrap justify-center my-4 py-8">
          {posts?.map((post) => {
            return (
              <div key={post._id} className="w-[400px] h-[300px]">
                {post.image && (
                  <img
                    src={post.image}
                    alt={`Image ${post._id}`}
                    className="image rounded-md w-full h-full"
                    onClick={handlePostClick}
                  />
                )}
                {post.video && (
                  <video
                    className="image rounded-md w-full h-full"
                    src={post.video}
                    muted
                    controls
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* <ImageGrid
          imageUrls={[
            "https://source.unsplash.com/random/6",
            "https://source.unsplash.com/random/7",
            "https://source.unsplash.com/random/8",
            "https://source.unsplash.com/random/9",
            "https://source.unsplash.com/random/10",
            "https://source.unsplash.com/random/11",
            "https://source.unsplash.com/random/12",
            "https://source.unsplash.com/random/13",
            "https://source.unsplash.com/random/15",
          ]}
        /> */}
      </div>
    </div>
  );
}

export default Explore;

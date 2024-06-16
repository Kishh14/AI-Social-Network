import { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom'
import Carousel from "./Carousel/Carousel";
import "./Explore.css";
import axios from 'axios'

function Explore() {
  const [posts,setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const resp = await axios.get(`${import.meta.env.VITE_API_USER_URL}/allPosts`);
        let topPost = resp.data.posts;
        topPost = topPost.filter(post=>post.isMedia===true&&post.video===null)
        setPosts(topPost);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = async(authorId) => {
    const author = await axios.get(`${import.meta.env.VITE_API_USER_URL}/${authorId}/getbyid`);
    navigate(`/profile/${author.data.user.username}`);
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
                    className="image rounded-md w-full h-full cursor-pointer"
                    onClick={()=>handlePostClick(post.author)}
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

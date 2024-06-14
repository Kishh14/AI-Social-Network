import Carousel from "./Carousel/Carousel";
import ImageGrid from "./ImageGrid/ImageGrid";
import "./Explore.css";
import { trpc } from "../../lib/trpc";
function Explore() {
  const { data: posts } = trpc.posts.explorePosts.useQuery();
  return (
    <div className="w-full h-screen overflow-hidden px-4">
      <div className="mx-auto h-full overflow-y-scroll no-scrollbar">
        <Carousel />
        {posts?.map((e) =>
          e.image ? (
            <img key={e._id} src={e.image} />
          ) : (
            <video key={e._id} src={e.video} />
          )
        )}
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

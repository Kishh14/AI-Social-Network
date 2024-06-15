import { useEffect, useState } from "react";
import ImageGen from "./ImageGen/ImageGen";
import "./CreatePost.css";
import PostPreview from "./PostPreview";
import VideoGen from "./VideoGen/VideoGen";
import { trpc } from "../../lib/trpc";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Modal } from "react-bootstrap";
import MemeGen from "./MemeGen/MemeGen";
import { getAllMems } from "./MemeGen/MemeApi";

function CreatePost() {
  const [imageUrl, setImageUrl] = useState("http://placeholder.co/400x300");
  const [caption, setCaption] = useState("Caption will appear here :)");
  const [videoPrompt, setVideoPrompt] = useState("Elon musk riding horse");
  const [video, setVideo] = useState("");
  const [currentTool, setCurrentTool] = useState("ImageGen");
  const [show, setShow] = useState(false);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Fetch Memes
  useEffect(() => {
    getAllMems().then((memes) => setData(memes.data.memes));
    setFilteredData(data);
  }, [filteredData]);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const queryClient = useQueryClient();
  const { mutate } = trpc.posts.createPost.useMutation({
    onSuccess() {
      queryClient.invalidateQueries(["posts"]);
    },
  });
  const userId = useSelector((state) => state.user.user.details._id);

  const [media, setMedia] = useState(null);
  const [mediaPre, setMediaPrev] = useState(null);

  const changeMedia = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (file) {
      const previewURL = URL.createObjectURL(file);
      setMediaPrev(previewURL);
      setMedia(file);
    } else {
      setMediaPrev(null);
      setMedia(null);
    }
  };
  const user = useSelector((state) => state.user.user);
  const reqConfig = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append("image", media);
      formData.append("content", caption);
      await axios.post(
        `${import.meta.env.VITE_API_USER_URL}/uploadImagePost`,
        formData,
        reqConfig
      );
      setImageUrl(mediaPre);
      toast.success("Post uploaded!");
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  const createPost = () => {
    // Code to store the post in the DB
  };

  return (
    <>
      <section className="create-post-container w-screen h-screen">
        <div className="h-full overflow-y-auto px-4 pt-3 no-scrollbar">
          {/* AI Tools Navigation */}
          <div className="flex gap-3 mb-3">
            <button
              className="ai-tools-nav-btn btn bg-purple-700 text-white shadow"
              onClick={() => setCurrentTool("ImageGen")}
            >
              <span className="btn-text">Image Gen</span>
            </button>
            <button
              className="ai-tools-nav-btn btn bg-purple-700 text-white shadow"
              onClick={() => setCurrentTool("VideoGen")}
            >
              <span className="btn-text">Video Gen</span>
            </button>
            <button
              className="ai-tools-nav-btn btn bg-purple-700 text-white shadow"
              onClick={() => setCurrentTool("MemeGen")}
            >
              <span className="btn-text">Meme Gen</span>
            </button>
          </div>

          <div className="AI-container rounded-lg shadow-lg px-5 pt-4 mb-4">
            <div className="flex justify-between">
              {/* AI Tools */}
              <div className="mt-2 w-full">
                {currentTool === "ImageGen" ? (
                  <ImageGen
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    caption={caption}
                  />
                ) : currentTool === "VideoGen" ? (
                  <VideoGen
                    videoPrompt={videoPrompt}
                    setVideoPrompt={setVideoPrompt}
                    video={video}
                    setVideo={setVideo}
                    caption={caption}
                  />
                ) : (
                  <MemeGen data={data} filteredData={filteredData} setFilteredData={setFilteredData} />
                )}
              </div>

              {/* Post Preview (on the right) */}
              {currentTool !== "MemeGen" ? (
                <div className="flex flex-col items-center">
                  <PostPreview
                    imageUrl={imageUrl}
                    caption={caption}
                    video={video}
                    setCaption={setCaption}
                    currentTool={currentTool}
                  />
                </div>
              ) : null}
            </div>

            <div className="py-3">
              {/* <button
                onClick={createPost}
                className="btn px-5 text-center bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg hover:border hover:border-gray-400 mx-auto block mb-3"
              >
                Post Now
              </button> */}
              <div className="flex items-center justify-center">
                <hr
                  style={{
                    borderColor: "white",
                    borderWidth: "1px",
                    width: "30%",
                  }}
                />
                <span className="text-white text-center mx-2">OR</span>
                <hr
                  style={{
                    borderColor: "white",
                    borderWidth: "1px",
                    width: "30%",
                  }}
                />
              </div>

              <button
                onClick={handleShow}
                className="btn text-gray-300 hover:text-gray-200 mt-3 mb-2 mx-auto block"
              >
                Upload from system
              </button>
            </div>
          </div>

          {/* Modal */}
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Body>
              <section className="">
                <p className="text-2xl border-b pb-3 mb-4">
                  Upload Image to Post
                </p>
                <input
                  type="file"
                  name="file"
                  accept=".jpg,.png,.mp4, .jpeg"
                  className="form-control w-[60%] mx-auto block my-2 border-0 outline-none"
                  onChange={changeMedia}
                />

                {/* Image Preview */}
                {mediaPre && (
                  <img
                    src={mediaPre}
                    className="w-[350px] h-[300px] mx-auto block mt-4 rounded"
                  />
                )}

                <button
                  onClick={() => uploadImage()}
                  className="btn px-5 w-[60%] text-white text-center bg-purple-600 mx-auto block mt-4"
                  type="submit"
                >
                  Add
                </button>
              </section>
            </Modal.Body>
          </Modal>
        </div>
      </section>
    </>
  );
}

export default CreatePost;

import { useState } from "react";
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

function CreatePost() {
  const [imageUrl, setImageUrl] = useState("http://placeholder.co/400x300");
  const [caption, setCaption] = useState("Caption will appear here :)");
  const [videoPrompt, setVideoPrompt] = useState("Elon musk riding horse");
  const [video, setVideo] = useState("");
  const [currentTool, setCurrentTool] = useState("ImageGen");
  const [show, setShow] = useState(true);

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
  const savePost = () => {};

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
      formData.append("content", "hello");
      await axios.post(
        `${import.meta.env.VITE_API_USER_URL}/uploadImagePost`,
        formData,
        reqConfig
      );
      toast.success("Post uploaded!");
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <section className="create-post-container w-screen h-screen">
        <div className="h-full overflow-y-auto px-4 pt-3">
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
              <div className="mt-3">
                {currentTool === "ImageGen" ? (
                  <ImageGen imageUrl={imageUrl} setImageUrl={setImageUrl} />
                ) : currentTool === "VideoGen" ? (
                  <VideoGen
                    videoPrompt={videoPrompt}
                    setVideoPrompt={setVideoPrompt}
                    video={video}
                    setVideo={setVideo}
                  />
                ) : (
                  <span className="text-green-400 text-2xl">Coming Soon!!</span>
                )}
              </div>

              {/* Post Preview (on the right) */}
              <div className="flex flex-col items-center">
                <PostPreview
                  imageUrl={imageUrl}
                  caption={caption}
                  video={video}
                  setCaption={setCaption}
                  currentTool={currentTool}
                />
              </div>
            </div>
            <div className="py-3">
              <button
                onClick={savePost}
                className="btn px-5 text-center bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg hover:border hover:border-gray-400 mx-auto block mb-3"
              >
                Post Now
              </button>
              <span className="text-white text-center block">Or</span>
              <button
                onClick={handleShow}
                className="btn text-gray-300 hover:text-gray-200 mt-2 mb-2 mx-auto block"
              >
                Upload from system
              </button>
            </div>
          </div>

          {/* Modal */}
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Body>
              <section className="">
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
                  className="btn px-5 text-center bg-purple-600 mx-auto block mt-4"
                  type="submit"
                >
                  Post
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

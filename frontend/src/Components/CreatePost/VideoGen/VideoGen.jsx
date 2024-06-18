import { FaRandom } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function VideoGen({ setVideoPrompt, videoPrompt, video, setVideo, caption }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const [error, setError] = useState(null);
  const [videoURL, setVideoURL] = useState();

  const textArray = [
    "The AI model is cooking, wait please 🍳",
    "Bss ho gya bhai, 1 minute or...",
    "The AI model is generating, wait please 🤖",
    "Raste me hi hun bhai, dekh aa gaya... 🛣️🚲",
    "Remember great things take time 😉",
    "I'm not lazy, I'm just on energy-saving mode ⚡️",
    "Please wait, I'm trying to be intelligent 🤓",
    "Loading... (just like your patience)",
    "Hold on for me, please 🥹",
    "I'm not slow, I'm just thorough 🔍",
    "The AI model is on a coffee break ☕️",
    "Please hold, I'm experiencing a moment of genius 💡",
    "This is taking longer than expected... whoops 🙈",
    "I'm not stuck, I'm just thinking deeply 🤔",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((currentIndex + 1) % textArray.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const generateVideo = async () => {
    setIsGenerating(true);
    setIsGenerated(false);
    setError(null);

    try {
      const response = await fetch(
        "https://ai-social-network-1-api.onrender.com/generate-video",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoPrompt }),
        }
      );

      const data = await response.json();
      setVideo(data?.videoURL[0]);
      setVideoURL(data?.videoURL[0]);
      setIsGenerating(false);
      setIsGenerated(true);
    } catch (error) {
      setIsGenerated(false);
      setIsGenerating(false);
      console.error(error);
      setError("Failed to generate video");
    } finally {
      setIsGenerating(false);
    }
  };

  const randomVideo = async () => {
    const videoPrompts = [
      "A majestic landscape with a winding river flowing through a lush forest",
      "A cyberpunk city at night, neon signs reflecting in a rainy street",
      "A playful cartoon cat wearing a pirate hat and riding a treasure chest",
      "A vibrant underwater scene with colorful coral reefs and exotic fish",
      "A futuristic cityscape with flying cars and towering skyscrapers",
      "A breathtaking mountain range shrouded in mist at sunrise",
    ];

    const random = Math.floor(Math.random() * 100);
    const randomPrompt = videoPrompts[random % videoPrompts.length];
    setVideoPrompt(randomPrompt);
  };

  const user = useSelector((state) => state.user.user);

  const reqConfig = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const createPost = async () => {
    try {
      const data = {
        aiLink: videoURL,
        content: caption,
      };
      const resp = await axios.post(
        `${import.meta.env.VITE_API_USER_URL}/uploadAIvideoPost`,
        data,
        reqConfig
      );
      toast.success("Post Uploaded!");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="text-white w-[500px] pb-5">
      <h2 className="my-3">Video Generation</h2>
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Enter prompt"
          value={videoPrompt}
          onChange={(e) => setVideoPrompt(e.target.value)}
          cols={5}
          rows={2}
        />
        <button
          className="btn text-purple-300 border-purple-400"
          disabled={isGenerating}
          onClick={generateVideo}
        >
          {isGenerating ? "Generating..." : "Generate"}
        </button>
        <button
          className="btn text-purple-300 border-purple-400"
          onClick={randomVideo}
        >
          <FaRandom size={23} />
        </button>
      </div>

      {isGenerating && (
        <div className="mt-3 glass-effect shadow text-purple-100 text-center py-2 rounded">
          <p>{textArray[currentIndex]}</p>
        </div>
      )}

      <div className="my-4">
        <video
          src={video}
          className="pb-10 object-cover rounded-md"
          style={{ width: "100%", height: "400px" }}
          controls
          loop
        ></video>
      </div>

      <div className="my-3">
        <button
          disabled={!isGenerated}
          onClick={createPost}
          className="btn px-5 text-center bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg hover:border hover:border-gray-400 mx-auto block mb-3"
        >
          Post Now
        </button>
      </div>
    </section>
  );
}

export default VideoGen;

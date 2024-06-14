import { FaRandom } from "react-icons/fa";
import React, { useState } from "react";

function VideoGen({ setVideoPrompt, videoPrompt, video, setVideo }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const [error, setError] = useState(null);

  const generateVideo = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoPrompt }),
      });

      const data = await response.json();
      setVideo(data?.videoURL[0]);
      setIsGenerating(false);
    } catch (error) {
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
      "A portrait of a wise old owl perched on a bookshelf filled with ancient texts",
      "A photorealistic image of a cat wearing a spacesuit exploring Mars",
      "A vibrant underwater scene with colorful coral reefs and exotic fish",
      "A futuristic cityscape with flying cars and towering skyscrapers",
      "A portrait of a historical figure in a fantastical setting",
      "A close-up photo of a delicious dessert with intricate details",
      "A breathtaking mountain range shrouded in mist at sunrise",
    ];

    const random = Math.floor(Math.random() * 100);
    const randomPrompt = videoPrompts[random % videoPrompts.length];
    setVideoPrompt(randomPrompt);
  };

  return (
    <section className="text-white w-[500px]">
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
        <button className="btn text-purple-300 border-purple-400" onClick={randomVideo}>
          <FaRandom size={23} />
        </button>
      </div>

      <div className="my-4">
        <video
          src={video}
          className="pb-10 object-cover rounded-md"
          style={{ width: "100%", height: "400px" }}
          controls
          loop
        ></video>
      </div>
    </section>
  );
}

export default VideoGen;

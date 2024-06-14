import { TbLoader3 } from "react-icons/tb";
import { GiTrackedRobot } from "react-icons/gi";
import { BsRobot } from "react-icons/bs";
import React, { useState } from "react";
import "./../CaptionGen/CaptionGen.css";

function CaptionGen({ setCaption, imageUrl }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateCaption = async () => {
    setIsGenerating(true);
    setError(null);

    let captionPrompt = `Write an engaging caption for this image, suitable for social media. The caption can be concise, informative, casual and may capture a bit of the essence of the image. It can be humorous, inspirational, dark humurous, or informal also add relevant emojis and hashtags.`;

    try {
      const response = await fetch("http://localhost:3000/generate-caption", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ captionPrompt, image: imageUrl }),
      });

      const data = await response.json();
      setCaption(data);
      setIsGenerating(false);
    } catch (error) {
      setIsGenerating(false);
      console.error(error);
      setError("Failed to generate caption");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="text-white">
      <button
        className="btn text-white border-0"
        disabled={isGenerating}
        onClick={generateCaption}
      >
        {isGenerating ? (
          <TbLoader3 size={24} className="loader" />
        ) : (
          <BsRobot size={24} />
        )}
      </button>
    </section>
  );
}

export default CaptionGen;

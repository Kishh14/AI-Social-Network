import { FaRandom } from "react-icons/fa";
import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";

function ImageGen({
  imageUrl,
  setImageUrl,
  caption,
  setIsCaptionAIGen,
  isCaptionAIGen,
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [image, setImage] = useState();
  const [imagePrompt, setImagePrompt] = useState(
    "A close-up photo of a delicious dessert with intricate details"
  );
  const [error, setError] = useState(null);

  const generateImage = async () => {
    setIsGenerating(true);
    setIsGenerated(false);
    setError(null);

    try {
      const response = await fetch(
        "https://ai-social-network-1-api.onrender.com/generate-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imagePrompt }),
        }
      );

      const data = await response.json();
      setImageUrl(data?.imageUrl);
      setImage(data?.imageUrl);
      setIsGenerating(false);
      setIsGenerated(true);
    } catch (error) {
      setIsGenerated(false);
      setIsGenerating(false);
      console.error(error);
      setError("Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const randomImage = async () => {
    const imagePrompts = [
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
    const randomPrompt = imagePrompts[random % imagePrompts.length];
    setImagePrompt(randomPrompt);
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
        aiLink: image,
        content: caption,
      };
      const resp = await axios.post(
        `${import.meta.env.VITE_API_USER_URL}/uploadAIimagePost`,
        data,
        reqConfig
      );
      toast.success("Post Uploaded!");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="text-white w-[500px]">
      <h2 className="my-3">Image Generation</h2>
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Enter prompt"
          value={imagePrompt}
          onChange={(e) => setImagePrompt(e.target.value)}
          cols={5}
          rows={2}
        />
        <button
          className="btn text-purple-300 border-purple-400"
          disabled={isGenerating}
          onClick={generateImage}
        >
          {isGenerating ? "Generating" : "Generate"}
        </button>
        <button
          className="btn text-purple-300 border-purple-400"
          onClick={randomImage}
        >
          <FaRandom size={23} />
        </button>
      </div>

      <div className="mt-4 mb-3">
        <img
          src={isGenerated ? imageUrl : "https://placeholder.co/300x300"}
          alt="img"
          className="pb-10 object-cover rounded-md"
          style={{ width: "100%", height: "450px" }}
        />
      </div>
      <div className="my-2">
        {isGenerated && (
          <button
            onClick={createPost}
            className="btn px-5 text-center bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg hover:border hover:border-gray-400 mx-auto block mb-3"
          >
            Post Now
          </button>
        )}
      </div>
    </section>
  );
}

export default ImageGen;

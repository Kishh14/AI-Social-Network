import React, { useState } from "react";

function VideoGen() {
  const [state, setState] = useState(false);
  const [isStating, setIsStating] = useState(false);

  const handleSubmit = () => {
    setIsStating(true);
    setTimeout(() => {
      setState(true);
    }, 2000);
  };

  return (
    <div className="m-8 p-4">
      <input type="text" placeholder="Konsi video chahiye?" />
      <button className="mb-4" onClick={handleSubmit}>
        Generate
      </button>

      {isStating ? (
        state ? (
          <p>AI Model Connected!!</p>
        ) : (
          <p>Connecting...</p>
        )
      ) : null}
    </div>
  );
}

export default VideoGen;

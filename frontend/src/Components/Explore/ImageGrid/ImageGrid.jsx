import React from "react";
import "./ImageGrid.css";
const ImageGrid = ({ imageUrls }) => {
  if (!imageUrls || imageUrls.length === 0) {
    return <div>No images to display</div>;
  }
  return (
    <div className="grid grid-cols-3 gap-4 mt-5 mb-2 p-4 rounded-lg">
      {imageUrls.map((url, index) => (
        <div key={index} className="col-span-1 image-container">
          <img
            src={
              "https://i.pinimg.com/564x/33/e1/cc/33e1cc97ea4cf9f119e5873def4658a7.jpg"
            }
            alt={`Image ${index}`}
            className="image rounded-md"
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;

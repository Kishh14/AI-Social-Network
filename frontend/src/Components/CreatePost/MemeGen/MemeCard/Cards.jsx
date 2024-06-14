import React from "react";

const Cards = (props) => {
  return (
    <div className="bg-purple-600 p-2 rounded">
      <div>
        <img src={props.img} alt={props.name} className="rounded" />
      </div>
      <div className="flex justify-between px-3 items-center mt-2 mb-1">
        <h5 className="text-center my-1" style={{ fontSize: "18px" }}>
          {props.name}
        </h5>
        <button
          className="btn bg-gray-200 hover:bg-gray-300 hover:text-black block py-1 px-4"
          onClick={(e) => props.setEditMemeImg(props.img)}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default Cards;

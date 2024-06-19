import React, { createRef, useState } from "react";
import Cards from "./MemeCard/Cards";
import Draggable from "react-draggable";
import { exportComponentAsJPEG } from "react-component-export-image";

function MemeGen({ data, filteredData, setFilteredData }) {
  // const [data, setData] = useState([]);
  // const [filteredData, setFilteredData] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [textVal, setTextVal] = useState("Double click to edit");
  const [count, setCount] = useState(0);
  const [editMemeImg, setEditMemeImg] = useState(null);
  const memeref = createRef();
  const [width, setWidth] = useState(100);

  const addText = () => {
    setCount(count + 1);
  };

  const handleSearch = () => {
    const filteredMemes = data.filter((meme) =>
      meme.name.toLowerCase().includes(searchVal.toLowerCase())
    );
    setFilteredData(filteredMemes);
  };

  const handleInputChange = (e) => {
    const newText = e.target.value;
    setTextVal(newText);
    const newWidth = newText.length * 10 + 20;
    setWidth(newWidth);
  };

  return (
    <section className="text-white flex justify-between w-full mb-2">
      {/* Diaplyed Meme */}
      <div className="w-[38%] h-[82vh] overflow-y-scroll no-scrollbar">
        <div className="sticky top-0 z-20">
          <input
            type="text"
            className="form-input rounded text-black outline-none px-3 py-2 w-full block"
            placeholder="Search Meme"
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              handleSearch();
            }}
            style={{ position: "sticky", top: "0px" }}
          />
        </div>
        <div className="glass-effect p-4 flex flex-col gap-4">
          {searchVal
            ? filteredData.map((item) => (
                <Cards
                  key={item.name}
                  img={item.url}
                  name={item.name}
                  setEditMemeImg={setEditMemeImg}
                />
              ))
            : data.map((item) => (
                <Cards
                  key={item.name}
                  img={item.url}
                  name={item.name}
                  setEditMemeImg={setEditMemeImg}
                />
              ))}
        </div>
      </div>

      {/* Edit Meme */}
      <div className="glass-effect w-[46%] h-[82vh] py-5 mb-3">
        <div className="">
          <div
            ref={memeref}
            className="p-0 w-[85%] h-[62vh] mx-auto bg-white rounded m-0"
          >
            <img
              className="rounded mx-auto block w-[100%] h-[100%] object-contain"
              src={editMemeImg}
              alt={editMemeImg}
            />
            {Array(count)
              .fill(0)
              .map((e) => (
                <Draggable key={e}>
                  {editMode ? (
                    <div
                      contentEditable="true"
                      style={{
                        padding: "5px",
                        width: `${150}px`,
                        overflow: "hidden",
                        // whiteSpace: "pre-wrap",
                        // wordBreak: "break-all",
                        textAlign: "center",
                      }}
                      dangerouslySetInnerHTML={{ __html: textVal }}
                      type="text"
                      autoFocus
                      onChange={(e) => handleInputChange(e)}
                      onClick={(e) => setTextVal(e.target.value)}
                      className="text-black rounded bg-white block border-none outline-none"
                    ></div>
                  ) : (
                    // <textarea
                    //   value={textVal}
                    //   onChange={(e) => handleInputChange(e)}
                    //   style={{
                    //     width: `${width}px`,
                    //     resize: "none",
                    //     whiteSpace: "pre-wrap",
                    //     wordBreak: "break-all",
                    //   }}
                    //   className="text-black rounded border-none outline-none"
                    // />
                    <h4 className="" onDoubleClick={(e) => setEditMode(true)}>
                      {textVal}
                    </h4>
                  )}
                </Draggable>
              ))}
          </div>
          <div className="flex justify-around mt-5">
            <button className="btn bg-gray-200" onClick={addText}>
              Add text
            </button>
            <button
              className="btn bg-gray-200"
              onClick={(e) => exportComponentAsJPEG(memeref)}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MemeGen;

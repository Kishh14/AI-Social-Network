import { MdOutlineExplore } from "react-icons/md";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiChat, BiHomeAlt, BiMessageSquareEdit } from "react-icons/bi";
import { MdOutlineAccountCircle } from "react-icons/md";
import "./PostPage/PostPage.css";
import { useNavigate } from "react-router-dom";

function Header({ setCurrentPage, showSearchSidebar, setShowSearchSidebar }) {
  const navigate = useNavigate();

  return (
    <aside
      className="h-screen flex flex-col items-center justify-center shadow-md p-1"
      style={{
        backdropFilter: "blur(4px)",
        background: "rgba(0, 0, 0, 0.293)",
      }}
    >
      <div className="icon-container px-3">
        <BiHomeAlt
          className="icon text-white mb-7"
          onClick={() => navigate("/")}
        />
        <AiOutlineSearch
          className="icon text-white mb-7"
          onClick={() => {
            setShowSearchSidebar(!showSearchSidebar);
          }}
        />
        <MdOutlineExplore
          className="icon text-white mb-7"
          onClick={() => navigate("/explore")}
        />
        <BiMessageSquareEdit
          className="icon text-white mb-7"
          onClick={() => navigate("/createPost")}
        />
        <BiChat
          className="icon text-white mb-7"
          onClick={() => navigate("/messenger")}
        />
        <MdOutlineAccountCircle
          className="icon text-white mb-7"
          onClick={() => navigate("/profile")}
        />
      </div>
    </aside>
  );
}

export default Header;

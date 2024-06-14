import { MdOutlineExplore } from "react-icons/md";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiChat, BiHomeAlt, BiMessageSquareEdit } from "react-icons/bi";
import { MdOutlineAccountCircle } from "react-icons/md";
import "./PostPage/PostPage.css";

function Header({ setCurrentPage, showSearchSidebar, setShowSearchSidebar }) {
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
          onClick={() => setCurrentPage("PostPage")}
        />
        <AiOutlineSearch
          className="icon text-white mb-7"
          onClick={() => {
            setShowSearchSidebar(!showSearchSidebar);
          }}
        />
        <MdOutlineExplore
          className="icon text-white mb-7"
          onClick={() => setCurrentPage("Explore")}
        />
        <BiMessageSquareEdit
          className="icon text-white mb-7"
          onClick={() => setCurrentPage("CreatePost")}
        />
        <BiChat
          className="icon text-white mb-7"
          onClick={() => setCurrentPage("ChatPage")}
        />
        <MdOutlineAccountCircle
          className="icon text-white mb-7"
          onClick={() => setCurrentPage("UserProfile")}
        />
      </div>
    </aside>
  );
}

export default Header;

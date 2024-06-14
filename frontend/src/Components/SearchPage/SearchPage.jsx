import React from "react";
import { IoIosSearch } from "react-icons/io";
import SearchCard from "./SearchCard/SearchCard";
import "./SearchPage.css";

function SearchPage({ showSearchSidebar }) {
  return (
    <div
      className={`search-container w-2/5 h-screen overflow-hidden absolute ${
        showSearchSidebar ? "left-16" : "-left-2/4"
      } z-10 transition-all`}
    >
      <div className="custom-div flex flex-col items-center mx-auto h-full overflow-y-scroll no-scrollbar">
        <header className="flex mt-5 w-4/5 items-center m-4">
          <div
            className="w-full border py-2 px-4 bg-white shadow flex items-center justify-between"
            style={{ borderRadius: "0px 25px" }}
          >
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none w-full mr-3 outline-none"
              style={{ fontSize: "18px" }}
            />
            <IoIosSearch size={24} />
          </div>
        </header>

        <div className="w-3/4 flex flex-col mt-2 mr-1">
          <SearchCard
            userName="John Doe"
            followedBy="Followed by terylucas + 2 more"
          />
          <SearchCard
            userName="Jack Sparrow"
            followedBy="Followed by terylucas + 2 more"
          />
          <SearchCard
            userName="Jack Sparrow"
            followedBy="Followed by terylucas + 2 more"
          />
          <SearchCard
            userName="Jack Sparrow"
            followedBy="Followed by terylucas + 2 more"
          />
          <SearchCard
            userName="Jack Sparrow"
            followedBy="Followed by terylucas + 2 more"
          />
          <SearchCard
            userName="Jack Sparrow"
            followedBy="Followed by terylucas + 2 more"
          />
          <SearchCard
            userName="Jack Sparrow"
            followedBy="Followed by terylucas + 2 more"
          />
          <SearchCard
            userName="Jack Sparrow"
            followedBy="Followed by terylucas + 2 more"
          />
          <SearchCard
            userName="Jack Sparrow"
            followedBy="Followed by terylucas + 2 more"
          />
          <SearchCard
            userName="Jack Sparrow"
            followedBy="Followed by terylucas + 2 more"
          />
        </div>
      </div>
    </div>
  );
}

export default SearchPage;

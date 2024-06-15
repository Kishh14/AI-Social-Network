import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import SearchCard from "./SearchCard/SearchCard";
import "./SearchPage.css";
import axios from "axios";
import { useSelector } from "react-redux";

function SearchPage({ showSearchSidebar }) {

  const [searchInput, setSearchInput] = useState();
  const [allUsers, setAllUsers] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    searchUsers();
  }, [])

  const searchUsers = async () => {
    try {
      const resp = await axios.get(`${import.meta.env.VITE_API_USER_URL}/getAllUsers`);
      let users = resp.data.allUsers;
      users = users.filter(users => user.details._id !== users._id)
      setAllUsers(users);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchInput(e.target.value);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(async () => {
      try {
        if (!value) {
          const resp = await axios.get(`${import.meta.env.VITE_API_USER_URL}/getAllUsers`);
          let users = resp.data.allUsers;
          users = users.filter(users => user.details._id !== users._id)
          setAllUsers(users);
          setAllUsers(resp.data.allUsers);
        }
        else {
          const response = await axios.get(
            `${import.meta.env.VITE_API_USER_URL}/${value}/singleUser`
          );
          if(response.data.user===user.details.username){
            setAllUsers();
          }else
          setAllUsers(response.data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    }, 1000);

    setSearchTimeout(newTimeout);
  }

  return (
    <div
      className={`search-container w-2/5 h-screen overflow-hidden absolute ${showSearchSidebar ? "left-16" : "-left-2/4"
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
              value={searchInput}
              onChange={handleSearch}
              className="bg-transparent border-none w-full mr-3 outline-none"
              style={{ fontSize: "18px" }}
            />
            <IoIosSearch size={24} />
          </div>
        </header>

        <div className="w-3/4 flex flex-col mt-2 mr-1">
          {allUsers?.length > 0 ? allUsers?.map((user) =>
            <SearchCard
              userImg={user.profileImg}
              userName={user.username}
              followedBy="Followed by terylucas + 2 more"
              id={user._id}
            />
          )
            :
            <SearchCard
              userImg={allUsers.profileImg}
              userName={allUsers.username}
              followedBy="Followed by terylucas + 2 more"
              id={allUsers._id}
            />
          }
        </div>
      </div>
    </div>
  );
}

export default SearchPage;

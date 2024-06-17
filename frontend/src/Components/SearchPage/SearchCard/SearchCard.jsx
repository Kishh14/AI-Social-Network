import React, { useEffect, useState } from "react";
import "./SearchCard.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SearchCard = ({ userName, followedBy, userImg, id, socket }) => {
  const user = useSelector((state) => state.user.user);
  const [loginUser, setLoginUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUser(user.details.username);
    }
  }, [user]);

  const fetchUser = async (name) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_USER_URL}/${name}/getByName`);
      if (response.data.user) {
        setLoginUser(response.data.user);
      } else {
        setLoginUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setLoginUser(null);
    }
  };

  const reqConfig = {
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  }

  const handleFollow = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_USER_URL}/${id}/follow`,
        {},
        reqConfig
      );
      fetchUser(user.details.username);

      // Trigger follow notification
      console.log('Emitting followUser event:', {
        followerUsername: user.details.username,
        followedUsername: userName,
      });
      socket.emit("followUser", {
        followerUsername: user.details.username,
        followedUsername: userName,
      });
    } catch (error) {
      console.log(error);
      // toast.error(error.response.data.message);
    }
  };
  
  const handleUnfollow = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_USER_URL}/${id}/unfollow`,
        {},
        reqConfig
      );
      fetchUser(user.details.username);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  

  return (
    <div className="p-3 flex justify-between items-center gap-2">
      <img src={userImg} alt="" className="h-12 w-12 rounded-full object-cover cursor-pointer" onClick={() => { navigate(`/profile/${userName}`) }} />
      <div className="cursor-pointer" onClick={() => { navigate(`/profile/${userName}`) }}>
        <p className="text-white font-semibold ml-2">{userName}</p>
        <p className="text-gray-300 font-semibold ml-2">{followedBy}</p>
      </div>

      {user && loginUser && user.details._id !== id && (
        <>
          {loginUser?.following.includes(id) ? (
            <button className="bg-white hover:shadow-lg hover:border hover:border-white rounded btn ml-auto" onClick={() => handleUnfollow(id)}>
              Unfollow
            </button>
          ) : (
            <button className="text-white bg-blue-500 hover:shadow-lg hover:border hover:border-white rounded btn ml-auto" onClick={() => handleFollow(id)}>
              Follow
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default SearchCard;

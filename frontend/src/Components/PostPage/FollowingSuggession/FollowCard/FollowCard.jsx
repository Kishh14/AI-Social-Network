import React, { useEffect, useState } from "react";
import user from "../../../../assets/user.png";
import axios from "axios";
import { useSelector } from "react-redux";

const FollowCard = ({ userName,image,userId }) => {

  const user = useSelector(state=>state.user.user);
  const [following,setFollowing] = useState();

  useEffect(()=>{
    fetchDetails()
  },[])

  const fetchDetails=async()=>{
    const logUser = await axios.get(`${import.meta.env.VITE_API_USER_URL}/${user.details.username}/singleUser`);
    setFollowing(logUser.data.user.following);
  }

  const reqConfig = {
    headers: {
      Authorization:`Bearer ${user.token}`
    }
  }

  const handleFollow = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_USER_URL}/${userId}/follow`,
        {},
        reqConfig
      );
      fetchDetails();
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_USER_URL}/${userId}/unfollow`,
        {},
        reqConfig
      );
      fetchDetails();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="p-2 flex items-center ">
        <img src={image} alt="" className="h-7 w-7" />
        <p className="text-white font-semibold ml-2">{userName}</p>
        {following?.includes(userId)
        ?
        <button className="bg-white hover:shadow-lg hover:border hover:border-white rounded btn ml-auto" onClick={handleUnfollow}>
          Unfollow
        </button>
        :
        <button className="text-white bg-blue-500 hover:shadow-lg hover:border hover:border-white rounded btn ml-auto" onClick={handleFollow}>
          Follow
        </button>
        }
      </div>
    </>
  );
};

export default FollowCard;

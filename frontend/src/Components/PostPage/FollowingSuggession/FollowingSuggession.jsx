import { RiUserFollowFill } from "react-icons/ri";
import React, { useEffect, useState } from "react";
import FollowCard from "./FollowCard/FollowCard";
import axios from "axios";
import { useSelector } from "react-redux";

const FollowingSuggession = () => {

  const [allUsers,setAllUsers] = useState()
  const user = useSelector(state=>state.user.user)

  useEffect(()=>{
    searchUsers();
  },[])

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

  return (
    <>
      <div className="p-4 flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <RiUserFollowFill size={23} color="white" />
          <p className="text-white" style={{ fontSize: "20px" }}>
            Follow suggestions
          </p>
        </div>
      </div>

      <div className="p-4 flex flex-col px-3 no-scrollbar overflow-y-scroll h-[50vh] pb-5 mb-4">
        {allUsers?.length > 0 ? allUsers?.map((user)=>{
          return( <FollowCard key={user._id} userName={user.username} userId={user._id} image={user.profileImg}/>)
        }
        ):''}
      </div>
    </>
  );
};

export default FollowingSuggession;

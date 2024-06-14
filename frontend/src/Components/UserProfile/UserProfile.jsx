/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import "./UserProfile.css";
import { IoMdClose } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { TfiWrite } from "react-icons/tfi";
import { CgProfile } from "react-icons/cg";
import { FaComment, FaEdit, FaHeart, FaShare, FaTimes } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { trpc } from "../../lib/trpc";
import {
  logout_success,
  update_username,
  update_bio,
} from "../../Redux/userSlice";
import CommentCard from "../PostPage/CommentCard/CommentCard";
import { useClickAway } from "../../hooks/useClickAway";

function UserProfile() {
  const [loggedinUser, setLoggedinUser] = useState(false);
  const [userPageDetails, setUserPageDetails] = useState();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const user = useSelector((state) => state.user.user);
  const userId = useSelector((state) => state.user.user.details._id);
  console.log(userId);
  const { data: posts } = trpc.posts.getPosts.useQuery(
    {
      id: userId,
    },
    {
      queryKey: ["posts"],
    }
  );
  console.log(posts);
  const { name } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [editUser, setEditUser] = useState({
    username: user?.details?.username,
    email: user?.details?.email,
    bio: user?.details?.bio,
    password: "",
    image: user?.details?.profileImg,
  });
  const [show, setShow] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);

  // States to control the dropdown for each form fields
  const [showUserNameInput, setShowUserNameInput] = useState(false);
  const [showBioInput, setShowBioInput] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const [showFollowing, setShowFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);

  // Comment Modal for each post
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useClickAway(() => {
    console.log("Clicked!");
    setIsModalOpen(false);
  });
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleShowfollowing = async () => {
    setShowFollowing(true);

    try {
      if (userPageDetails?.following) {
        const updatedFollowing = [];

        for (const id of userPageDetails.following) {
          const details = await axios.get(
            `${import.meta.env.VITE_API_USER_URL}/${id}/getbyid`
          );
          updatedFollowing.push({
            username: details.data.user.username,
            image: details.data.user.profileImg,
          });
        }

        setFollowing(updatedFollowing);
      }
    } catch (error) {
      toast.error("Error fetching followings!");
    }
  };

  const handleShowfollowers = async () => {
    setShowFollowers(true);

    try {
      if (userPageDetails?.followers) {
        const updatedFollowers = [];

        for (const id of userPageDetails.followers) {
          const details = await axios.get(
            `${import.meta.env.VITE_API_USER_URL}/${id}/getbyid`
          );
          updatedFollowers.push({
            username: details.data.user.username,
            image: details.data.user.profileImg,
          });
        }

        setFollowers(updatedFollowers);
      }
    } catch (error) {
      toast.error("Error fetching followers!");
    }
  };

  const handleClose = () => {
    setShow(false);
    setShowFollowers(false);
    setShowFollowing(false);
    setEditUser({
      username: user?.details?.username,
      email: user?.details?.email,
      bio: user?.details?.bio,
      password: "",
      image: user?.details?.profileImg,
    });
    setImagePreview(null);
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (name === user.details.username || name === undefined) {
      // setLoggedinUser(true);
      const username = user.details.username;
      console.log(username, "<- username");
      fetchUser(username);
    } else {
      setLoggedinUser(false);
      fetchUser(name);
    }
  }, [name, user]);

  const fetchUser = async (nme) => {
    try {
      const details = await axios.get(
        `${import.meta.env.VITE_API_USER_URL}/${nme}`
      );
      setUserPageDetails(details.data.user);
    } catch (error) {
      toast.error(error.response.data.message);
      navigate("/");
    }
  };

  const reqConfig = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const handleFollow = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_USER_URL}/${id}/follow`,
        {},
        reqConfig
      );
      fetchUser(name);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleUnfollow = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_USER_URL}/${id}/unfollow`,
        {},
        reqConfig
      );
      fetchUser(name);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleProfileChange = () => {
    const userFile = document.createElement("input");
    userFile.type = "file";
    userFile.accept = ".jpg, .jpeg, .png";
    userFile.click();

    userFile.onchange = async (e) => {
      e.preventDefault();
      const file = e.target.files[0];

      if (file) {
        const previewURL = URL.createObjectURL(file);
        setImagePreview(previewURL);
        setEditUser({ ...editUser, image: file });
      } else {
        setImagePreview(null);
        setEditUser({ ...editUser, image: null });
      }
    };
  };

  const handleAddImage = async () => {
    try {
      const formData = new FormData();
      formData.append("image", editUser.image);
      await axios.put(
        `${import.meta.env.VITE_API_USER_URL}/${user.details._id}/uploadImage`,
        formData,
        reqConfig
      );
      toast.success("Profile Image updated!");
      setShow(false);
      setImagePreview(null);
      fetchUser(user.details.username);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleLogout = async () => {
    dispatch(logout_success());
    toast.success("You are logged out!");
    navigate("/authentication");
  };

  const handleEditUsername = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_USER_URL}/editUsername`,
        { username: editUser.username },
        reqConfig
      );
      dispatch(update_username({ username: editUser.username }));
      setShow(false);
      toast.success("Username updated!");
      fetchUser(editUser.username);
    } catch (error) {
      if (error.response.data.error.codeName === "DuplicateKey") {
        toast.error("Username already registered!");
      } else toast.error("Something went wrong!");
    }
  };

  const handleEditBio = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_USER_URL}/editBio`,
        { bio: editUser.bio },
        reqConfig
      );
      dispatch(update_bio({ bio: editUser.bio }));
      setShow(false);
      toast.success("Bio updated!");
      fetchUser(user.details.username);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleEditPassword = async () => {
    setChangingPassword(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_USER_URL}/editPassword`,
        { password: editUser.password },
        reqConfig
      );
      setShow(false);
      setEditUser({ ...editUser, password: "" });
      toast.success("Password updated!");
      fetchUser(user.details.username);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setChangingPassword(false);
    }
  };
  return (
    <>
      {!loggedinUser ? (
        <div className="profile-page d-flex justify-center align-middle overflow-x-hidden no-scrollbar">
          <div className="row g-0 shadow-lg profile-visible glass-effect no-scrollbar pb-4">
            <div className="text-center mt-4">
              <div className="mx-auto my-3 relative" style={{ width: "11%" }}>
                <img
                  src={userPageDetails?.profileImg}
                  alt="profile"
                  className="mx-auto profile-img"
                />
              </div>
              <div className="d-flex justify-center items-center gap-3">
                <h3 className="text-light fs-4 fw-bold">
                  {userPageDetails?.username}
                </h3>
                <button
                  className="text-gray-200 hover:text-white border-gray-200 hover:border-gray-400"
                  onClick={handleShow}
                >
                  <CiSettings size={27} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-center">
                <span
                  className="text-light"
                  onClick={() => handleShowfollowers()}
                  style={{ cursor: "pointer" }}
                >
                  {userPageDetails?.followers.length} Followers
                </span>
                <span
                  className="text-light ms-4"
                  onClick={() => handleShowfollowing()}
                  style={{ cursor: "pointer" }}
                >
                  {userPageDetails?.following.length} Following
                </span>
              </div>
              <p className="text-gray-400 mt-2">{userPageDetails?.bio}</p>
              <br />
              <div className="row justify-center mt-3 posts-row no-scrollbar">
                {posts?.map((post) => (
                  <div
                    className="col-md-3 mx-3 w-[400px] h-[400px]"
                    key={post._id}
                  >
                    {post.image && (
                      <div className="rounded-md h-full overflow-hidden glass-effect">
                        {/* Post Image Section */}
                        <div className="pl-4 pb-1 border-l border-gray-400">
                          <p className="font-semibold text-white text-start ml-2">
                            {post.content}
                          </p>
                          <img
                            className="mt-3 rounded-md"
                            src={post.image}
                            alt="Post"
                            style={{
                              width: "400px",
                              height: "300px",
                              objectFit: "cover",
                            }}
                          />
                        </div>

                        {/* Like, Comment, Share Section */}
                        <div className="flex flex-col py-1 mt-1">
                          <div className="flex items-center gap-1 ml-5">
                            <FaHeart
                              className="text-white mr-2 hover:text-red-500 cursor-pointer"
                              size={22}
                            />
                            <FaComment
                              className="text-white mr-2 cursor-pointer hover:text-gray-300"
                              size={22}
                              onClick={toggleModal}
                            />
                            <FaShare
                              size={22}
                              className="text-white mr-2 hover:text-gray-300 cursor-pointer"
                            />
                          </div>

                          <div className="text-gray-400 text-start ml-5">
                            <p>
                              {/* {likeCount} Likes by - {likedUserName} */}
                              {1000} Likes by - {"likedUserName"}
                            </p>
                          </div>
                          {isModalOpen && (
                            <div
                              ref={modalRef}
                              className="py-4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded shadow-lg w-1/2 overflow-y-auto overflow-x-hidden no-scrollbar"
                              style={{
                                backdropFilter: "blur(20px)",
                                background: "rgba(999,999,999, 0.2)",
                              }}
                            >
                              <div className="flex justify-between border-b border-gray-300 pb-3 px-8 items-center mb-4">
                                <h2 className="text-xl">Comments</h2>
                                <FaTimes
                                  className="text-black text-xl cursor-pointer"
                                  onClick={toggleModal}
                                />
                              </div>
                              <div className="border-white-400 max-h-80 overflow-y-auto no-scrollbar">
                                <CommentCard
                                  userName="John Doe"
                                  postCaption="This is a comment caption"
                                />
                                <CommentCard
                                  userName="Jane Smith"
                                  postCaption="This is another comment caption"
                                />
                                <CommentCard
                                  userName="Alice Johnson"
                                  postCaption="Yet another comment caption"
                                />
                                <CommentCard
                                  userName="Bob Brown"
                                  postCaption="And another one!"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {post.video && <video src={post.video}></video>}
                    <div className="rounded-md h-full overflow-hidden glass-effect">
                      {/* Text Post Section */}
                      <div className="pl-4 pb-1 pt-4 border-l border-gray-400">
                        <p
                          className="mt-3 rounded-md flex items-center text-white justify-center post-glass-effect pt-4"
                          style={{
                            width: "380px",
                            height: "280px",
                            objectFit: "cover",
                          }}
                        >
                          {post.content}
                        </p>
                      </div>

                      {/* Like, Comment, Share Section */}
                      <div className="flex flex-col py-1 mt-2">
                        <div className="flex items-center gap-1 ml-5">
                          <FaHeart
                            className="text-white mr-2 hover:text-red-500 cursor-pointer"
                            size={22}
                          />
                          <FaComment
                            className="text-white mr-2 cursor-pointer hover:text-gray-300"
                            size={22}
                            onClick={toggleModal}
                          />
                          <FaShare
                            size={22}
                            className="text-white mr-2 hover:text-gray-300 cursor-pointer"
                          />
                        </div>

                        <div className="text-gray-400 text-start ml-5">
                          <p>
                            {/* {likeCount} Likes by - {likedUserName} */}
                            {1000} Likes by - {"likedUserName"}
                          </p>
                        </div>
                        {isModalOpen && (
                          <div
                            ref={modalRef}
                            className="py-4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded shadow-lg w-1/2 overflow-y-auto overflow-x-hidden no-scrollbar"
                            style={{
                              backdropFilter: "blur(20px)",
                              background: "rgba(999,999,999, 0.2)",
                            }}
                          >
                            <div className="flex justify-between border-b border-gray-300 pb-3 px-8 items-center mb-4">
                              <h2 className="text-xl">Comments</h2>
                              <FaTimes
                                className="text-black text-xl cursor-pointer"
                                onClick={toggleModal}
                              />
                            </div>
                            <div className="border-white-400 max-h-80 overflow-y-auto no-scrollbar">
                              <CommentCard
                                userName="John Doe"
                                postCaption="This is a comment caption"
                              />
                              <CommentCard
                                userName="Jane Smith"
                                postCaption="This is another comment caption"
                              />
                              <CommentCard
                                userName="Alice Johnson"
                                postCaption="Yet another comment caption"
                              />
                              <CommentCard
                                userName="Bob Brown"
                                postCaption="And another one!"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="profile-page d-flex justify-center align-middle">
          <div className="row g-0 shadow-lg profile-visible mt-5 mb-5 rounded">
            <div className="text-center">
              <img
                src={userPageDetails?.profileImg}
                alt="profile"
                className="mx-auto mt-3 profile-img"
              />
              <div className="d-flex justify-center">
                <h3 className="text-light mt-3 fs-4 fw-bold ms-5">
                  {userPageDetails?.username}
                </h3>
                {/* <button
                  className={`mt-3 fs-6 ms-3 btn btn-${follow ? 'light' : 'primary'}`}
                  onClick={() => setFollow((prev) => !prev)}
                >
                  {follow ? 'Unfollow' : 'Follow'}
                </button> */}
                {userPageDetails?.followers.includes(user.details._id) ? (
                  <button
                    className="mt-3 fs-6 ms-3 btn btn-light"
                    onClick={() => handleUnfollow(userPageDetails?._id)}
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    className="mt-3 fs-6 ms-3 btn btn-primary"
                    onClick={() => handleFollow(userPageDetails?._id)}
                  >
                    Follow
                  </button>
                )}
              </div>
              <div className="mt-2">
                <span className="text-light">
                  {userPageDetails?.followers.length} Followers
                </span>
                <span className="text-light ms-4">
                  {userPageDetails?.following.length} Following
                </span>
              </div>
              <p className="text-secondary mt-2">{userPageDetails?.bio}</p>
              <br />
              <hr
                className="line bg-red-500"
                style={{ border: "2px solid white" }}
              />
              <div className="row justify-around mt-3 posts-row no-scrollbar">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div className="col-md-3 m-3" key={index}>
                    <img src="https://imgv3.fotor.com/images/slider-image/A-clear-close-up-photo-of-a-woman.jpg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal show={show} onHide={handleClose} centered>
        {/* <Modal.Header closeButton>
          <Modal.Title className="fs-5 glass-effect">Edit Profile</Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
          <div className="container">
            {/* Change Profile Picture */}
            <div className="mx-auto my-3 relative" style={{ width: "35%" }}>
              <img
                src={imagePreview ? imagePreview : userPageDetails?.profileImg}
                alt="profile"
                className="mx-auto profile-img"
              />
              <FaEdit
                size={22}
                color="white"
                className="absolute right-3 bottom-2 cursor-pointer"
                onClick={handleProfileChange}
              />
            </div>
            {imagePreview ? (
              <div className="text-center">
                <button
                  className="btn rounded-e rounded-l-none"
                  onClick={() => setImagePreview(null)}
                >
                  <IoMdClose size={20} color="white" />
                </button>
                <button
                  className="btn rounded-e bg-red-600 hover:bg-red-700 rounded-l-none"
                  onClick={() => handleAddImage()}
                >
                  <MdDone size={20} color="white" />
                </button>
              </div>
            ) : (
              ""
            )}
            <div className="ml-20 my-3">
              {/* Change Username */}
              <div className="flex items-center gap-3 p-2 rounded mb-1">
                <CgProfile
                  size={29}
                  onClick={() => setShowUserNameInput(!showUserNameInput)}
                  className="cursor-pointer"
                />
                <div className="">
                  <span
                    style={{ fontSize: "19px", cursor: "pointer" }}
                    onClick={() => setShowUserNameInput(!showUserNameInput)}
                  >
                    Change Username
                  </span>
                  {showUserNameInput && (
                    <div className="flex">
                      <input
                        type="text"
                        className="form-control bg-transparent text-white p-1 ps-2"
                        value={editUser?.username}
                        onChange={(e) =>
                          setEditUser({ ...editUser, username: e.target.value })
                        }
                      />
                      <button
                        className="btn rounded-e rounded-l-none"
                        onClick={() => handleEditUsername()}
                      >
                        {/* TODO: Close the dropdown for each input once successfully submited the response */}
                        <MdDone size={20} color="white" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Change Bio */}
              <div className="flex items-center gap-3 p-2 rounded mb-1">
                <TfiWrite
                  size={27}
                  onClick={() => setShowBioInput(!showBioInput)}
                  className="cursor-pointer"
                />
                <div className="">
                  <span
                    style={{ fontSize: "19px", cursor: "pointer" }}
                    onClick={() => setShowBioInput(!showBioInput)}
                  >
                    Change Bio
                  </span>
                  {showBioInput && (
                    <div className="flex">
                      <input
                        type="text"
                        className="form-control bg-transparent text-white p-1 ps-2"
                        value={editUser?.bio}
                        onChange={(e) =>
                          setEditUser({ ...editUser, bio: e.target.value })
                        }
                      />
                      <button
                        className="btn rounded-e rounded-l-none"
                        onClick={() => handleEditBio()}
                      >
                        <MdDone size={20} color="white" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Change Email */}
              {/* <div className="flex items-center gap-3 p-2 rounded mb-1">
                <AiOutlineMail
                  size={29}
                  onClick={() => setShowEmailInput(!showEmailInput)}
                  className="cursor-pointer"
                />
                <div className="">
                  <span
                    style={{ fontSize: "19px", cursor: "pointer" }}
                    onClick={() => setShowEmailInput(!showEmailInput)}
                  >
                    Change Email
                  </span>
                  {showEmailInput && (
                    <div className="flex">
                      <input
                        type="text"
                        className="form-control bg-transparent text-white p-1 ps-2"
                        value={editUser?.email}
                        onChange={(e)=>setEditUser({...editUser,email:e.target.value})}
                      />
                      <button className="btn rounded-e rounded-l-none" onClick={()=>handleEditEmail()}>
                        <MdDone size={20} color="white" />
                      </button>
                    </div>
                  )}
                </div>
              </div> */}

              {/* Change Password */}
              <div className="flex items-center gap-3 p-2 rounded mb-1">
                <RiLockPasswordLine
                  size={29}
                  onClick={() => setShowPasswordInput(!showPasswordInput)}
                  className="cursor-pointer"
                />
                <div className="">
                  <span
                    style={{ fontSize: "19px", cursor: "pointer" }}
                    onClick={() => setShowPasswordInput(!showPasswordInput)}
                  >
                    Change Password
                  </span>
                  {showPasswordInput && (
                    <div className="flex">
                      <input
                        type="text"
                        className="form-control bg-transparent text-white p-1 ps-2"
                        value={editUser?.password}
                        onChange={(e) =>
                          setEditUser({ ...editUser, password: e.target.value })
                        }
                      />
                      <button
                        className="btn rounded-e rounded-l-none"
                        onClick={() => {
                          handleEditPassword();
                        }}
                        disabled={changingPassword ? true : false}
                      >
                        <MdDone size={20} color="white" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* LogOut */}
              <div className="flex items-center gap-3 p-2 rounded mb-1">
                <AiOutlineLogout
                  size={29}
                  onClick={() =>
                    setShowLogoutConfirmation(!showLogoutConfirmation)
                  }
                  className="cursor-pointer"
                />
                <div className="">
                  <span
                    style={{ fontSize: "19px", cursor: "pointer" }}
                    onClick={() =>
                      setShowLogoutConfirmation(!showLogoutConfirmation)
                    }
                  >
                    Logout
                  </span>
                  {showLogoutConfirmation && (
                    <div className="flex">
                      <p className="text-red-300">
                        Are you sure, you want to logout?
                      </p>
                      <button
                        className="btn rounded-e rounded-l-none"
                        onClick={() =>
                          setShowLogoutConfirmation(!showLogoutConfirmation)
                        }
                      >
                        <IoMdClose size={20} color="white" />
                      </button>
                      <button
                        className="btn rounded-e bg-red-600 hover:bg-red-700 rounded-l-none"
                        onClick={() => handleLogout()}
                      >
                        <MdDone size={20} color="white" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showFollowing} onHide={handleClose} centered backdrop={true}>
        <Modal.Body>
          <h1 className="text-xl mb-2">Followings</h1>
          <hr />
          {following.length === 0 ? (
            <h3 className="mt-3 text-gray-400">You don't follow anyone! </h3>
          ) : (
            <>
              {following?.map((user, index) => (
                <div key={index} className="mt-3 text-center">
                  <img src={user.image} className="mx-auto" width="50px" />
                  <p key={index}>{user.username}</p>
                </div>
              ))}
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showFollowers} onHide={handleClose} centered>
        <Modal.Body>
          <h1 className="text-xl mb-2">Followers</h1>
          <hr />
          {followers.length === 0 ? (
            <>
              <h3 className="mt-3 text-gray-400">You have no followers!</h3>
            </>
          ) : (
            <>
              {followers?.map((user, index) => (
                <div key={index} className="mt-3 text-center">
                  <img src={user.image} className="mx-auto" width="50px" />
                  <p key={index}>{user.username}</p>
                </div>
              ))}
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default UserProfile;

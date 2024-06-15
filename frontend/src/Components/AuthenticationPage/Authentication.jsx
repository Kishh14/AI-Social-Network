import React, { useEffect, useState } from "react";
import sideImg from "../../assets/sticker.png";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Authentication.css";
import { useDispatch } from "react-redux";
import { login_success } from "../../Redux/userSlice";

const Authentication = () => {
  const [login, setLogin] = useState(false);
  const [regitserUser, setRegisterUser] = useState({
    username: "",
    email: "",
    password: "",
    image: "",
  });
  const [loginUser, setLoginUser] = useState({ email: "", password: "" });
  const [buttonActive, setButtonActive] = useState(true);
  const [image, setImage] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchImage();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setButtonActive(false);
    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_API_AUTH_URL}/login`,
        loginUser
      );
      toast.success(resp.data.message);
      dispatch(
        login_success({ token: resp.data.token, details: resp.data.user })
      );
      navigate("/PostPage");
      sessionStorage.setItem("username", resp.data.user.username);
      sessionStorage.setItem("email", resp.data.user.email);
    } catch (error) {
      console.log(error);
      setButtonActive(true);
      toast.error(error.response.data.message);
    } finally {
      setButtonActive(true);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setButtonActive(false);
    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_API_AUTH_URL}/register`,
        regitserUser
      );
      toast.success(resp.data.message);
      setButtonActive(true);
      setLogin(true);
      setRegisterUser({ password: "" });
      setLoginUser({ ...loginUser, email: regitserUser.email });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setButtonActive(true);
    }
  };

  const names = [
    "max",
    "maria",
    "louis",
    "david",
    "lisa",
    "hina",
    "adam",
    "thomas",
    "joseph",
    "robert",
    "john",
    "sona",
    "modi",
    "neet",
  ];
  let randomNumber = Math.floor(Math.random() * names.length);

  const fetchImage = async () => {
    setRegisterUser({
      ...regitserUser,
      image: `https://api.multiavatar.com/${names[randomNumber]}.svg`,
    });
    const response = await axios.get(
      `https://api.multiavatar.com/${names[randomNumber]}.svg`
    );
    const svgData = response.data;
    const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgData)}`;
    setImage(svgDataUrl);
  };

  const changeImage = () => {
    fetchImage();
  };

  return (
    <div className="auth-page d-flex justify-content-center align-items-center">
      <div className="row g-0 auth-row rounded shadow-2xl ms-3 w-[70%]">
        <div className="col-md-6 img-div flex items-center ps-5">
          <img src={sideImg} alt="images of people" className="left-img" />
        </div>
        <div className="col-md-6 mt-12">
          <h5
            className="mt-4 mb-2 text-light text-center"
            style={{ cursor: "pointer" }}
          >
            <span
              className={`p-3 ${login ? "" : "toggle-btn"}`}
              onClick={() => setLogin(false)}
            >
              SignUp
            </span>{" "}
            <span
              className={`p-3 ${login ? "toggle-btn" : ""}`}
              onClick={() => setLogin(true)}
            >
              LogIn
            </span>
          </h5>

          {login ? (
            <form className="m-5 pt-8" onSubmit={handleLogin}>
              <label className="text-light mt-2">Email:</label>
              <input
                type="email"
                className="form-control"
                required
                value={loginUser.email}
                onChange={(e) =>
                  setLoginUser({ ...loginUser, email: e.target.value })
                }
              />
              <label className="text-light mt-2">Password:</label>
              <input
                type="password"
                className="form-control"
                required
                value={loginUser.password}
                onChange={(e) =>
                  setLoginUser({ ...loginUser, password: e.target.value })
                }
              />
              <button
                className="btn bg-purple-800 mt-4 text-white container-fluid"
                type="submit"
                disabled={!buttonActive}
              >
                {buttonActive ? "Log In" : "Logging In...."}
              </button>
            </form>
          ) : (
            <form className="m-5 mt-0" onSubmit={handleRegister}>
              <div className="relative mt-5 pt-1">
                {image && (
                  <img
                    src={image}
                    alt="avatar"
                    width="100px"
                    className="mx-auto"
                  />
                )}
                <i
                  className="fa-solid mt-2 fa-arrows-rotate text-light absolute top-1 right-40 bg-dark fs-5 z-10 cursor-pointer rounded-circle"
                  onClick={() => changeImage()}
                ></i>
              </div>
              <label className="text-light mt-2">Username</label>
              <input
                type="text"
                className="form-control"
                required
                value={regitserUser.username}
                onChange={(e) =>
                  setRegisterUser({ ...regitserUser, username: e.target.value })
                }
              />
              <label className="text-light mt-2">Email</label>
              <input
                type="email"
                className="form-control"
                required
                value={regitserUser.email}
                onChange={(e) =>
                  setRegisterUser({ ...regitserUser, email: e.target.value })
                }
              />
              <label className="text-light mt-2">Password</label>
              <input
                type="password"
                className="form-control"
                required
                value={regitserUser.password}
                onChange={(e) =>
                  setRegisterUser({ ...regitserUser, password: e.target.value })
                }
              />
              <button
                className="btn bg-purple-800 mt-4 text-white container-fluid"
                type="submit"
                disabled={!buttonActive}
              >
                {buttonActive ? "Sign Up" : "Signing  Up..."}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Authentication;

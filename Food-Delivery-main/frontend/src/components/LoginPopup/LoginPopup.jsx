import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currentState, setCurrentState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    try {
      let newUrl = url;
      if (currentState === "Login") {
        newUrl += "/api/auth/login";   // ✅ fixed
      } else {
        newUrl += "/api/auth/register"; // ✅ fixed
      }

      const response = await axios.post(newUrl, data, {
        headers: { "Content-Type": "application/json" },
      });

      const result = response.data;

      if (result.success) {
        setToken(result.token);
        localStorage.setItem("token", result.token);
        toast.success(
          currentState === "Login"
            ? "Login Successful"
            : "Account Created Successfully"
        );
        setShowLogin(false);
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Login/Register error:", error);
      toast.error(
        error.response?.data?.message || error.message || "Network/Server Error"
      );
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={onLogin}>
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img
            src={assets.cross_icon}
            alt="close"
            onClick={() => setShowLogin(false)}
          />
        </div>

        {currentState === "Sign Up" && (
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={data.name}
            onChange={onChangeHandler}
            required
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Your email"
          value={data.email}
          onChange={onChangeHandler}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={onChangeHandler}
          required
        />

        <button type="submit">{currentState === "Login" ? "Login" : "Sign Up"}</button>

        <p>
          {currentState === "Login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <span
            onClick={() =>
              setCurrentState(currentState === "Login" ? "Sign Up" : "Login")
            }
          >
            {currentState === "Login" ? " Sign Up" : " Login"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPopup;

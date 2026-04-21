import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
  const { setToken } = useContext(StoreContext);

  // ✅ USE ENV (IMPORTANT)
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [currentState, setCurrentState] = useState("Login");
  const [loading, setLoading] = useState(false);

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

    if (!data.email || !data.password) {
      return toast.error("Please fill all fields ❌");
    }

    if (currentState === "Sign Up" && !data.name) {
      return toast.error("Name is required ❌");
    }

    const endpoint =
      currentState === "Login"
        ? "/api/user/login"
        : "/api/user/register";

    try {
      setLoading(true);

      const response = await axios.post(
        `${BASE_URL}${endpoint}`,
        data
      );

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);

        toast.success(
          currentState === "Login"
            ? "Login Successful ✅"
            : "Account Created Successfully ✅"
        );

        setShowLogin(false);
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.error(error);
      toast.error("Server Error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">

        {/* TITLE */}
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="close"
          />
        </div>

        {/* INPUTS */}
        <div className="login-popup-inputs">

          {currentState === "Sign Up" && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}

          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />

          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Your password"
            required
          />
        </div>

        {/* BUTTON */}
        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : currentState === "Sign Up"
            ? "Create Account"
            : "Login"}
        </button>

        {/* TERMS */}
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms & privacy policy.</p>
        </div>

        {/* TOGGLE */}
        {currentState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrentState("Sign Up")}>
              Click here
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrentState("Login")}>
              Login here
            </span>
          </p>
        )}

      </form>
    </div>
  );
};

export default LoginPopup;
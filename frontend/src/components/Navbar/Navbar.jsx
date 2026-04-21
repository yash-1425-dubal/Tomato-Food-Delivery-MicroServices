import React, { useContext, useEffect, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");

  const { getTotalCartAmount, token, setToken } =
    useContext(StoreContext);

  const navigate = useNavigate();
  const location = useLocation();

  // ==========================
  // SYNC MENU WITH ROUTE
  // ==========================
  useEffect(() => {
    if (location.pathname === "/") setMenu("home");
    else if (location.pathname === "/cart") setMenu("cart");
    else if (location.pathname === "/myorders") setMenu("orders");
  }, [location]);

  // ==========================
  // LOGOUT
  // ==========================
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    toast.success("Logged out successfully ✅");
    navigate("/");
  };

  // ==========================
  // SCROLL HANDLER (HOME ONLY)
  // ==========================
  const handleScroll = (id, menuName) => {
    setMenu(menuName);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
        });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="navbar">

      {/* LOGO */}
      <Link to="/">
        <img
          src={assets.logo}
          alt="logo"
          className="logo"
        />
      </Link>

      {/* MENU */}
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          home
        </Link>

        <li
          onClick={() => handleScroll("explore-menu", "menu")}
          className={menu === "menu" ? "active" : ""}
        >
          menu
        </li>

        <li
          onClick={() => handleScroll("app-download", "mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}
        >
          mobile-app
        </li>

        <li
          onClick={() => handleScroll("footer", "contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          contact us
        </li>
      </ul>

      {/* RIGHT SIDE */}
      <div className="navbar-right">

        {/* SEARCH ICON */}
        <img src={assets.search_icon} alt="search" />

        {/* CART */}
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="cart" />
          </Link>

          {getTotalCartAmount() > 0 && (
            <div className="dot"></div>
          )}
        </div>

        {/* AUTH */}
        {!token ? (
          <button onClick={() => setShowLogin(true)}>
            Sign In
          </button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="profile" />

            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="" />
                <p>Orders</p>
              </li>

              <hr />

              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
import React from "react";
import "./Footer.css";
import { assets } from "../../assets/frontend_assets/assets";

const Footer = () => {

  // ==========================
  // SCROLL FUNCTION
  // ==========================
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="footer" id="footer">
      <div className="footer-content">

        {/* LEFT */}
        <div className="footer-content-left">
          <img src={assets.logo} alt="logo" />

          <p>
            Discover delicious meals crafted with care. From fresh ingredients
            to fast delivery, we bring your favorite food right to your doorstep.
          </p>

          <div className="footer-social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <img src={assets.facebook_icon} alt="facebook" />
            </a>

            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <img src={assets.twitter_icon} alt="twitter" />
            </a>

            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <img src={assets.linkedin_icon} alt="linkedin" />
            </a>
          </div>
        </div>

        {/* CENTER */}
        <div className="footer-content-center">
          <h2>Company</h2>
          <ul>
            <li onClick={() => window.scrollTo(0, 0)}>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* RIGHT */}
        <div className="footer-content-right">
          <h2>Get in touch</h2>
          <ul>
            <li>+91-9876543210</li>
            <li>support@foodapp.com</li>
          </ul>
        </div>

      </div>

      <hr />

      {/* COPYRIGHT */}
      <p className="footer-copyright">
        © {new Date().getFullYear()} FoodApp — All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
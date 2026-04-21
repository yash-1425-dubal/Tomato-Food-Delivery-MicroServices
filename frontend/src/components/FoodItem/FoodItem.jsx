import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);

  const quantity = cartItems?.[id] || 0;

  return (
    <div className="food-item">

      {/* IMAGE */}
      <div className="food-item-img-container">
        <img
          src={`${url}/images/${image}`}
          alt={name}
          className="food-item-image"
          onError={(e) => (e.target.src = "/fallback.png")}
        />

        {/* ADD / COUNTER */}
        {quantity === 0 ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt="add"
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt="remove"
            />
            <p>{quantity}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt="add"
            />
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="food-item-info">

        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="rating" />
        </div>

        <p className="food-item-desc">
          {description?.length > 60
            ? description.slice(0, 60) + "..."
            : description}
        </p>

        <p className="food-item-price">₹{price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
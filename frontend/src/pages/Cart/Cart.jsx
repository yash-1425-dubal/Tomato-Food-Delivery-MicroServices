import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const {
    food_list,
    cartItems,
    removeFromCart,
    getTotalCartAmount,
    url,
    token
  } = useContext(StoreContext);

  const navigate = useNavigate();

  // ==========================
  // CHECKOUT HANDLER
  // ==========================
  const handleCheckout = () => {
    if (!token) {
      toast.error("Please login first ❌");
      return navigate("/");
    }

    if (getTotalCartAmount() === 0) {
      toast.error("Cart is empty ❌");
      return;
    }

    navigate("/order");
  };

  return (
    <div className="cart">
      <div className="cart-items">

        {/* HEADER */}
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        <hr />

        {/* EMPTY CART */}
        {getTotalCartAmount() === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Your cart is empty 🛒
          </p>
        ) : (
          food_list.map((item) => {
            if (cartItems[item._id] > 0) {
              return (
                <div key={item._id}>
                  <div className="cart-items-title cart-items-item">

                    {/* IMAGE */}
                    <img
                      src={`${url}/images/${item.image}`}
                      alt={item.name}
                      onError={(e) => (e.target.src = "/fallback.png")}
                    />

                    {/* NAME */}
                    <p>{item.name}</p>

                    {/* PRICE */}
                    <p>₹{item.price}</p>

                    {/* QUANTITY */}
                    <p>{cartItems[item._id]}</p>

                    {/* TOTAL */}
                    <p>₹{item.price * cartItems[item._id]}</p>

                    {/* REMOVE */}
                    <p
                      onClick={() => removeFromCart(item._id)}
                      className="cross"
                    >
                      x
                    </p>
                  </div>
                  <hr />
                </div>
              );
            }
            return null;
          })
        )}
      </div>

      {/* ==========================
          CART TOTAL
      ========================== */}
      <div className="cart-bottom">

        <div className="cart-total">
          <h2>Cart Totals</h2>

          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ₹
                {getTotalCartAmount() === 0
                  ? 0
                  : getTotalCartAmount() + 2}
              </b>
            </div>
          </div>

          <button onClick={handleCheckout}>
            PROCEED TO CHECKOUT
          </button>
        </div>

        {/* PROMO */}
        <div className="cart-promocode">
          <div>
            <p>If you have a promocode, enter it here</p>

            <div className="cart-promocode-input">
              <input type="text" placeholder="Promo code" />
              <button>Apply</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const { getTotalCartAmount, token, food_list, cartItems } =
    useContext(StoreContext);

  // ✅ USE ENV (IMPORTANT)
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // ==========================
  // PLACE ORDER
  // ==========================
  const placeOrder = async (event) => {
    event.preventDefault();

    let orderItems = [];

    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          ...item,
          quantity: cartItems[item._id],
        });
      }
    });

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/api/order/place`,
        orderData,
        { headers: { token } }
      );

      if (!response.data.success) {
        return toast.error("Order failed ❌");
      }

      const resData = response.data;

      const options = {
        key: resData.key,
        amount: resData.amount,
        currency: "INR",
        name: "Food App",
        description: "Order Payment",
        order_id: resData.order_id,

        // ✅ FIXED HANDLER
        handler: function (paymentResponse) {
          // 🔥 REDIRECT instead of verify here
          navigate(
            `/verify?orderId=${resData.orderId}&paymentId=${paymentResponse.razorpay_payment_id}`
          );
        },

        prefill: {
          name: data.firstName + " " + data.lastName,
          email: data.email,
          contact: data.phone,
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      toast.error("Server Error ❌");
    }
  };

  // ==========================
  // VALIDATION
  // ==========================
  useEffect(() => {
    if (!token) {
      toast.error("Please login first ❌");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      toast.error("Cart is empty ❌");
      navigate("/cart");
    }
  }, [token, getTotalCartAmount, navigate]);

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input name="firstName" onChange={onChangeHandler} value={data.firstName} placeholder="First name" required />
          <input name="lastName" onChange={onChangeHandler} value={data.lastName} placeholder="Last name" required />
        </div>

        <input name="email" onChange={onChangeHandler} value={data.email} placeholder="Email" required />
        <input name="street" onChange={onChangeHandler} value={data.street} placeholder="Street" required />

        <div className="multi-fields">
          <input name="city" onChange={onChangeHandler} value={data.city} placeholder="City" required />
          <input name="state" onChange={onChangeHandler} value={data.state} placeholder="State" required />
        </div>

        <div className="multi-fields">
          <input name="zipcode" onChange={onChangeHandler} value={data.zipcode} placeholder="Zipcode" required />
          <input name="country" onChange={onChangeHandler} value={data.country} placeholder="Country" required />
        </div>

        <input name="phone" onChange={onChangeHandler} value={data.phone} placeholder="Phone" required />
      </div>

      <div className="place-order-right">
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
                ₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </b>
            </div>
          </div>

          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
import React, { useState, useEffect, useContext } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();

  const { token, admin } = useContext(StoreContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ ENV BASE URL
  const BASE_URL = import.meta.env.VITE_API_URL;

  // ==========================
  // FETCH ORDERS
  // ==========================
  const fetchAllOrder = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${BASE_URL}/api/order/list`,
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Failed to fetch orders ❌");
      }

    } catch (error) {
      console.error(error);
      toast.error("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // UPDATE STATUS
  // ==========================
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/order/status`,
        {
          orderId,
          status: event.target.value,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Order updated ✅");
        fetchAllOrder();
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.error(error);
      toast.error("Error updating order ❌");
    }
  };

  // ==========================
  // AUTH CHECK
  // ==========================
  useEffect(() => {
    if (!admin || !token) {
      toast.error("Please login first ❌");
      navigate("/");
      return;
    }

    fetchAllOrder();
  }, [admin, token]);

  return (
    <div className="order add">
      <h3>Order Page</h3>

      {/* LOADING */}
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="order-list">

          {orders.map((order) => (
            <div key={order._id} className="order-item">

              <img src={assets.parcel_icon} alt="parcel" />

              <div>

                {/* ITEMS */}
                <p className="order-item-food">
                  {order.items?.map((item, idx) =>
                    idx === order.items.length - 1
                      ? `${item.name} x ${item.quantity}`
                      : `${item.name} x ${item.quantity}, `
                  )}
                </p>

                {/* NAME */}
                <p className="order-item-name">
                  {order.address?.firstName} {order.address?.lastName}
                </p>

                {/* ADDRESS */}
                <div className="order-item-address">
                  <p>{order.address?.street},</p>
                  <p>
                    {order.address?.city}, {order.address?.state},{" "}
                    {order.address?.country}, {order.address?.zipcode}
                  </p>
                </div>

                {/* PHONE */}
                <p className="order-item-phone">
                  {order.address?.phone}
                </p>

              </div>

              <p>Items: {order.items?.length || 0}</p>

              <p>₹{order.amount}</p>

              {/* STATUS */}
              <select
                onChange={(event) =>
                  statusHandler(event, order._id)
                }
                value={order.status}
              >
                <option value="Food Processing">
                  Food Processing
                </option>
                <option value="Out for delivery">
                  Out for delivery
                </option>
                <option value="Delivered">
                  Delivered
                </option>
              </select>

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default Orders;
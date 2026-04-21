import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==========================
  // FETCH ORDERS
  // ==========================
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setData(response.data.data);
      } else {
        toast.error("Failed to fetch orders ❌");
      }

    } catch (error) {
      console.error(error);
      toast.error("Server Error ❌");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // AUTH CHECK
  // ==========================
  useEffect(() => {
    if (!token) {
      toast.error("Please login first ❌");
      navigate("/");
    } else {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : data.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="container">
          {data.map((order, index) => (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />

              {/* ITEMS */}
              <p>
                {order.items?.map((item, idx) =>
                  idx === order.items.length - 1
                    ? `${item.name} x ${item.quantity}`
                    : `${item.name} x ${item.quantity}, `
                )}
              </p>

              {/* AMOUNT */}
              <p>₹{order.amount}</p>

              {/* COUNT */}
              <p>Items: {order.items?.length || 0}</p>

              {/* STATUS */}
              <p>
                <span>●</span>
                <b> {order.status}</b>
              </p>

              {/* REFRESH */}
              <button onClick={fetchOrders}>Refresh</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
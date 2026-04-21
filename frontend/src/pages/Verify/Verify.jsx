import React, { useContext, useEffect } from "react";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get("orderId");
  const paymentId = searchParams.get("paymentId"); // ✅ important

  const { url, token } = useContext(StoreContext);

  const verifyPayment = async () => {
    try {
      if (!orderId) {
        toast.error("Invalid Order ❌");
        return navigate("/");
      }

      const response = await axios.post(
        `${url}/api/order/verify`,
        {
          orderId,
          razorpay_payment_id: paymentId, // ✅ match backend
        },
        {
          headers: { token }, // ✅ auth
        }
      );

      if (response.data.success) {
        toast.success("Order Placed Successfully ✅");
        navigate("/myorders");
      } else {
        toast.error("Payment Failed ❌");
        navigate("/");
      }

    } catch (error) {
      console.error(error);
      toast.error("Server Error ❌");
      navigate("/");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
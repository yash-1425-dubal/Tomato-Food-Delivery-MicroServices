import React, { useEffect, useState, useContext } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const List = () => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);

  const BASE_URL = import.meta.env.VITE_API_URL;

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/food/list`);

      if (res.data.success) {
        setList(res.data.data);
      }
    } catch {
      toast.error("Error fetching items ❌");
    } finally {
      setLoading(false);
    }
  };

  const removeFood = async (id) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/food/remove`,
        { id },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Deleted ✅");
        fetchList();
      }
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  useEffect(() => {
    if (!admin || !token) return navigate("/");
    fetchList();
  }, [admin, token]);

  return (
    <div className="list add flex-col">
      <h2>Food List</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="list-table">
          {list.map((item) => (
            <div key={item._id} className="list-table-format">
              <img
                src={`${BASE_URL}/images/${item.image}`}
                alt={item.name}
              />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>₹{item.price}</p>
              <p onClick={() => removeFood(item._id)}>X</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default List;
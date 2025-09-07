import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success && Array.isArray(response.data.data)) {
        setData(response.data.data.reverse()); // latest orders first
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      setError("Failed to fetch orders. Please try again.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      {loading && <p>Loading your orders...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && data.length === 0 && (
        <p className="no-orders">No orders yet. Start shopping!</p>
      )}

      <div className="container">
        {data.map((order, index) => {
          const orderDate = order?.date ? new Date(order.date) : null; // ✅ matches schema

          return (
            <div key={order._id || index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="Parcel Icon" />

              <p>
                {order?.items?.length > 0
                  ? order.items.map((item, idx) => (
                      <span key={idx}>
                        {item.name || "Item"} × {item.quantity || 0}
                        {idx !== order.items.length - 1 && ", "}
                      </span>
                    ))
                  : "No items"}
              </p>

              <p>₹{order?.amount?.toFixed(2) || "0.00"}</p>
              <p>Items: {order?.items?.length || 0}</p>
              <p>
                <span>&#x25cf;</span>
                <b> {order?.status || "Pending"}</b>
              </p>

              {orderDate && (
                <p className="order-date">
                  Ordered on: {orderDate.toLocaleDateString()} at{" "}
                  {orderDate.toLocaleTimeString()}
                </p>
              )}

              <button onClick={fetchOrders}>🔄 Refresh</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;

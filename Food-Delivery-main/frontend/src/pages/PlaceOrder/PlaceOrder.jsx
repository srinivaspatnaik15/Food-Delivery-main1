import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./PlaceOrder.css"; // optional for styling

const PlaceOrder = () => {
  const { cartItems, setCartItems, food_list, getTotalCartAmount, url, token, user } =
    useContext(StoreContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });

  const navigate = useNavigate();
  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const total = subtotal + deliveryFee;

  // handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    let orderItems = Object.keys(cartItems)
      .filter((id) => cartItems[id] > 0)
      .map((id) => {
        const item = food_list.find((food) => food._id === id);
        return {
          _id: id,
          name: item?.name,
          price: item?.price,
          quantity: cartItems[id],
        };
      });

    if (orderItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    let orderData = {
      userId: user?._id || undefined,
      address: formData,
      items: orderItems,
      amount: total,
      paymentMethod: "COD", // ✅ Cash on Delivery
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCartItems({});
        toast.success("🎉 Order placed successfully");
        navigate("/myorders");
      } else {
        toast.error("Order failed");
      }
    } catch (error) {
      console.error("❌ Backend save failed:", error);
      toast.error("Something went wrong while placing order");
    }
  };

  return (
    <div className="place-order">
      <form className="place-order-left" onSubmit={placeOrder}>
        <h2>Delivery Information</h2>
        <div className="multi-fields">
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={formData.street}
          onChange={handleChange}
          required
        />
        <div className="multi-fields">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>
        <div className="multi-fields">
          <input
            type="text"
            name="zip"
            placeholder="Zip Code"
            value={formData.zip}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </form>

      <div className="place-order-right">
        <h2>Cart Totals</h2>
        <div className="cart-total-details">
          <p>Subtotals</p>
          <p>₹{subtotal}</p>
        </div>
        <hr />
        <div className="cart-total-details">
          <p>Delivery Fee</p>
          <p>₹{deliveryFee}</p>
        </div>
        <hr />
        <div className="cart-total-details">
          <b>Total</b>
          <b>₹{total}</b>
        </div>
        <button type="submit" className="place-order-btn" onClick={placeOrder}>
          PLACE ORDER (CASH ON DELIVERY)
        </button>
      </div>
    </div>
  );
};

export default PlaceOrder;

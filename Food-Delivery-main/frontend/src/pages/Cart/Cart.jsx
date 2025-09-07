import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    food_list = [],
    cartItems = {},
    removeFromCart,
    getTotalCartAmount,
    url
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const totalAmount = getTotalCartAmount ? getTotalCartAmount() : 0;
  const deliveryFee = totalAmount === 0 ? 0 : 2;

  const hasItems = Object.values(cartItems).some((qty) => qty > 0);

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />

        {food_list.length > 0 && hasItems ? (
          food_list.map((item) => {
            const quantity = cartItems[item._id] || 0;
            if (quantity > 0) {
              return (
                <div key={item._id}>
                  <div className="cart-items-title cart-items-item">
                    <img
                      src={
                        item.image
                          ? `${url}/images/${item.image}`
                          : "https://via.placeholder.com/50"
                      }
                      alt={item.name || "Food"}
                    />
                    <p>{item.name || "Unknown Dish"}</p>
                    <p>₹{item.price || 0}</p>
                    <p>{quantity}</p>
                    <p>₹{(item.price || 0) * quantity}</p>
                    <p
                      onClick={() => removeFromCart && removeFromCart(item._id)}
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
        ) : (
          <p className="empty-cart">Your cart is empty.</p>
        )}
      </div>

      {hasItems && (
        <div className="cart-bottom">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotals</p>
                <p>₹{totalAmount}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>₹{deliveryFee}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>₹{totalAmount + deliveryFee}</b>
              </div>
            </div>
            <button onClick={() => navigate("/placeorder")}>
              PROCEED TO CHECKOUT
            </button>
          </div>

          <div className="cart-promocode">
            <div>
              <p>If you have a promocode, Enter it here</p>
              <div className="cart-promocode-input">
                <input type="text" placeholder="promo code" />
                <button>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

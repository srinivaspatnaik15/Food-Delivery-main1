import React from "react";
import "./FoodItem.css";

const FoodItem = ({ id, name, price, description, image }) => {
  return (
    <div className="food-item" key={id}>
      <img src={image} alt={name} className="food-item-img" />
      <div className="food-item-info">
        <h3>{name}</h3>
        <p>{description}</p>
        <span>${price}</span>
      </div>
    </div>
  );
};

export default FoodItem;

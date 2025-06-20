import React from "react";
import "./Payment.scss";

const Payment = ({ name, address, ValidDate }) => {
  return (
    <div className="payment-card">
      <span className="font-semibold text-1xl">{name}</span>
      <div className="desc flex justify-between">
        <p>{address}</p>
        <p>{ValidDate}</p>
      </div>
      <button className="delete-btn">Delete</button>
    </div>
  );
};

export default Payment;

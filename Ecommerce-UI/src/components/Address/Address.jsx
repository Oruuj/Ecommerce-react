import React from "react";
import "./Address.scss";

const Address = ({ name, address }) => {
  return (
    <div className="address-card">
      <span className="font-semibold text-1xl">{name}</span>
      <p>{address}</p>
      <button className="delete-btn">Delete</button>
    </div>
  );
};

export default Address;
